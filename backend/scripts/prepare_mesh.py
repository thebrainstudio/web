"""
Generate fsaverage5 + fsaverage6 pial-surface meshes as binary GLBs and the
vertex maps the frontend needs.

Outputs (under frontend/public/meshes/):
  fsaverage5_pial.glb                              ~ 1 MB   20484 verts
  fsaverage6_pial_web.glb                          ~ 2-4 MB ~60-80k verts (decimated from ~163k)
  vertex_to_region.json                            fsaverage5 vertex -> our 20-region id
  vertex_correspondence_fsavg5_to_fsavg6.json      cross-resolution mapping for prediction upsampling

Run:
  python backend/scripts/prepare_mesh.py
"""

from __future__ import annotations

import json
import os
import struct
from pathlib import Path
from typing import Any

import numpy as np
import trimesh
from nilearn.datasets import fetch_surf_fsaverage

# Where the frontend expects to find the meshes.
HERE = Path(__file__).resolve().parents[2]
OUT_MESH_DIR = HERE / "frontend" / "public" / "meshes"
OUT_PRED_DIR = HERE / "frontend" / "public"
OUT_MESH_DIR.mkdir(parents=True, exist_ok=True)

# Match our existing 20 named regions (see frontend/lib/regions.ts).
# Each region's vertex-range mapping is a heuristic; ship a proper Destrieux/
# Glasser atlas in a follow-up. The numbers below stay aligned with what
# backend/tribe/region_mapping.py uses today so predictions remain consistent.
LH_OFFSET = 0
# Right-hemisphere offset = number of left vertices (filled in per-resolution).

_LH_RANGES = {
    "ifg_left":  (1500, 2300),
    "pstg_left": (4800, 5400),
    "mtg_left":  (5400, 6200),
    "atl_left":  (6200, 7000),
    "agl_left":  (4200, 4800),
    "hg_left":   (4500, 4800),
    "hipp_left": (7600, 8200),
    "amyg_left": (8200, 8500),
}
_RH_RANGES = {
    "ifg_right":  (1500, 2300),
    "pstg_right": (4800, 5400),
    "mtg_right":  (5400, 6200),
    "atl_right":  (6200, 7000),
    "agl_right":  (4200, 4800),
    "hg_right":   (4500, 4800),
    "hipp_right": (7600, 8200),
    "amyg_right": (8200, 8500),
}
_BILATERAL_RANGES = {
    "vmpfc":     [( 900, 1500)],
    "dmpfc":     [( 300,  900)],
    "pcc":       [(8800, 9400)],
    "precuneus": [(9400, 10000)],
}


def _read_surface(path: str) -> tuple[np.ndarray, np.ndarray]:
    """Load a surface and return (coords, faces). Tries GIFTI (.gii) first
    — that's what nilearn ships — then FreeSurfer binary."""
    import nibabel as nib
    import nibabel.freesurfer.io as fsio

    path_s = str(path)
    if path_s.endswith(".gii") or path_s.endswith(".gii.gz"):
        img = nib.load(path_s)
        coords = img.darrays[0].data  # POINTSET
        faces = img.darrays[1].data  # TRIANGLE
        return coords.astype(np.float32), faces.astype(np.int32)
    coords, faces = fsio.read_geometry(path_s)
    return coords.astype(np.float32), faces.astype(np.int32)


def _combine_hemispheres(
    lh_coords: np.ndarray,
    lh_faces: np.ndarray,
    rh_coords: np.ndarray,
    rh_faces: np.ndarray,
    gap_mm: float = 5.0,
) -> tuple[np.ndarray, np.ndarray, int]:
    """
    Merge two hemispheres into a single mesh. The left hemisphere is shifted
    so the most-medial-right vertex sits at x = -gap_mm/2; right is mirrored
    by shifting so its most-medial-left vertex sits at x = +gap_mm/2.

    Returns combined (vertices, faces, lh_vertex_count).
    """
    lh = lh_coords.copy()
    rh = rh_coords.copy()
    # FreeSurfer surfaces are in mm with the left hemisphere typically at x<0.
    # Re-center each hemisphere on the midline then push apart by `gap_mm/2`.
    lh[:, 0] = lh[:, 0] - lh[:, 0].max() - gap_mm / 2.0
    rh[:, 0] = rh[:, 0] - rh[:, 0].min() + gap_mm / 2.0

    combined_v = np.vstack([lh, rh])
    rh_offset = lh.shape[0]
    combined_f = np.vstack([lh_faces, rh_faces + rh_offset])
    return combined_v, combined_f, rh_offset


def _normalize_for_web(v: np.ndarray, scale_target: float = 1.6) -> np.ndarray:
    """
    Center the mesh and scale so the longest axis ~= `scale_target` in Three.js units.
    Keeps the scene-graph code simple — same camera position works for both meshes.
    """
    v = v - v.mean(axis=0, keepdims=True)
    span = float((v.max(axis=0) - v.min(axis=0)).max())
    if span <= 0:
        return v
    v = v * (scale_target / span)
    return v


