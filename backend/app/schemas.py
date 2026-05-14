"""
Wire-level types for the Brain Studio API.

`EncoderResult` is the shape the frontend's `lib/api/brain-encoder.ts`
expects. It is intentionally engine-agnostic: real TRIBE, the embedding
baseline, and any future swap-in (a distilled model, a multimodal
extension) all return the same envelope. The only honest difference is
the `is_proxy` flag — true when the response did not come from the real
TRIBE checkpoint.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

# The 20 Brain Studio region IDs — keep in lockstep with
# frontend/lib/regions.ts.
RegionId = Literal[
    "ifg_left", "ifg_right",
    "pstg_left", "pstg_right",
    "mtg_left", "mtg_right",
    "atl_left", "atl_right",
    "agl_left", "agl_right",
    "hg_left", "hg_right",
    "vmpfc", "dmpfc",
    "pcc", "precuneus",
    "amyg_left", "amyg_right",
    "hipp_left", "hipp_right",
]

Locale = Literal["en", "th", "es", "ca", "ja", "zh-CN"]


class PredictRequest(BaseModel):
    """POST body for /v1/predict."""

    model_config = ConfigDict(extra="forbid")

    text: str = Field(..., min_length=1, max_length=5000)
    locale: Locale = "en"


class EncoderResult(BaseModel):
    """
    Wire envelope. Same shape regardless of engine.

    `is_proxy = True` whenever the response did not come from a real
    TRIBE forward pass. The frontend uses this to surface an honest
    "running on baseline" indicator on the Mirror page instead of
    falsely advertising TRIBE.
    """

    model_config = ConfigDict(
        # Allow arbitrary additional metadata keys engines may want to
        # attach (load_seconds, parcellation, etc.) without forcing a
        # schema change here.
        extra="allow",
    )

    activations: dict[str, float] = Field(
        description=(
            "Region ID → activation in [0, 1]. Covers all 20 Brain "
            "Studio regions; missing regions imply 0.0."
        ),
    )
    confidence: float = Field(
        ge=0.0,
        le=1.0,
        description=(
            "Peakedness of the prediction distribution. Top region's "
            "z-score against the mean, sigmoid-squashed. Higher = the "
            "model picked specific regions; lower = the input was "
            "ambiguous to the model."
        ),
    )
    model_version: str = Field(
        description=(
            "Identifier for the engine that produced the prediction. "
            "Examples: 'tribe-v2', 'embedding_baseline_v1', "
            "'embedding_baseline_v1_hf'."
        ),
    )
    is_proxy: bool = Field(
        description=(
            "True if NOT a real TRIBE forward pass. The frontend "
            "surfaces this honestly in the attribution chip."
        ),
    )
    inference_latency_ms: float = Field(
        ge=0.0,
        description="End-to-end inference time, milliseconds.",
    )
    cached: bool = Field(
        default=False,
        description="True if the response came from the prediction cache.",
    )


class ErrorResponse(BaseModel):
    """4xx / 5xx body."""

    error: str = Field(description="Stable machine-readable error code.")
    message: str = Field(description="Human-readable explanation.")
    request_id: str | None = None


class HealthResponse(BaseModel):
    """GET /healthz body."""

    status: Literal["ok", "loading", "error"] = "ok"
    active_engine: str
    tribe_loaded: bool
    embedding_loaded: bool
    gpu_available: bool
    gpu_name: str | None = None
    vram_free_gb: float | None = None
    vram_total_gb: float | None = None
    uptime_seconds: float
