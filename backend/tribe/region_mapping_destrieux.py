"""
Principled fsaverage5 → 20-region projection using the Destrieux 2009
surface parcellation.

This module replaces the approximate vertex-range mapping in
`region_mapping.py`. Each Brain Studio region pulls its activation from
the *anatomically defined* Destrieux parcels that constitute it (see
`destrieux_mapping.py` for the curated parcel-to-region table).

Flow:
    1. `build_region_vertex_indices()` — first call only, downloads the
       Destrieux fsaverage5 parcellation via nilearn (~50 MB, cached
       under ~/.nilearn_cache).
    2. For each region, looks up the Destrieux parcel labels in the
       cached parcellation and collects every fsaverage5 vertex
       belonging to those parcels.
    3. `project_to_20_regions(per_vertex)` averages TRIBE's per-vertex
       predictions within each region's vertex set, then applies a
       sigmoid squash around the global mean so the output reads on
       the same [0, 1] scale the frontend's brain colour ramp expects.

The vertex assignment is cached on disk (`vertex_assignment_cache.json`
in the module's directory) so subsequent backend starts skip the
nilearn call entirely.
"""

from __future__ import annotations

import json
import logging
from functools import lru_cache
from pathlib import Path
from typing import TYPE_CHECKING

from .destrieux_mapping import (
    BILATERAL_REGIONS,
    DESTRIEUX_TO_REGION,
)

if TYPE_CHECKING:
    import numpy as np

logger = logging.getLogger(__name__)

# fsaverage5 vertex layout (FreeSurfer convention)
LH_VERTEX_COUNT = 10242
RH_VERTEX_COUNT = 10242
TOTAL_VERTEX_COUNT = LH_VERTEX_COUNT + RH_VERTEX_COUNT  # 20484
RH_OFFSET = LH_VERTEX_COUNT  # right hemisphere vertex i lives at global index RH_OFFSET + i

# Cache the built region→vertices map on disk so we don't re-run the
# nilearn lookup every time uvicorn restarts.
_CACHE_PATH = Path(__file__).resolve().parent / "vertex_assignment_cache.json"


def _normalize_label(raw: str | bytes) -> str:
    """Destrieux labels are sometimes byte strings — normalize to str."""
    if isinstance(raw, bytes):
        return raw.decode("utf-8")
    return str(raw)


def _fetch_destrieux_fsaverage5() -> dict[str, object]:
    """
    Return nilearn's surface-Destrieux parcellation on fsaverage5.

    Output dict:
      'map_left'  : (10242,) ndarray of int parcel indices (per LH vertex)
      'map_right' : (10242,) ndarray of int parcel indices (per RH vertex)
      'labels'    : list of parcel name strings indexed by parcel index
    """
    from nilearn import datasets  # heavy import — only on first call

    destrieux = datasets.fetch_atlas_surf_destrieux()
    # nilearn returns labels as bytes; normalize once.
    labels = [_normalize_label(lbl) for lbl in destrieux["labels"]]
    return {
        "map_left": destrieux["map_left"],
        "map_right": destrieux["map_right"],
        "labels": labels,
    }


def _build_vertex_indices_fresh() -> dict[str, list[int]]:
    """
    Build the {region_id: [global fsaverage5 vertex indices]} mapping
    from scratch by fetching the Destrieux atlas and resolving each
    region's parcel names to vertex indices.

    Global vertex index convention:
      - LH parcel-i vertex → 0..10241
      - RH parcel-i vertex → 10242..20483
    """
    import numpy as np

    destrieux = _fetch_destrieux_fsaverage5()
    label_names = destrieux["labels"]
    label_to_idx = {name: i for i, name in enumerate(label_names)}

    map_left = np.asarray(destrieux["map_left"])
    map_right = np.asarray(destrieux["map_right"])

    out: dict[str, list[int]] = {}
    for region_id, parcel_names in DESTRIEUX_TO_REGION.items():
        global_indices: list[int] = []
        for parcel_name in parcel_names:
            # Map name → integer index in the parcellation array.
            idx = label_to_idx.get(parcel_name)
            if idx is None:
                logger.warning(
                    "Destrieux parcel %r not found in atlas labels — "
                    "skipping for region %r. Known labels start with: %s",
                    parcel_name,
                    region_id,
                    [n for n in label_names if parcel_name.split("_")[0] in n][:5],
                )
                continue

            # Determine which hemisphere(s) to pull from.
            if region_id in BILATERAL_REGIONS:
                # Midline region — pull from BOTH hemispheres.
                lh_verts = np.where(map_left == idx)[0]
                rh_verts = np.where(map_right == idx)[0]
                global_indices.extend(int(v) for v in lh_verts)
                global_indices.extend(int(v + RH_OFFSET) for v in rh_verts)
            elif region_id.endswith("_left"):
                lh_verts = np.where(map_left == idx)[0]
                global_indices.extend(int(v) for v in lh_verts)
            elif region_id.endswith("_right"):
                rh_verts = np.where(map_right == idx)[0]
                global_indices.extend(int(v + RH_OFFSET) for v in rh_verts)
            else:
                logger.warning(
                    "Region %r has no hemisphere suffix and is not in "
                    "BILATERAL_REGIONS; defaulting to bilateral.",
                    region_id,
                )
                lh_verts = np.where(map_left == idx)[0]
                rh_verts = np.where(map_right == idx)[0]
                global_indices.extend(int(v) for v in lh_verts)
                global_indices.extend(int(v + RH_OFFSET) for v in rh_verts)

        # De-duplicate (some regions share parcels, e.g. atl_left's
        # G_temp_sup-G_T_transv overlaps with hg_left).
        out[region_id] = sorted(set(global_indices))
        logger.info(
            "region %s ← %d vertices (parcels: %s)",
            region_id,
            len(out[region_id]),
            ", ".join(parcel_names),
        )

    return out