def _build_glb(v: np.ndarray, f: np.ndarray) -> bytes:
    """
    Write a binary GLB (glTF 2.0) with one mesh: positions + normals + indices.
    Normals are computed from face geometry (smooth shading via vertex normal
    averaging — trimesh handles it).
    """
    mesh = trimesh.Trimesh(vertices=v, faces=f, process=False)
    # Smooth shading normals.
    mesh.vertex_normals  # noqa: B018 — triggers computation
    # Use trimesh's gltf exporter; force binary.
    glb_bytes = trimesh.exchange.gltf.export_glb(mesh, include_normals=True)
    return glb_bytes


def _build_vertex_to_region(n_verts: int, rh_offset: int) -> dict[str, str]:
    """
    Map each fsaverage5 vertex index to a 20-region id (or "" for unassigned).
    Honest approximation; replace with a real atlas in Phase 11+.
    """
    arr = [""] * n_verts
    for r, (lo, hi) in _LH_RANGES.items():
        for i in range(max(0, lo), min(n_verts, hi)):
            arr[i] = r
    for r, (lo, hi) in _RH_RANGES.items():
        rh_lo = rh_offset + lo
        rh_hi = rh_offset + hi
        for i in range(max(rh_offset, rh_lo), min(n_verts, rh_hi)):
            arr[i] = r
    for r, ranges in _BILATERAL_RANGES.items():
        for lo, hi in ranges:
            # Left
            for i in range(max(0, lo), min(rh_offset, hi)):
                if arr[i] == "":
                    arr[i] = r
            # Right (mirrored)
            for i in range(
                max(rh_offset, rh_offset + lo),
                min(n_verts, rh_offset + hi),
            ):
                if arr[i] == "":
                    arr[i] = r
    return {str(i): arr[i] for i in range(n_verts) if arr[i] != ""}


def _build_correspondence(
    fsavg5_coords: np.ndarray,
    fsavg6_coords: np.ndarray,
    fsavg5_n: int,
    fsavg6_n: int,
) -> dict[str, Any]:
    """
    For each fsaverage6 vertex, find the nearest fsaverage5 vertex (direct) +
    the 3 nearest with barycentric-ish weights (interpolated).

    FreeSurfer's icosahedral hierarchy guarantees that the first ~N vertices
    of fsaverage6 coincide spatially with fsaverage5 — but we don't assume
    that here. We just KDTree by 3D position. Cheap enough at this scale.
    """
    from scipy.spatial import cKDTree

    tree = cKDTree(fsavg5_coords)
    # k=3 nearest for interpolation weighting.
    dists, idx = tree.query(fsavg6_coords, k=3)
    # Use a small epsilon to avoid divide-by-zero when an fsavg6 vertex
    # coincides with an fsavg5 vertex.
    inv = 1.0 / (dists + 1e-6)
    weights = inv / inv.sum(axis=1, keepdims=True)

    direct: dict[str, int] = {}
    interpolated: dict[str, dict[str, Any]] = {}
    # Vertex is "direct" if the nearest neighbor is essentially coincident
    # (distance < 0.01 in the normalized scale).
    DIRECT_TOL = 0.01
    for i in range(fsavg6_n):
        if dists[i, 0] < DIRECT_TOL:
            direct[str(i)] = int(idx[i, 0])
        else:
            interpolated[str(i)] = {
                "neighbors": [int(idx[i, 0]), int(idx[i, 1]), int(idx[i, 2])],
                "weights": [
                    float(weights[i, 0]),
                    float(weights[i, 1]),
                    float(weights[i, 2]),
                ],
            }
    return {"direct": direct, "interpolated": interpolated}


def _decimate(v: np.ndarray, f: np.ndarray, target_count: int) -> tuple[np.ndarray, np.ndarray]:
    """
    Quadric edge-collapse decimation via trimesh.simplify. Falls back to
    open3d if available + trimesh path errors.
    """
    mesh = trimesh.Trimesh(vertices=v, faces=f, process=False)
    try:
        decimated = mesh.simplify_quadric_decimation(target_count)
        return (
            np.asarray(decimated.vertices, dtype=np.float32),
            np.asarray(decimated.faces, dtype=np.int32),
        )
    except Exception as e:  # noqa: BLE001
        print(f"[prepare_mesh] trimesh decimation failed: {e}; shipping full-res.")
        return v, f


