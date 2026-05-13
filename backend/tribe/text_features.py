"""
Text feature extraction for TRIBE v2.

Replicates Meta's text-encoder pipeline from config.yaml:

    model_name: meta-llama/Llama-3.2-3B
    layers:    [0.5, 0.75, 1.0]
    layer_aggregation: group_mean
    token_aggregation: mean
    cache_n_layers: 20
    aggregation: sum (across words within a TR)
    frequency: 2.0 Hz

The checkpoint's `model_build_args.feature_dims.text = (2, 3072)` tells us
two layer-groups × 3072-dim Llama hidden = 6144-dim projector input. We
reproduce that by taking hidden states at depths 0.5 and 1.0 of Llama
3.2-3B and concatenating them after mean-pooling over the input tokens.

Requirements:
    pip install transformers torch
    huggingface-cli login    # accept the Llama 3.2 license

If `transformers` or the gated model isn't available, the extractor
returns None and the caller falls back gracefully.
"""

from __future__ import annotations

import os
from typing import Any

import torch

LLAMA_NAME = os.environ.get("TRIBE_TEXT_MODEL", "meta-llama/Llama-3.2-3B")
_HIDDEN_SIZE_LLAMA_3_2_3B = 3072


class TextFeatureExtractor:
    """
    Encodes a chunk of text into a (T, 6144) tensor matching TRIBE's text
    projector input. T = the number of "TR windows" — for short text we
    just emit T=8 identical windows so the encoder's time positional
    embedding has something to work with.
    """

    def __init__(
        self,
        model_name: str | None = None,
        device: str | torch.device = "cpu",
        dtype: torch.dtype = torch.float16,
    ) -> None:
        self.model_name = model_name or LLAMA_NAME
        self.device = torch.device(device)
        self.dtype = dtype
        self.tokenizer: Any | None = None
        self.model: Any | None = None
        self._n_layers: int | None = None

    def lazy_load(self) -> bool:
        if self.model is not None:
            return True
        try:
            from transformers import AutoModel, AutoTokenizer
        except ImportError:
            return False
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModel.from_pretrained(
                self.model_name,
                torch_dtype=self.dtype,
                output_hidden_states=True,
            )
            self.model.to(self.device).eval()
            self._n_layers = len(self.model.config.num_hidden_layers
                                  if isinstance(self.model.config.num_hidden_layers, list)
                                  else range(self.model.config.num_hidden_layers))
            return True
        except Exception as e:  # noqa: BLE001
            print(f"[tribe.text_features] failed to load {self.model_name}: {e}")
            return False

    @torch.no_grad()
    def extract(self, text: str, n_timesteps: int = 8) -> torch.Tensor | None:
        if not self.lazy_load():
            return None
        if self.tokenizer is None or self.model is None:
            return None

        tokens = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=1024,
        ).to(self.device)

        out = self.model(**tokens, output_hidden_states=True)
        # hidden_states: tuple of (n_layers + 1) tensors of shape (B, T, H)
        hs = out.hidden_states  # tuple length L+1
        L = len(hs) - 1  # number of transformer layers
        # Depths 0.5 and 1.0 → layer indices L//2 and L
        idx_mid = max(1, L // 2)
        idx_top = L
        # Mean-pool over tokens (excluding padding via attention mask).
        mask = tokens.attention_mask.unsqueeze(-1).to(hs[0].dtype)

        def mean_pool(x: torch.Tensor) -> torch.Tensor:
            return (x * mask).sum(dim=1) / mask.sum(dim=1).clamp(min=1)

        h_mid = mean_pool(hs[idx_mid])  # (B, H)
        h_top = mean_pool(hs[idx_top])  # (B, H)
        feat = torch.cat([h_mid, h_top], dim=-1)  # (B, 2H)

        # Verify dimensions match what the projector expects.
        if feat.size(-1) != 2 * _HIDDEN_SIZE_LLAMA_3_2_3B:
            print(
                f"[tribe.text_features] unexpected feature dim {feat.size(-1)}, "
                f"expected {2 * _HIDDEN_SIZE_LLAMA_3_2_3B}"
            )

        # Expand to T timesteps (same feature repeated). The model averages
        # them anyway via the mean-pool inside its forward; this gives the
        # time-positional embedding something to operate on.
        feat = feat.unsqueeze(1).expand(-1, n_timesteps, -1).contiguous()
        return feat.to(torch.float32)  # projector expects fp32
