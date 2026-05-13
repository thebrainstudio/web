"""
Read precomputed TRIBE prediction JSONs from the shared/predictions/ folder.

The user produces these on Colab Pro and drops them into shared/predictions/.
Each file is a stimulus_id -> { regions: { regionId: activation0to1, ... } }.

We intentionally keep this dependency-light: real-time TRIBE inference is
Phase 10 work and lives in a separate module.
"""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

PREDICTIONS_DIR = (Path(__file__).resolve().parents[2] / "shared" / "predictions")


@lru_cache(maxsize=128)
def load_prediction(stimulus_id: str) -> dict[str, Any] | None:
    """Return the prediction dict for a stimulus_id, or None if not found."""
    safe_id = stimulus_id.replace("/", "_").replace("..", "_")
    path = PREDICTIONS_DIR / f"{safe_id}.json"
    if not path.is_file():
        return None
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def list_available() -> list[str]:
    """List stimulus_ids that have precomputed predictions on disk."""
    if not PREDICTIONS_DIR.is_dir():
        return []
    return sorted(p.stem for p in PREDICTIONS_DIR.glob("*.json"))
