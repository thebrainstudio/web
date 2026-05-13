"""
TRIBE v2 checkpoint loader.

The cached checkpoint lives at the Hugging Face hub path:
    ~/.cache/huggingface/hub/models--facebook--tribev2/
      snapshots/<sha>/best.ckpt   (~ 676 MB)
      snapshots/<sha>/config.yaml

The checkpoint is a Lightning save: a dict with `state_dict`, `epoch`,
`global_step`, `optimizer_states`, etc. The model architecture inside is
described by config.yaml — a multi-modal brain encoder:

    text features    : meta-llama/Llama-3.2-3B (layers 0.5, 0.75, 1.0)
    audio features   : facebook/w2v-bert-2.0  (same depths)
    video features   : facebook/vjepa2-vitg-fpc64-256
    brain encoder    : Transformer, 8 heads × 8 layers, hidden 1152
    output           : fsaverage5 surface vertices, 2 Hz frequency
    hemodynamic lag  : 5 s (output is offset 5 s in the past)

To actually run inference end to end you need Meta's `neuralset` /
`neuralhub` / `tribe` Python packages (referenced in config.yaml's
`infra.workdir.copied`). Those are not publicly distributed at the time
of writing. The cleanest current path is to run inference on Colab Pro
using the official notebook (when Meta releases it) and dump the per-
stimulus prediction JSONs to `shared/predictions/`, which this backend
already serves.

This loader is the bridge: it validates the checkpoint, surfaces its
metadata, and returns a `TribePredictor` whose `.predict(text)` is the
single point that needs to swap in the real model when ready.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml

# Default checkpoint path: the HF hub snapshot we already located.
DEFAULT_CKPT_PATH = (
    Path.home()
    / ".cache"
    / "huggingface"
    / "hub"
    / "models--facebook--tribev2"
    / "snapshots"
    / "f894e783020944dcd96e5568550afe2aa9743f9f"
    / "best.ckpt"
)
DEFAULT_CONFIG_PATH = DEFAULT_CKPT_PATH.with_name("config.yaml")


@dataclass
class TribeCheckpointInfo:
    path: Path
    config_path: Path
    size_bytes: int
    epoch: int | None
    global_step: int | None
    state_dict_keys: int
    hidden_size: int
    n_layers: int
    n_heads: int
    text_backbone: str
    output_frequency_hz: float
    hemodynamic_offset_s: float


def _load_config(path: Path) -> dict[str, Any]:
    """
    Meta's config.yaml uses Python-specific tags (pathlib.PosixPath,
    python/tuple, etc.). Strip them with a constructor that maps unknown
    tags to a no-op, so we can still read the scalar fields we care about
    without executing arbitrary Python.
    """
    class _IgnoreUnknownLoader(yaml.SafeLoader):
        pass

    def _ignore(loader: Any, tag_suffix: str, node: Any) -> Any:  # noqa: ARG001
        if isinstance(node, yaml.ScalarNode):
            return loader.construct_scalar(node)
        if isinstance(node, yaml.SequenceNode):
            return loader.construct_sequence(node)
        return loader.construct_mapping(node)

    _IgnoreUnknownLoader.add_multi_constructor("tag:yaml.org,2002:python/", _ignore)
    _IgnoreUnknownLoader.add_multi_constructor("!python/", _ignore)
    _IgnoreUnknownLoader.add_constructor(
        "tag:yaml.org,2002:python/tuple",
        lambda l, n: tuple(l.construct_sequence(n)),
    )

    with path.open("r", encoding="utf-8") as f:
        return yaml.load(f, Loader=_IgnoreUnknownLoader)


def inspect_checkpoint(
    ckpt_path: Path | None = None,
    config_path: Path | None = None,
) -> TribeCheckpointInfo | None:
    """
    Validate the checkpoint exists and read enough of its metadata to
    construct a `TribeCheckpointInfo`. Returns None if the file is missing.
    Reads the checkpoint via torch.load only if torch is importable.
    """
    p = Path(ckpt_path or DEFAULT_CKPT_PATH)
    cfg_p = Path(config_path or DEFAULT_CONFIG_PATH)
    if not p.is_file() or not cfg_p.is_file():
        return None

    cfg = _load_config(cfg_p)
    bmc = cfg["brain_model_config"]
    encoder = bmc["encoder"]

    epoch: int | None = None
    step: int | None = None
    n_keys = 0
    try:
        # Lazy import — we don't want a torch dependency in the
        # serverless backend if inference isn't wired.
        import torch  # type: ignore

        ckpt = torch.load(str(p), map_location="cpu", weights_only=False)
        if isinstance(ckpt, dict):
            epoch = ckpt.get("epoch")
            step = ckpt.get("global_step")
            sd = ckpt.get("state_dict") or ckpt
            n_keys = len(sd) if isinstance(sd, dict) else 0
    except ImportError:
        # torch not installed — return shape info we can read from the
        # checkpoint header without it.
        pass
    except Exception as e:  # noqa: BLE001
        print(f"[tribe.loader] torch.load failed: {e}")

    return TribeCheckpointInfo(
        path=p,
        config_path=cfg_p,
        size_bytes=p.stat().st_size,
        epoch=epoch,
        global_step=step,
        state_dict_keys=n_keys,
        hidden_size=bmc["hidden"],
        n_layers=encoder["depth"],
        n_heads=encoder["heads"],
        text_backbone=cfg["data"]["text_feature"]["model_name"],
        output_frequency_hz=cfg["data"]["frequency"],
        hemodynamic_offset_s=cfg["data"]["neuro"]["offset"],
    )


class TribePredictor:
    """
    The interface the FastAPI route talks to. `.predict(text)` either runs
    the real TRIBE forward pass (when `engine='real'`) or raises a
    `NotImplementedError` with rich, honest error info (when 'stub'). The
    frontend treats the latter as a 503 and falls back to the local
    placeholder predictor in `lib/fakePredictor.ts`.

    The plumbing intentionally keeps the engine selection at construction
    time. Phase 10/11 swaps the engine to 'real' once Meta's `tribe`
    package is available; nothing in the route or the frontend has to
    change.
    """

    def __init__(
        self,
        info: TribeCheckpointInfo,
        engine: str = "stub",
    ) -> None:
        self.info = info
        self.engine = engine

    def predict(self, text: str) -> dict[str, float]:
        if self.engine != "real":
            raise NotImplementedError(
                "TRIBE forward pass requires Meta's `tribe` Python package "
                "(github.com/facebookresearch — currently private) and "
                "Llama-3.2-3B locally. Checkpoint is staged at "
                f"{self.info.path}, hidden={self.info.hidden_size}, "
                f"layers={self.info.n_layers}, text_backbone="
                f"{self.info.text_backbone}. Engine still 'stub'."
            )
        # When Phase 11 lands:
        #   1. Import tribe.models.FmriEncoder
        #   2. Build it from self.info.config (or directly from yaml)
        #   3. Load self.info.path into it
        #   4. Tokenize `text` with Llama-3.2-3B, extract layers 0.5/0.75/1.0,
        #      group_mean aggregate.
        #   5. Forward through FmriEncoder.
        #   6. Project the fsaverage5 vertex predictions onto our 20-region
        #      atlas (see `tribe/region_mapping.py` — to be written).
        #   7. Return {region_id: activation_0_to_1, ...}
        raise NotImplementedError("real engine not wired in this session")


def make_predictor() -> TribePredictor | None:
    info = inspect_checkpoint()
    if info is None:
        return None
    engine = os.environ.get("TRIBE_ENGINE", "stub")
    return TribePredictor(info, engine=engine)
