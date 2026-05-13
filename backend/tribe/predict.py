"""
Glue: text → Llama features → TRIBE encoder → 20-region projection.

Used by `tribe.loader.TribePredictor.predict` when `engine='real'`.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import torch

from .model import TribeBrainEncoder, load_tribe_brain_encoder
from .text_features import TextFeatureExtractor
from .region_mapping import project_to_20_regions


class RealTribeEngine:
    """
    Lazy-instantiated singleton. Loads Llama + TRIBE once, then serves
    repeated `infer(text)` calls cheaply.
    """

    def __init__(
        self,
        ckpt_path: str | Path,
        device: str | torch.device | None = None,
    ) -> None:
        self.ckpt_path = Path(ckpt_path)
        self.device = torch.device(
            device if device else ("cuda" if torch.cuda.is_available() else "cpu")
        )
        self.brain: TribeBrainEncoder | None = None
        self.text: TextFeatureExtractor | None = None

    def lazy_load(self) -> bool:
        if self.brain is not None:
            return True
        try:
            self.brain = load_tribe_brain_encoder(
                self.ckpt_path, device=self.device, strict=False
            )
        except Exception as e:  # noqa: BLE001
            print(f"[tribe.predict] brain load failed: {e}")
            return False
        self.text = TextFeatureExtractor(device=self.device)
        ok = self.text.lazy_load()
        if not ok:
            print(
                "[tribe.predict] text encoder unavailable — install transformers + "
                "accept the Llama-3.2-3B license (huggingface-cli login)."
            )
            return False
        return True

    @torch.no_grad()
    def infer(self, text: str) -> dict[str, float] | None:
        if not self.lazy_load() or self.text is None or self.brain is None:
            return None

        feat = self.text.extract(text, n_timesteps=8)
        if feat is None:
            return None
        feat = feat.to(self.device)

        # Build the full multimodal feature dict; missing modalities → zeros.
        B, T, _ = feat.shape
        feats: dict[str, torch.Tensor] = {
            "text": feat,
            "audio": torch.zeros(B, T, 2048, device=self.device, dtype=torch.float32),
            "video": torch.zeros(B, T, 2816, device=self.device, dtype=torch.float32),
        }
        out = self.brain(feats)  # (B, 1, 20484)
        per_vertex = out.squeeze(0).squeeze(0).cpu().numpy()
        return project_to_20_regions(per_vertex)