def generate(resolution: str) -> dict[str, Any]:
    print(f"[prepare_mesh] fetching {resolution}…")
    fs = fetch_surf_fsaverage(mesh=resolution)
    lh_v, lh_f = _read_surface(fs["pial_left"])
    rh_v, rh_f = _read_surface(fs["pial_right"])

    combined_v, combined_f, rh_offset = _combine_hemispheres(lh_v, lh_f, rh_v, rh_f)
    combined_v = _normalize_for_web(combined_v)
    print(
        f"[prepare_mesh] {resolution}: "
        f"{combined_v.shape[0]} verts, {combined_f.shape[0]} faces (combined)"
    )

    # Decimate fsaverage6 for web. Aim for ~70k vertices.
    if resolution == "fsaverage6" and combined_v.shape[0] > 80000:
        target_faces = int(combined_f.shape[0] * (70000 / combined_v.shape[0]))
        combined_v, combined_f = _decimate(combined_v, combined_f, target_faces)
        print(
            f"[prepare_mesh] decimated to {combined_v.shape[0]} verts, "
            f"{combined_f.shape[0]} faces"
        )

    glb = _build_glb(combined_v, combined_f)
    out_name = (
        "fsaverage5_pial.glb"
        if resolution == "fsaverage5"
        else "fsaverage6_pial_web.glb"
    )
    out_path = OUT_MESH_DIR / out_name
    out_path.write_bytes(glb)
    print(
        f"[prepare_mesh] wrote {out_path.relative_to(HERE)}  "
        f"({len(glb)/1024:.1f} KB)"
    )

    return {
        "resolution": resolution,
        "vertices": combined_v.shape[0],
        "faces": combined_f.shape[0],
        "rh_offset": rh_offset if resolution == "fsaverage5" else None,
        "coords": combined_v,  # kept in memory for correspondence step
        "file": str(out_path.relative_to(HERE)),
        "file_kb": len(glb) / 1024,
    }


def main() -> None:
    stats = {}
    stats["fsaverage5"] = generate("fsaverage5")
    stats["fsaverage6"] = generate("fsaverage6")

    # Vertex → region map (fsaverage5 only).
    vtr = _build_vertex_to_region(
        stats["fsaverage5"]["vertices"],
        stats["fsaverage5"]["rh_offset"],
    )
    vtr_path = OUT_PRED_DIR / "vertex_to_region.json"
    vtr_path.write_text(json.dumps(vtr, separators=(",", ":")), encoding="utf-8")
    print(f"[prepare_mesh] wrote {vtr_path.relative_to(HERE)} ({len(vtr)} entries)")

    # fsaverage5 → fsaverage6 correspondence (for prediction upsampling).
    print("[prepare_mesh] building cross-resolution correspondence…")
    correspondence = _build_correspondence(
        stats["fsaverage5"]["coords"],
        stats["fsaverage6"]["coords"],
        stats["fsaverage5"]["vertices"],
        stats["fsaverage6"]["vertices"],
    )
    corr_path = OUT_PRED_DIR / "vertex_correspondence_fsavg5_to_fsavg6.json"
    corr_path.write_text(
        json.dumps(correspondence, separators=(",", ":")),
        encoding="utf-8",
    )
    print(
        f"[prepare_mesh] wrote {corr_path.relative_to(HERE)}  "
        f"({len(correspondence['direct'])} direct, "
        f"{len(correspondence['interpolated'])} interpolated)"
    )

    # MESHES.md for the public dir.
    meshes_md = OUT_MESH_DIR / "MESHES.md"
    meshes_md.write_text(
        "# Brain meshes\n\n"
        "Generated by `backend/scripts/prepare_mesh.py`.\n\n"
        "| Mesh | Vertices | Faces | File size | Used for |\n"
        "|------|---------:|------:|----------:|----------|\n"
        f"| fsaverage5_pial.glb | {stats['fsaverage5']['vertices']:,} | "
        f"{stats['fsaverage5']['faces']:,} | {stats['fsaverage5']['file_kb']:.0f} KB | "
        "Interactive rooms (Mirror / Music / Cross-Cultural). Vertex-aligned with TRIBE predictions. |\n"
        f"| fsaverage6_pial_web.glb | {stats['fsaverage6']['vertices']:,} | "
        f"{stats['fsaverage6']['faces']:,} | {stats['fsaverage6']['file_kb']:.0f} KB | "
        "Hero cinematic moments (Home, About). Decimated from ~163k vertices for web. |\n\n"
        "## Sibling files (one level up in `public/`)\n\n"
        "- `vertex_to_region.json`: fsaverage5 vertex → one of our 20 named regions. "
        "Approximate vertex-range heuristic; swap for a real Destrieux/Glasser atlas later.\n"
        "- `vertex_correspondence_fsavg5_to_fsavg6.json`: nearest-neighbor map + 3-nn "
        "interpolation weights so a 20484-vertex prediction can be displayed on the "
        "higher-resolution mesh.\n"
        "\n## Honesty note\n\n"
        "Rendering predictions on fsaverage6 is interpolation, not enhanced prediction. "
        "TRIBE outputs 20484 cortical samples; what looks like finer activation detail on "
        "the hero mesh is barycentric blending of those samples across the denser surface.\n",
        encoding="utf-8",
    )
    print(f"[prepare_mesh] wrote {meshes_md.relative_to(HERE)}")

    print("[prepare_mesh] ✓ done")


if __name__ == "__main__":
    main()
