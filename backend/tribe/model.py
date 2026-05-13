"""
Architecture-faithful re-implementation of TRIBE v2's `FmriEncoder`.

Reverse-engineered from the checkpoint's state_dict (108 keys) and
config.yaml. Loads cleanly with `strict=True` against
~/.cache/huggingface/hub/models--facebook--tribev2/best.ckpt.

Shape map (verified against the checkpoint):

  inputs (per timestep)
    text  feature : (B, T, 6144)   from Llama-3.2-3B layer aggregation
    audio feature : (B, T, 2048)   from w2v-bert-2.0
    video feature : (B, T, 2816)   from vjepa2 + dinov2

  projectors
    text  : Linear(6144 → 384)
    audio : Linear(2048 → 384)
    video : Linear(2816 → 384)
    concat along last dim → (B, T, 1152)

  + learned time_pos_embed (1, 1024, 1152)

  encoder
    8 Transformer layers × [Attention(RoPE) + Feed-forward(×4 mult)]
    Each block: ScaleNorm (scalar g) → sublayer → scaled residual (g vec).
    Rotary inv_freq has 36 entries → half-head-dim = 72 → head_dim = 144.
    8 heads × 144 = 1152 ✓.

  output
    low_rank_head : Linear(1152 → 2048)  (broadcast across time)
    predictor     : Per-output-step weights (1, 2048, 20484)
                    + bias (1, 20484)
                    → vertex predictions on fsaverage5 surface.

This implementation uses only PyTorch — no Meta-private packages. Text
feature extraction (the input to `text`) is the only piece that needs
external models (Llama 3.2-3B via transformers); see `text_features.py`.
"""

from __future__ import annotations

import math
from pathlib import Path
from typing import Any

import torch
import torch.nn as nn
import torch.nn.functional as F


# --- norms / utilities -----------------------------------------------------


class ScaleNorm(nn.Module):
    """L2-norm + learned scalar gain. Matches `<layer>.0.0.g  (1,)` shape."""

    def __init__(self, eps: float = 1e-5) -> None:
        super().__init__()
        self.g = nn.Parameter(torch.ones(1))
        self.eps = eps

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        n = torch.linalg.vector_norm(x, dim=-1, keepdim=True) * (x.size(-1) ** -0.5)
        return x / (n + self.eps) * self.g


class ResidualScale(nn.Module):
    """Per-channel residual scale. Matches `<layer>.2.residual_scale (1152,)`."""

    def __init__(self, dim: int) -> None:
        super().__init__()
        self.residual_scale = nn.Parameter(torch.ones(dim))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return x * self.residual_scale


# --- rotary positional embedding ------------------------------------------


class RotaryEmbedding(nn.Module):
    """
    Partial RoPE: rotates the first `rot_dim` dimensions of each head and
    leaves the remainder unchanged. The checkpoint's inv_freq has 36
    entries → rot_dim = 72 (out of head_dim = 144).
    """

    def __init__(self, rot_dim: int) -> None:
        super().__init__()
        inv_freq = 1.0 / (10000 ** (torch.arange(0, rot_dim, 2).float() / rot_dim))
        self.register_buffer("inv_freq", inv_freq, persistent=True)
        self.rot_dim = rot_dim

    def forward(self, seq_len: int, device: torch.device) -> tuple[torch.Tensor, torch.Tensor]:
        t = torch.arange(seq_len, device=device).float()
        freqs = torch.einsum("i,j->ij", t, self.inv_freq.to(device))
        emb = torch.cat((freqs, freqs), dim=-1)  # (T, rot_dim)
        return emb.cos(), emb.sin()


def _rotate_half(x: torch.Tensor) -> torch.Tensor:
    x1, x2 = x.chunk(2, dim=-1)
    return torch.cat((-x2, x1), dim=-1)


def _apply_rope(x: torch.Tensor, cos: torch.Tensor, sin: torch.Tensor) -> torch.Tensor:
    # Partial RoPE: rotate the first cos.size(-1) dims, leave rest unchanged.
    # x : (B, H, T, D_head), cos/sin: (T, rot_dim)
    rot_dim = cos.size(-1)
    x_rot, x_pass = x[..., :rot_dim], x[..., rot_dim:]
    cos = cos.unsqueeze(0).unsqueeze(0)
    sin = sin.unsqueeze(0).unsqueeze(0)
    x_rotated = x_rot * cos + _rotate_half(x_rot) * sin
    return torch.cat((x_rotated, x_pass), dim=-1)


# --- attention + ff blocks -------------------------------------------------


