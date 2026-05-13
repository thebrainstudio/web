"""
Map TRIBE's per-vertex fsaverage5 output (~10k vertices/hemisphere) onto
the 20 named regions the site visualizes.

This is a placeholder mapping. The honest path:
  1. Get the Destrieux or Glasser parcellation in fsaverage5 space.
  2. For each of our 20 regions (see `frontend/lib/regions.ts`), find the
     corresponding parcels on the surface.
  3. Average the per-vertex predicted z-scored activation over each region.

Until that's wired, this module simulates the projection with a fixed
hash-based mapping per region. When Phase 11 wires the real atlas, swap
`project_to_20_regions` for the real implementation.
"""

from __future__ import annotations

from typing import Any

REGION_IDS = [
    "ifg_left", "ifg_right",
    "pstg_left", "pstg_right",
    "mtg_left", "mtg_right",
    "atl_left", "atl_right",
    "agl_left", "agl_right",
    "hg_left", "hg_right",
    "vmpfc", "dmpfc", "pcc", "precuneus",
    "amyg_left", "amyg_right",
    "hipp_left", "hipp_right",
]


def project_to_20_regions(per_vertex: Any) -> dict[str, float]:
    """
    Accept a vertex-level prediction (numpy array or torch tensor of shape
    [n_vertices,]) and return a {region_id: activation_0_to_1} mapping.
    Currently a placeholder — see module docstring.
    """
    raise NotImplementedError(
        "Atlas mapping not wired. See backend/tribe/region_mapping.py."
    )
