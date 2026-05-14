"""
Vercel Python serverless function — text → 20-region brain prediction.

Engine: embedding_baseline_v1_hf
  - User text is embedded via HuggingFace's hosted Inference API using
    `BAAI/bge-small-en-v1.5`. Requires an HF_TOKEN env var (free
    accounts get a generous quota).
  - Region anchor embeddings (20 × 384) are shipped with the function
    as `region_anchor_embeddings.json` (~160 KB). They were generated
    locally from the same model so the query and anchors live in
    identical embedding space.
  - Cosine similarity between query and anchors → softmax (T=0.45)
    → rescaled to [0.18, 0.95] → activation dict.

Why HuggingFace and not a local ONNX model: Vercel Hobby plan caps a
function bundle at 50 MB unzipped. fastembed + onnxruntime is ~150 MB,
way over. The HF Inference API gives us the same quality of embedding
for the price of a ~300 ms network hop.
"""

from __future__ import annotations

import json
import math
import os
import time
from http.server import BaseHTTPRequestHandler
from pathlib import Path
from urllib import request as urllib_request
from urllib.error import HTTPError, URLError

# Loaded once per cold-start. Each warm invocation reuses it.
_ANCHOR_CACHE_PATH = Path(__file__).resolve().parent / "region_anchor_embeddings.json"
_ANCHORS_LOADED: dict | None = None


def _load_anchors() -> dict:
    """Read the precomputed region anchors. Lazy + cached."""
    global _ANCHORS_LOADED
    if _ANCHORS_LOADED is not None:
        return _ANCHORS_LOADED
    with _ANCHOR_CACHE_PATH.open("r", encoding="utf-8") as fp:
        _ANCHORS_LOADED = json.load(fp)
    return _ANCHORS_LOADED


# Use the same model the anchor embeddings were precomputed with so
# the query and anchors live in identical embedding space. BGE-small-
# en-v1.5 is hosted on HF's new router as a feature-extraction model.
_HF_MODEL = os.environ.get("HF_EMBEDDING_MODEL", "BAAI/bge-small-en-v1.5")
_HF_URL = (
    f"https://router.huggingface.co/hf-inference/models/{_HF_MODEL}"
    "/pipeline/feature-extraction"
)


def _embed_via_hf(text: str, timeout_s: float = 12.0) -> list[float] | None:
    """
    POST the text to HuggingFace's free feature-extraction endpoint.
    Returns the 384-dim vector or None on any failure.
    """
    body = json.dumps({"inputs": text, "options": {"wait_for_model": True}}).encode(
        "utf-8"
    )
    headers = {"content-type": "application/json"}
    if token := os.environ.get("HF_TOKEN"):
        headers["authorization"] = f"Bearer {token}"
    req = urllib_request.Request(_HF_URL, data=body, headers=headers, method="POST")
    try:
        with urllib_request.urlopen(req, timeout=timeout_s) as resp:
            payload = json.loads(resp.read())
    except (HTTPError, URLError, TimeoutError) as e:
        print(f"[predict] HF embed failed: {e}")
        return None

    # HF returns either a flat [384] vector or [tokens, 384]. Mean-pool
    # the second case to a single [384].
    if isinstance(payload, list) and payload and isinstance(payload[0], list):
        # 2D — mean over rows
        if not all(isinstance(row, list) for row in payload):
            return None
        n_rows = len(payload)
        dim = len(payload[0])
        out = [0.0] * dim
        for row in payload:
            for i, v in enumerate(row):
                out[i] += float(v)
        return [x / max(1, n_rows) for x in out]
    if isinstance(payload, list) and all(isinstance(x, (int, float)) for x in payload):
        return [float(x) for x in payload]
    return None


def _dot(a: list[float], b: list[float]) -> float:
    return sum(x * y for x, y in zip(a, b))


def _norm(v: list[float]) -> float:
    return math.sqrt(sum(x * x for x in v)) or 1.0


def _cosine(a: list[float], b: list[float]) -> float:
    return _dot(a, b) / (_norm(a) * _norm(b))


