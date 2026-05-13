"""
The Brain Studio — FastAPI backend.

Phase 1   /health, /api/predictions, /api/predictions/{id}
Phase 10  /api/infer/text wired to the real TRIBE pipeline when available.

Inference engine selection:
  - TRIBE_ENGINE=real   attempt the real forward pass (requires Meta's
                        tribe / neuralset packages + Llama-3.2-3B locally).
  - TRIBE_ENGINE=stub   (default) load the checkpoint metadata only;
                        /api/infer/text returns 503 with a rich
                        diagnostic payload that the frontend uses to
                        fall back to its local fakePredictor.

Either way the same code path runs on the frontend; the only thing that
changes is whether the response is a real prediction.
"""

from __future__ import annotations

import os
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from .predictions import list_available, load_prediction  # noqa: E402
from tribe.loader import make_predictor, TribePredictor  # noqa: E402

app = FastAPI(
    title="The Brain Studio API",
    version="0.2.0",
    description="Backend for TRIBE-powered brain visualization.",
)

_vercel_pattern = os.environ.get("VERCEL_URL_PATTERN", r"https://.*\.vercel\.app")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_origin_regex=_vercel_pattern,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# Lazy-cached predictor. None means the checkpoint isn't present and the
# /api/infer/text route returns 503 with a clear message.
_predictor: TribePredictor | None = None
_predictor_inspected = False


def get_predictor() -> TribePredictor | None:
    global _predictor, _predictor_inspected
    if not _predictor_inspected:
        _predictor = make_predictor()
        _predictor_inspected = True
    return _predictor


class HealthResponse(BaseModel):
    status: str
    tribe_engine: str
    checkpoint_present: bool
    hidden_size: int | None = None
    n_layers: int | None = None
    text_backbone: str | None = None


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    p = get_predictor()
    if p is None:
        return HealthResponse(
            status="ok", tribe_engine="absent", checkpoint_present=False,
        )
    return HealthResponse(
        status="ok",
        tribe_engine=p.engine,
        checkpoint_present=True,
        hidden_size=p.info.hidden_size,
        n_layers=p.info.n_layers,
        text_backbone=p.info.text_backbone,
    )


class InferTextRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=4000)


@app.post("/api/infer/text")
def infer_text(req: InferTextRequest) -> dict[str, Any]:
    p = get_predictor()
    if p is None:
        raise HTTPException(
            status_code=503,
            detail={
                "reason": "checkpoint_missing",
                "message": (
                    "TRIBE v2 checkpoint not found at the expected HF cache "
                    "path. The frontend should fall back to its local "
                    "fakePredictor for this preview."
                ),
            },
        )

    try:
        regions = p.predict(req.text)
        return {
            "engine": p.engine,
            "text_preview": req.text[:200],
            "regions": regions,
            "metadata": {
                "checkpoint_path": str(p.info.path),
                "text_backbone": p.info.text_backbone,
                "hidden_size": p.info.hidden_size,
                "hemodynamic_offset_s": p.info.hemodynamic_offset_s,
            },
        }
    except NotImplementedError as e:
        raise HTTPException(
            status_code=503,
            detail={
                "reason": "engine_not_wired",
                "message": str(e),
                "checkpoint_info": {
                    "path": str(p.info.path),
                    "size_bytes": p.info.size_bytes,
                    "hidden_size": p.info.hidden_size,
                    "n_layers": p.info.n_layers,
                    "text_backbone": p.info.text_backbone,
                    "output_frequency_hz": p.info.output_frequency_hz,
                    "hemodynamic_offset_s": p.info.hemodynamic_offset_s,
                },
            },
        )


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