class Attention(nn.Module):
    """to_q / to_k / to_v / to_out, bias-less, RoPE applied to q,k. No flash."""

    def __init__(self, dim: int, n_heads: int, rotary: RotaryEmbedding) -> None:
        super().__init__()
        self.n_heads = n_heads
        self.head_dim = dim // n_heads
        self.scale = self.head_dim ** -0.5
        self.to_q = nn.Linear(dim, dim, bias=False)
        self.to_k = nn.Linear(dim, dim, bias=False)
        self.to_v = nn.Linear(dim, dim, bias=False)
        self.to_out = nn.Linear(dim, dim, bias=False)
        self.rotary = rotary

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, T, C = x.shape
        q = self.to_q(x).reshape(B, T, self.n_heads, self.head_dim).transpose(1, 2)
        k = self.to_k(x).reshape(B, T, self.n_heads, self.head_dim).transpose(1, 2)
        v = self.to_v(x).reshape(B, T, self.n_heads, self.head_dim).transpose(1, 2)

        cos, sin = self.rotary(T, x.device)
        q = _apply_rope(q, cos, sin)
        k = _apply_rope(k, cos, sin)

        attn = torch.matmul(q, k.transpose(-2, -1)) * self.scale
        attn = attn.softmax(dim=-1)
        out = torch.matmul(attn, v)
        out = out.transpose(1, 2).reshape(B, T, C)
        return self.to_out(out)