def _activations_from_similarity(
    sims_by_region: dict[str, float], temperature: float = 0.45
) -> dict[str, float]:
    """
    Softmax + rescale to [0.18, 0.95] so the activation distribution
    reads on the brain colour ramp without saturating either end.
    """
    region_ids = list(sims_by_region.keys())
    sims = [sims_by_region[r] for r in region_ids]
    m = max(sims)
    t = max(0.05, float(temperature))
    exps = [math.exp((s - m) / t) for s in sims]
    z = sum(exps) or 1.0
    probs = [e / z for e in exps]
    max_p = max(probs)
    min_p = min(probs)
    span = max_p - min_p or 1.0
    return {
        rid: round(0.18 + ((p - min_p) / span) * 0.77, 4)
        for rid, p in zip(region_ids, probs)
    }


def _predict(text: str) -> dict:
    t0 = time.time()
    cleaned = text.strip()
    if len(cleaned) < 3:
        anchors = _load_anchors()
        return {
            "engine": "embedding_baseline_v1_hf",
            "text_preview": cleaned[:200],
            "regions": {rid: 0.0 for rid in anchors["anchors"]},
            "metadata": {"reason": "below_threshold"},
        }

    anchors = _load_anchors()
    query = _embed_via_hf(cleaned)
    if query is None:
        # Even on HF failure we want a graceful, honest response — the
        # frontend's tribeClient treats a non-2xx as "fall back to
        # fakePredict locally" so we surface a 503 instead.
        return {
            "_error": True,
            "status": 503,
            "engine": "embedding_baseline_v1_hf",
            "reason": "hf_inference_unavailable",
            "message": (
                f"Feature-extraction request to {_HF_MODEL} failed. "
                "Frontend will fall back to lib/fakePredictor.ts."
            ),
        }

    sims = {
        rid: _cosine(query, vec)
        for rid, vec in anchors["anchors"].items()
    }
    regions = _activations_from_similarity(sims)
    elapsed_ms = int((time.time() - t0) * 1000)
    return {
        "engine": "embedding_baseline_v1_hf",
        "text_preview": cleaned[:200],
        "regions": regions,
        "metadata": {
            "model_anchor": anchors.get("model"),
            "model_query": _HF_MODEL,
            "elapsed_ms": elapsed_ms,
            "note": (
                "Embedding baseline: cosine similarity between input text "
                "and 20 curated region anchors, softmax-mapped. Not TRIBE."
            ),
        },
    }


class handler(BaseHTTPRequestHandler):
    """
    Vercel Python entry point. POST /api/v1/predict accepts
    {text: string} and returns the prediction envelope.
    """

    def _send_json(self, status: int, body: dict) -> None:
        payload = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json")
        self.send_header("access-control-allow-origin", "*")
        self.send_header("cache-control", "no-store")
        self.send_header("content-length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self) -> None:  # noqa: N802 — stdlib naming convention
        # Health probe — useful for the frontend to detect engine state
        # before making a real predict call.
        anchors = _load_anchors()
        self._send_json(
            200,
            {
                "status": "ok",
                "engine": "embedding_baseline_v1_hf",
                "anchor_model": anchors.get("model"),
                "query_model": _HF_MODEL,
                "anchor_count": len(anchors.get("anchors", {})),
                "vector_dim": anchors.get("dim"),
            },
        )

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self.send_header("access-control-allow-origin", "*")
        self.send_header("access-control-allow-methods", "POST, OPTIONS, GET")
        self.send_header("access-control-allow-headers", "content-type, authorization")
        self.send_header("access-control-max-age", "86400")
        self.end_headers()

    def do_POST(self) -> None:  # noqa: N802
        length = int(self.headers.get("content-length", "0") or "0")
        try:
            body = json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError:
            return self._send_json(
                400, {"error": "invalid_json", "message": "Body must be JSON."}
            )

        text = body.get("text")
        if not isinstance(text, str):
            return self._send_json(
                400,
                {
                    "error": "missing_text",
                    "message": "Expected {text: string} in request body.",
                },
            )
        if len(text) > 4000:
            return self._send_json(
                400,
                {
                    "error": "text_too_long",
                    "message": "Max 4000 characters.",
                },
            )

        result = _predict(text)
        if result.get("_error"):
            return self._send_json(
                result.get("status", 503),
                {k: v for k, v in result.items() if k != "_error"},
            )
        return self._send_json(200, result)
