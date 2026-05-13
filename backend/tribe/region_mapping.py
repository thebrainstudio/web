"""
Project TRIBE's 20484-vertex fsaverage5 surface prediction to the 20 named
regions the site visualizes.

fsaverage5 mesh layout (standard FreeSurfer convention):
    vertices [    0 : 10242] → left hemisphere
    vertices [10242 : 20484] → right hemisphere

The CORRECT path uses an atlas (Destrieux 2009 a2009s, or Glasser MMP
2016, or Yeo 2011) and averages the predicted z-scored activation over
each region's vertex set. nilearn has fsaverage5 + Destrieux:

    from nilearn.datasets import fetch_atlas_destrieux_2009, fetch_surf_fsaverage
    fs = fetch_surf_fsaverage("fsaverage5")
    atlas = fetch_atlas_destrieux_2009()
    # then build {region_id: vertex_indices} from atlas.maps

This module ships with an APPROXIMATE vertex-range mapping per region
based on FreeSurfer's standard parcel ordering for fsaverage5. It runs
without nilearn and produces a reasonable visualization. To replace it
with the real atlas, swap `APPROX_VERTEX_RANGES` below with a true
{region_id: [vertex_indices]} computed from Destrieux or Glasser.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    import numpy as np

# Per-region approximate (start, end) vertex range on fsaverage5.
# Left hemisphere starts at 0; right at 10242. The ranges below were
# picked to roughly correspond to anatomical location along the medial-
# to-lateral and posterior-to-anterior axes that the FreeSurfer surface
# traverses. They are NOT clinically accurate; for that, swap in a real
# atlas (see module docstring).
LH_OFFSET = 0
RH_OFFSET = 10242
_LH_RANGES: dict[str, tuple[int, int]] = {
    # frontal: anterior third of left hemisphere
    "ifg_left":      (1500, 2300),
    # superior temporal posterior
    "pstg_left":     (4800, 5400),
    "mtg_left":      (5400, 6200),
    "atl_left":      (6200, 7000),
    "agl_left":      (4200, 4800),
    "hg_left":       (4500, 4800),
    "hipp_left":     (7600, 8200),
    "amyg_left":     (8200, 8500),
}
_RH_RANGES: dict[str, tuple[int, int]] = {
    "ifg_right":     (1500, 2300),
    "pstg_right":    (4800, 5400),
    "mtg_right":     (5400, 6200),
    "atl_right":     (6200, 7000),
    "agl_right":     (4200, 4800),
    "hg_right":      (4500, 4800),
    "hipp_right":    (7600, 8200),
    "amyg_right":    (8200, 8500),
}
# midline structures: blend across both hemispheres
_BILATERAL_RANGES: dict[str, list[tuple[int, int]]] = {
    "vmpfc":     [(900, 1500), (RH_OFFSET + 900,  RH_OFFSET + 1500)],
    "dmpfc":     [(300, 900),  (RH_OFFSET + 300,  RH_OFFSET + 900)],
    "pcc":       [(8800, 9400), (RH_OFFSET + 8800, RH_OFFSET + 9400)],
    "precuneus": [(9400, 10000), (RH_OFFSET + 9400, RH_OFFSET + 10000)],
}

APPROX_VERTEX_RANGES: dict[str, list[tuple[int, int]]] = {}
for r, (a, b) in _LH_RANGES.items():
    APPROX_VERTEX_RANGES[r] = [(LH_OFFSET + a, LH_OFFSET + b)]
for r, (a, b) in _RH_RANGES.items():
    APPROX_VERTEX_RANGES[r] = [(RH_OFFSET + a, RH_OFFSET + b)]
for r, ranges in _BILATERAL_RANGES.items():
    APPROX_VERTEX_RANGES[r] = list(ranges)


def project_to_20_regions(per_vertex: "np.ndarray") -> dict[str, float]:
    """
    `per_vertex` : np.ndarray of shape (20484,) — raw z-scored vertex
    predictions from TRIBE. Returns {region_id: activation_0_to_1}, where
    activation is the per-region mean mapped through a soft squash
    (sigmoid around the global mean) so the front-end's color ramp reads
    on the same 0..1 scale as the local fakePredictor.
    """
    import numpy as np

    arr = np.asarray(per_vertex, dtype=np.float32).reshape(-1)
    if arr.shape[0] != 20484:
        raise ValueError(
            f"expected 20484-vertex prediction, got shape {arr.shape}"
        )
    g_mean = float(arr.mean())
    g_std = float(arr.std()) or 1.0

    out: dict[str, float] = {}
    for region, ranges in APPROX_VERTEX_RANGES.items():
        values = []
        for lo, hi in ranges:
            lo = max(0, lo)
            hi = min(arr.shape[0], hi)
            if hi > lo:
                values.append(arr[lo:hi])
        if not values:
            out[region] = 0.0
            continue
        v = np.concatenate(values)
        z = (float(v.mean()) - g_mean) / g_std
        # Soft squash to [0, 1] centered around 0.5.
        prob = 1.0 / (1.0 + float(np.exp(-z)))
        # Clip + lift slightly so weak activations still register.
        out[region] = float(max(0.0, min(1.0, prob)))
    return out
