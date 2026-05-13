"""
The Brain Studio — FastAPI backend.

Phase 1: /health, /api/predictions (lists precomputed), /api/predictions/{id}
(fetches one), and a /api/infer/text stub that returns 503. Phase 10 wires
real TRIBE v2 inference at backend/tribe/loader.py.
"""

from __future__ import annotations

import os
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .predictions import list_available, load_prediction

app = FastAPI(
    title="The Brain Studio API",
    version="0.1.0",
    description="Backend for TRIBE-powered brain visualization.",
)

# CORS: localhost during dev + Vercel deploy URL pattern.
_vercel_pattern = os.environ.get("VERCEL_URL_PATTERN", r"https://.*\.vercel\.app")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_origin_regex=_vercel_pattern,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class HealthResponse(BaseModel):
    status: str
    tribe_inference: str


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", tribe_inference="not-wired")


class InferTextRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=4000)


@app.post("/api/infer/text")
def infer_text(_: InferTextRequest) -> dict[str, Any]:
    raise HTTPException(
        status_code=503,
        detail=(
            "TRIBE inference not yet wired. Serve precomputed predictions via "
            "/api/predictions/{stimulus_id} for now."
        ),
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