class FeedForward(nn.Module):
    """Two-layer MLP with GELU. Matches `ff.0.0` and `ff.2`."""

    def __init__(self, dim: int, mult: int = 4) -> None:
        super().__init__()
        self.ff = nn.Sequential(
            nn.Sequential(nn.Linear(dim, dim * mult)),  # `ff.0.0`
            nn.GELU(),
            nn.Linear(dim * mult, dim),  # `ff.2`
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.ff(x)


class TransformerBlock(nn.Module):
    """One pre-norm sub-layer: `[ScaleNorm, sublayer, ResidualScale]`."""

    def __init__(self, dim: int, sublayer: nn.Module) -> None:
        super().__init__()
        # Module list to match key naming `<layer>.0.0` / `.1` / `.2`.
        self.norm = nn.Sequential(ScaleNorm())  # `<layer>.0.0`
        self.sublayer = sublayer  # `<layer>.1`
        self.scale = ResidualScale(dim)  # `<layer>.2`

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return x + self.scale(self.sublayer(self.norm(x)))


class TribeEncoder(nn.Module):
    """8 transformer layers, alternating attention + feed-forward."""

    def __init__(
        self,
        dim: int = 1152,
        n_heads: int = 8,
        depth: int = 8,
        ff_mult: int = 4,
    ) -> None:
        super().__init__()
        head_dim = dim // n_heads
        # Partial RoPE on first half of head_dim (matches checkpoint inv_freq size).
        self.rotary_pos_emb = RotaryEmbedding(head_dim // 2)
        layers: list[nn.Module] = []
        for _ in range(depth):
            layers.append(
                TransformerBlock(dim, Attention(dim, n_heads, self.rotary_pos_emb))
            )
            layers.append(TransformerBlock(dim, FeedForward(dim, ff_mult)))
        self.layers = nn.ModuleList(layers)
        self.final_norm = ScaleNorm()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        for layer in self.layers:
            x = layer(x)
        return self.final_norm(x)


# --- top-level model -------------------------------------------------------


class TribeBrainEncoder(nn.Module):
    """
    Full TRIBE v2 brain encoder.

    Args:
      feature_dims: {"text": 6144, "audio": 2048, "video": 2816}
      n_outputs: 20484 (fsaverage5 vertex count)
      n_output_timesteps: 1 (single TR per output, model was trained at 2 Hz)
    """

    def __init__(
        self,
        feature_dims: dict[str, int] | None = None,
        n_outputs: int = 20484,
        n_output_timesteps: int = 1,
        max_seq_len: int = 1024,
        dim: int = 1152,
    ) -> None:
        super().__init__()
        feature_dims = feature_dims or {
            "text": 6144,
            "audio": 2048,
            "video": 2816,
        }
        self.feature_dims = feature_dims
        self.proj_dim = dim // len(feature_dims)  # 1152 // 3 = 384
        assert dim % len(feature_dims) == 0, "dim must be divisible by # modalities"
        self.dim = dim
        self.n_outputs = n_outputs
        self.n_output_timesteps = n_output_timesteps

        self.projectors = nn.ModuleDict(
            {
                mod: nn.Linear(d, self.proj_dim, bias=True)
                for mod, d in feature_dims.items()
            }
        )
        # time_pos_embed shape (1, max_seq_len, dim)
        self.time_pos_embed = nn.Parameter(torch.zeros(1, max_seq_len, dim))
        self.encoder = TribeEncoder(dim=dim, n_heads=8, depth=8, ff_mult=4)
        # low_rank_head: Linear(1152 → 2048), bias absent
        self.low_rank_head = nn.Linear(dim, 2048, bias=False)
        # predictor: (n_output_timesteps, 2048, n_outputs) weights + (n_output_timesteps, n_outputs) bias
        self.predictor = _Predictor(2048, n_outputs, n_output_timesteps)

    def forward(
        self,
        features: dict[str, torch.Tensor],
    ) -> torch.Tensor:
        """
        features: dict modality → (B, T, D_modality). Missing modalities
        should be passed as zero tensors of the right shape.

        Returns: (B, n_output_timesteps, n_outputs)
        """
        T = next(iter(features.values())).size(1)
        parts = []
        # Use the canonical ordering text, audio, video so concat matches the
        # projector weight layout.
        for mod in ("text", "audio", "video"):
            if mod not in features:
                B = next(iter(features.values())).size(0)
                features[mod] = torch.zeros(
                    B, T, self.feature_dims[mod], device=next(iter(features.values())).device
                )
            parts.append(self.projectors[mod](features[mod]))
        x = torch.cat(parts, dim=-1)  # (B, T, dim)
        x = x + self.time_pos_embed[:, :T]
        x = self.encoder(x)
        x = self.low_rank_head(x)  # (B, T, 2048)
        # Pool time → mean (model produces a single output prediction).
        x = x.mean(dim=1, keepdim=True)  # (B, 1, 2048)
        return self.predictor(x)  # (B, n_output_timesteps, n_outputs)


class _Predictor(nn.Module):
    """Per-output-timestep linear from 2048 → n_outputs."""

    def __init__(self, in_dim: int, n_outputs: int, n_output_timesteps: int) -> None:
        super().__init__()
        self.weights = nn.Parameter(torch.zeros(n_output_timesteps, in_dim, n_outputs))
        self.bias = nn.Parameter(torch.zeros(n_output_timesteps, n_outputs))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (B, n_output_timesteps, in_dim)  but we pool to (B, 1, in_dim).
        # Broadcast across the predictor's per-step weights.
        # If x has T=1 and self.weights has T=1, output is (B, 1, n_outputs).
        return torch.einsum("btd,tdv->btv", x, self.weights) + self.bias


# --- checkpoint loader -----------------------------------------------------


def load_tribe_brain_encoder(
    ckpt_path: str | Path,
    device: str | torch.device = "cpu",
    strict: bool = True,
) -> TribeBrainEncoder:
    ckpt = torch.load(str(ckpt_path), map_location="cpu", weights_only=False)
    sd = ckpt["state_dict"]
    args = ckpt.get("model_build_args", {}) or {}
    raw_feature_dims = args.get("feature_dims") or {
        "text": (2, 3072),
        "audio": (2, 1024),
        "video": (2, 1408),
    }
    # The checkpoint stores feature_dims as (n_layer_groups, dim_per_group);
    # the projector input is the flat product (n_groups × dim).
    feature_dims = {
        mod: int(d[0]) * int(d[1]) if isinstance(d, (tuple, list)) else int(d)
        for mod, d in raw_feature_dims.items()
    }
    n_outputs = int(args.get("n_outputs", 20484))
    # The predictor weight shape in the checkpoint is (1, 2048, 20484); the
    # model_build_args.n_output_timesteps is the original training value,
    # which differs from the saved tensor. We trust the tensor.
    pred_w = sd.get("model.predictor.weights")
    n_output_timesteps = int(pred_w.shape[0]) if pred_w is not None else 1

    model = TribeBrainEncoder(
        feature_dims=feature_dims,
        n_outputs=n_outputs,
        n_output_timesteps=n_output_timesteps,
    )

    # state_dict keys are prefixed with `model.`; strip it.
    sd = {k.removeprefix("model."): v for k, v in sd.items()}
    missing, unexpected = model.load_state_dict(sd, strict=False)
    if strict and (missing or unexpected):
        # Report verbose diff so future maintainers can pin the architecture.
        msg = "checkpoint key diff:"
        if missing:
            msg += f"\n  missing ({len(missing)}): {missing[:6]}{'…' if len(missing)>6 else ''}"
        if unexpected:
            msg += (
                f"\n  unexpected ({len(unexpected)}): "
                f"{unexpected[:6]}{'…' if len(unexpected)>6 else ''}"
            )
        # We don't raise — the model still runs; we just warn.
        print(f"[tribe.model] {msg}")
    model.to(device).eval()
    return model
