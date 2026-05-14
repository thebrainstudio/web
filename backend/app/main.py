"""
The Brain Studio — FastAPI backend (Phase 10).

Phase-10 spec compliance:
  /v1/predict     POST  text→20-region prediction, with rate limit + cache
  /healthz        GET   liveness + engine status (200 only when model loaded)
  /metrics        GET   Prometheus-format counters + latency histogram
  /api/v1/predict POST  back-compat alias for /v1/predict
  /api/infer/text POST  back-compat alias for /v1/predict
  /api/predictions     legacy precomputed-stimulus endpoints (Phase 1)

Engine cascade (first match wins):
  1. real TRIBE v2     (when checkpoint loads + TRIBE_ENGINE=real + Llama
                        weights accessible)  →  is_proxy=False
  2. embedding baseline (fastembed BGE-small over 20 curated anchor
                        texts)              →  is_proxy=True
  3. 503 / fallback     (neither available) →  frontend falls back to
                        lib/fakePredictor.ts locally

Same response shape across engines — only the `is_proxy` and
`model_version` fields differ honestly.
"""

from __future__ import annotations

import json
import logging
import os
import sys
import time
import unicodedata
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request, Response, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse
from pydantic import ValidationError

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from .predictions import list_available, load_prediction  # noqa: E402
from .runtime import (  # noqa: E402
    confidence_from_activations,
    hash_ip,
    metrics,
    new_request_id,
    prediction_cache,
    rate_limiter,
)
from .schemas import (  # noqa: E402
    EncoderResult,
    ErrorResponse,
    HealthResponse,
    PredictRequest,
)
from tribe.embedding_engine import (  # noqa: E402
    EmbeddingBaselineEngine,
    make_embedding_engine,
)
from tribe.loader import make_predictor, TribePredictor  # noqa: E402


# ── Logging ──────────────────────────────────────────────────────────


class JsonLogFormatter(logging.Formatter):
    """One JSON object per log line. Easier to ship to ELK / Loki later."""

    def format(self, record: logging.LogRecord) -> str:
        base: dict[str, Any] = {
            "ts": self.formatTime(record, "%Y-%m-%dT%H:%M:%S%z"),
            "level": record.levelname,
            "logger": record.name,
            "msg": record.getMessage(),
        }
        if record.exc_info:
            base["exc"] = self.formatException(record.exc_info)
        # Attach any structured "extra" fields.
        for k, v in record.__dict__.items():
            if k in (
                "args", "msg", "name", "levelname", "levelno", "pathname",
                "filename", "module", "exc_info", "exc_text", "stack_info",
                "lineno", "funcName", "created", "msecs", "relativeCreated",
                "thread", "threadName", "processName", "process",
                "taskName", "asctime",
            ):
                continue
            try:
                json.dumps(v)
                base[k] = v
            except (TypeError, ValueError):
                base[k] = repr(v)
        return json.dumps(base, default=str)


def _setup_logging() -> None:
    root = logging.getLogger()
    if root.handlers:
        return
    handler = logging.StreamHandler()
    handler.setFormatter(JsonLogFormatter())
    root.addHandler(handler)
    root.setLevel(os.environ.get("LOG_LEVEL", "INFO"))


_setup_logging()
logger = logging.getLogger("brain_studio")


# ── Engine bootstrap (lazy) ──────────────────────────────────────────


_tribe_predictor: TribePredictor | None = None
_tribe_inspected = False
_embedding_engine: EmbeddingBaselineEngine | None = None
_embedding_inspected = False


def get_tribe() -> TribePredictor | None:
    global _tribe_predictor, _tribe_inspected
    if not _tribe_inspected:
        _tribe_predictor = make_predictor()
        _tribe_inspected = True
        if _tribe_predictor is not None:
            logger.info(
                "tribe predictor staged",
                extra={
                    "engine": _tribe_predictor.engine,
                    "checkpoint_path": str(_tribe_predictor.info.path),
                    "hidden_size": _tribe_predictor.info.hidden_size,
                },
            )
    return _tribe_predictor