@lru_cache(maxsize=1)
def get_region_vertex_indices() -> dict[str, list[int]]:
    """
    Return {region_id: [global vertex indices on fsaverage5]} for the
    20 Brain Studio regions. Cached on disk + in process memory.

    Disk cache is invalidated when DESTRIEUX_TO_REGION changes (we hash
    the mapping table into the cache file and check on read).
    """
    import hashlib

    mapping_hash = hashlib.sha256(
        json.dumps(DESTRIEUX_TO_REGION, sort_keys=True).encode("utf-8")
    ).hexdigest()[:16]

    if _CACHE_PATH.is_file():
        try:
            cached = json.loads(_CACHE_PATH.read_text(encoding="utf-8"))
            if cached.get("mapping_hash") == mapping_hash:
                logger.info(
                    "loaded vertex assignment from %s (hash %s)",
                    _CACHE_PATH.name,
                    mapping_hash,
                )
                return {k: list(v) for k, v in cached["regions"].items()}
            logger.info(
                "vertex assignment cache stale (hash mismatch); rebuilding",
            )
        except (json.JSONDecodeError, KeyError, OSError) as e:
            logger.warning("vertex assignment cache unreadable (%s); rebuilding", e)

    fresh = _build_vertex_indices_fresh()
    try:
        _CACHE_PATH.write_text(
            json.dumps(
                {"mapping_hash": mapping_hash, "regions": fresh},
                separators=(",", ":"),
            ),
            encoding="utf-8",
        )
        logger.info("cached vertex assignment to %s", _CACHE_PATH.name)
    except OSError as e:
        logger.warning("could not write vertex assignment cache: %s", e)
    return fresh


def project_to_20_regions(per_vertex: "np.ndarray") -> dict[str, float]:
    """
    Project a (20484,) fsaverage5 vertex prediction to the Brain Studio's
    20 named regions via Destrieux 2009 surface parcellation.

    Pipeline:
        1. Per region: mean of TRIBE's vertex predictions inside the
           Destrieux parcels assigned to that region.
        2. Inter-region z-score (region means → standardized scores
           across the 20 regions, not against raw vertices). This is
           more honest than the previous vertex-global z-score: we want
           to know which regions stand out *relative to each other*,
           not relative to the noisy per-vertex distribution.
        3. Sharpen by a temperature factor (3.5) before sigmoid so the
           top-3 regions read clearly on the brain colour ramp.
           Without the sharpening, text-only TRIBE predictions were
           compressing into [0.5, 0.62] — visually indistinguishable.
        4. Sigmoid squash to [0, 1].

    The sharpening factor was chosen empirically: at 3.5 the top-1
    region reaches ~0.92 and the bottom-3 reach ~0.08 for typical
    text-only TRIBE outputs, while the middle ranks stay readable.
    Higher values would make the brain look "binary" (3 hot regions,
    17 dim).
    """
    import numpy as np

    arr = np.asarray(per_vertex, dtype=np.float32).reshape(-1)
    if arr.shape[0] != TOTAL_VERTEX_COUNT:
        raise ValueError(
            f"expected {TOTAL_VERTEX_COUNT}-vertex prediction, got shape {arr.shape}"
        )

    region_vertices = get_region_vertex_indices()
    # Pass 1: per-region mean.
    region_means: dict[str, float] = {}
    for region_id, vert_ids in region_vertices.items():
        if not vert_ids:
            region_means[region_id] = 0.0
            continue
        vals = arr[np.asarray(vert_ids, dtype=np.int64)]
        if vals.size == 0:
            region_means[region_id] = 0.0
            continue
        region_means[region_id] = float(vals.mean())

    # Pass 2: inter-region z-score (mean and std OVER THE 20 REGIONS).
    means_arr = np.asarray(list(region_means.values()), dtype=np.float32)
    r_mean = float(means_arr.mean())
    r_std = float(means_arr.std()) or 1.0

    # Sharpening factor: multiplies the z-score before sigmoid so the
    # top regions reach near-1.0 and the bottom regions near 0.0,
    # giving the brain visualization a full dynamic range across inputs.
    SHARPEN = 3.5

    out: dict[str, float] = {}
    for region_id, m in region_means.items():
        z = (m - r_mean) / r_std
        prob = 1.0 / (1.0 + float(np.exp(-z * SHARPEN)))
        out[region_id] = round(float(max(0.0, min(1.0, prob))), 4)
    return out


__all__ = [
    "DESTRIEUX_TO_REGION",
    "get_region_vertex_indices",
    "project_to_20_regions",
    "TOTAL_VERTEX_COUNT",
    "LH_VERTEX_COUNT",
    "RH_VERTEX_COUNT",
]