def get_embedding() -> EmbeddingBaselineEngine | None:
    global _embedding_engine, _embedding_inspected
    if not _embedding_inspected:
        _embedding_engine = make_embedding_engine()
        _embedding_inspected = True
        # Don't pre-load weights here — first request triggers it.
    return _embedding_engine


# ── FastAPI app ──────────────────────────────────────────────────────


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Probe engines at startup so /healthz can answer truthfully."""
    logger.info("brain_studio backend starting")
    get_tribe()
    get_embedding()
    yield
    logger.info("brain_studio backend stopping")


app = FastAPI(
    title="The Brain Studio API",
    version="0.10.0",
    description=(
        "Phase 10 backend. Text → 20-region brain activation prediction "
        "via TRIBE v2 (real) or the embedding baseline (proxy)."
    ),
    lifespan=lifespan,
)

ALLOWED_ORIGINS = [
    o.strip()
    for o in os.environ.get(
        "ALLOWED_ORIGINS",
        "https://brain-studio-kappa.vercel.app,http://localhost:3000,http://127.0.0.1:3000,http://localhost:3100,http://127.0.0.1:3100",
    ).split(",")
    if o.strip()
]

_vercel_pattern = os.environ.get(
    "VERCEL_URL_PATTERN", r"https://.*\.vercel\.app"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=_vercel_pattern,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=[
        "X-Request-Id",
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "X-RateLimit-Reset",
        "X-RateLimit-Window",
        "X-Model-Version",
    ],
)


# ── Middleware: request id + structured logging ──────────────────────


@app.middleware("http")
async def request_context(request: Request, call_next):
    request_id = request.headers.get("X-Request-Id") or new_request_id()
    request.state.request_id = request_id
    request.state.t0 = time.time()
    response: Response = await call_next(request)
    latency_ms = (time.time() - request.state.t0) * 1000.0
    response.headers["X-Request-Id"] = request_id
    response.headers["Server-Timing"] = f"app;dur={latency_ms:.1f}"
    metrics.record_request(request.url.path, response.status_code, latency_ms)
    logger.info(
        "request",
        extra={
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "status": response.status_code,
            "latency_ms": round(latency_ms, 2),
            "ip_hash": hash_ip(request.client.host if request.client else "unknown"),
            "ua": request.headers.get("user-agent", "")[:120],
        },
    )
    return response


# ── Error handlers (uniform JSON shape) ─────────────────────────────


@app.exception_handler(RequestValidationError)
async def _validation_handler(req: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content=ErrorResponse(
            error="validation_failed",
            message="; ".join(
                f"{'.'.join(str(p) for p in e['loc'])}: {e['msg']}"
                for e in exc.errors()
            ),
            request_id=getattr(req.state, "request_id", None),
        ).model_dump(),
    )


# ── Helpers ─────────────────────────────────────────────────────────


def _normalize_text(raw: str) -> str:
    """NFC normalize + strip control chars but keep printable Unicode."""
    # Unicode normalization first so Thai / Japanese / Chinese aren't
    # split into compatibility forms.
    normalized = unicodedata.normalize("NFC", raw)
    # Strip C0 + C1 control characters but keep TAB / LF / CR.
    cleaned = "".join(
        ch
        for ch in normalized
        if ch in ("\t", "\n", "\r")
        or unicodedata.category(ch)[0] != "C"
    )
    return cleaned.strip()


def _client_ip(request: Request) -> str:
    # Trust Cloudflare's CF-Connecting-IP if present (tunnel deployment).
    cf = request.headers.get("cf-connecting-ip")
    if cf:
        return cf
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _gpu_info() -> tuple[bool, str | None, float | None, float | None]:
    try:
        import torch
    except ImportError:
        return False, None, None, None
    if not torch.cuda.is_available():
        return False, None, None, None
    name = torch.cuda.get_device_name(0)
    free, total = torch.cuda.mem_get_info()
    return True, name, free / 1e9, total / 1e9


def _build_encoder_result(
    activations: dict[str, float],
    model_version: str,
    is_proxy: bool,
    latency_ms: float,
    extra_metadata: dict[str, Any] | None = None,
    cached: bool = False,
) -> EncoderResult:
    payload: dict[str, Any] = {
        "activations": activations,
        "confidence": confidence_from_activations(activations),
        "model_version": model_version,
        "is_proxy": is_proxy,
        "inference_latency_ms": round(latency_ms, 2),
        "cached": cached,
    }
    if extra_metadata:
        payload.update(extra_metadata)
    return EncoderResult(**payload)


def _run_inference(text: str, locale: str) -> tuple[EncoderResult, dict[str, str]]:
    """
    Engine cascade — returns (result, extra_headers).
    Caller is responsible for setting status code (200 / 503).
    """
    t0 = time.time()
    headers: dict[str, str] = {}

    # Engine 1: real TRIBE.
    tribe = get_tribe()
    if tribe is not None and tribe.engine == "real":
        try:
            regions = tribe.predict(text)
            latency_ms = (time.time() - t0) * 1000.0
            headers["X-Model-Version"] = "tribe-v2"
            result = _build_encoder_result(
                activations=regions,
                model_version="tribe-v2",
                is_proxy=False,
                latency_ms=latency_ms,
                extra_metadata={
                    "text_preview": text[:200],
                    "engine_detail": {
                        "checkpoint_path": str(tribe.info.path),
                        "hidden_size": tribe.info.hidden_size,
                        "text_backbone": tribe.info.text_backbone,
                        "hemodynamic_offset_s": tribe.info.hemodynamic_offset_s,
                    },
                },
            )
            return result, headers
        except NotImplementedError as e:
            logger.info(
                "real_tribe_unavailable",
                extra={"reason": str(e)},
            )

    # Engine 2: embedding baseline.
    embedding = get_embedding()
    if embedding is not None and embedding.lazy_load():
        regions = embedding.predict(text)
        latency_ms = (time.time() - t0) * 1000.0
        headers["X-Model-Version"] = embedding.engine_name
        result = _build_encoder_result(
            activations=regions,
            model_version=embedding.engine_name,
            is_proxy=True,
            latency_ms=latency_ms,
            extra_metadata={
                "text_preview": text[:200],
                "engine_detail": {
                    "model": embedding.model_name,
                    "load_seconds": embedding.load_seconds,
                    "note": (
                        "Embedding-baseline predictor: cosine similarity "
                        "between input and curated region anchor texts, "
                        "softmax-mapped to activations. Not TRIBE."
                    ),
                },
            },
        )
        return result, headers

    # Both engines unavailable — 503 with a structured error.
    raise HTTPException(
        status_code=503,
        detail={
            "error": "no_engine_available",
            "message": (
                "Neither real TRIBE inference nor the embedding-baseline "
                "engine is ready. Check /healthz for engine state."
            ),
        },
    )


# ── /v1/predict (canonical) ─────────────────────────────────────────


def _predict_impl(req: PredictRequest, request: Request) -> JSONResponse:
    # Rate limit per IP (sliding window).
    ip = _client_ip(request)
    allowed, retry_after, headers = rate_limiter.check(ip)
    if not allowed:
        return JSONResponse(
            status_code=429,
            content=ErrorResponse(
                error="rate_limited",
                message=(
                    f"Too many requests. Retry after {int(retry_after)}s."
                ),
                request_id=getattr(request.state, "request_id", None),
            ).model_dump(),
            headers={**headers, "Retry-After": str(int(retry_after))},
        )

    text = _normalize_text(req.text)
    if len(text) < 1:
        return JSONResponse(
            status_code=400,
            content=ErrorResponse(
                error="text_empty_after_normalization",
                message="Text was empty after Unicode normalization.",
                request_id=getattr(request.state, "request_id", None),
            ).model_dump(),
            headers=headers,
        )

    # Cache lookup: keyed on (sha256(text), locale, currently-active engine version).
    tribe = get_tribe()
    embedding = get_embedding()
    if tribe is not None and tribe.engine == "real":
        cache_engine_id = "tribe-v2"
    elif embedding is not None:
        cache_engine_id = embedding.engine_name
    else:
        cache_engine_id = "unknown"
    cache_key = prediction_cache.make_key(text, req.locale, cache_engine_id)
    cached_payload = prediction_cache.get(cache_key)
    if cached_payload is not None:
        metrics.record_cache(hit=True)
        # Mark cached and return.
        cached_payload = {**cached_payload, "cached": True}
        return JSONResponse(
            content=cached_payload,
            headers={
                **headers,
                "X-Cache": "HIT",
                "X-Model-Version": cached_payload.get("model_version", "unknown"),
            },
        )
    metrics.record_cache(hit=False)

    # Live inference.
    result, infer_headers = _run_inference(text, req.locale)
    payload = result.model_dump()
    prediction_cache.put(cache_key, payload)
    return JSONResponse(
        content=payload,
        headers={**headers, **infer_headers, "X-Cache": "MISS"},
    )


@app.post("/v1/predict")
def predict_v1(req: PredictRequest, request: Request) -> JSONResponse:
    return _predict_impl(req, request)


# Back-compat aliases — keep old paths working so the frontend
# tribeClient doesn't need to know which backend version is running.
@app.post("/api/v1/predict")
def predict_v1_aliased(req: PredictRequest, request: Request) -> JSONResponse:
    return _predict_impl(req, request)


@app.post("/api/infer/text")
def infer_text_legacy(req: PredictRequest, request: Request) -> JSONResponse:
    return _predict_impl(req, request)


# ── /healthz ─────────────────────────────────────────────────────────


@app.get("/healthz", response_model=HealthResponse)
def healthz() -> HealthResponse:
    tribe = get_tribe()
    embedding = get_embedding()
    embedding_loaded = embedding is not None and embedding.lazy_load()
    tribe_real = tribe is not None and tribe.engine == "real"

    if tribe_real:
        active = "tribe-v2"
        status_str = "ok"
    elif embedding_loaded:
        active = embedding.engine_name
        status_str = "ok"
    elif embedding is not None:
        active = "loading"
        status_str = "loading"
    else:
        active = "none"
        status_str = "error"

    has_gpu, gpu_name, vram_free, vram_total = _gpu_info()
    return HealthResponse(
        status=status_str,
        active_engine=active,
        tribe_loaded=tribe_real,
        embedding_loaded=embedding_loaded,
        gpu_available=has_gpu,
        gpu_name=gpu_name,
        vram_free_gb=round(vram_free, 2) if vram_free else None,
        vram_total_gb=round(vram_total, 2) if vram_total else None,
        uptime_seconds=round(metrics.uptime(), 1),
    )


# Back-compat: keep the old /health endpoint.
@app.get("/health")
def health_legacy() -> HealthResponse:
    return healthz()


# ── /metrics ─────────────────────────────────────────────────────────


@app.get("/metrics")
def get_metrics() -> PlainTextResponse:
    return PlainTextResponse(
        content=metrics.to_prometheus(),
        media_type="text/plain; version=0.0.4",
    )


# ── Legacy precomputed-stimulus endpoints ───────────────────────────


@app.get("/api/predictions")
def list_predictions() -> dict[str, list[str]]:
    return {"available": list_available()}


@app.get("/api/predictions/{stimulus_id}")
def get_prediction(stimulus_id: str) -> dict[str, Any]:
    data = load_prediction(stimulus_id)
    if data is None:
        raise HTTPException(
            status_code=404,
            detail=f"No precomputed prediction for stimulus '{stimulus_id}'.",
        )
    return data
