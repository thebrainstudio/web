"""
build_parcellation.py — Generate HCP-MMP-360 fsaverage5 parcellation
geometry for the frontend brain visualization (PR-A of the v1.0
real-fMRI plan).

Sources (all free, CC-licensed):
  - Per-vertex parcel labels for fsaverage5:
      ENIGMA toolbox's `glasser_360_fsa5.csv` (community projection
      of Glasser 2016 onto fsaverage5, distributed CC-BY-NC 4.0).
      https://github.com/MICA-MNI/ENIGMA
  - Canonical parcel names + Cole-Anticevic network membership:
      `CortexSubcortex_ColeAnticevic_NetPartition_wSubcorGSR_parcels_LR_LabelKey.txt`
      (CC-BY 4.0). https://github.com/ColeLab/ColeAnticevicNetPartition
  - Underlying atlas:
      Glasser et al. 2016, "A multi-modal parcellation of human
      cerebral cortex," Nature, doi:10.1038/nature18933.

Outputs (under frontend/public/parcellation/):
  hcp_mmp_left.json     - 10242 ints (parcel ID per vertex; 0 = medial wall)
  hcp_mmp_right.json    - 10242 ints (parcel ID per vertex; 0 = medial wall)
  parcel-labels.json    - dict mapping parcel_id (1-360) ->
                          {label, hemisphere, network, networkKey}

Vertex ordering matches nilearn.datasets.fetch_surf_fsaverage
('fsaverage5') and therefore the existing
`frontend/public/meshes/fsaverage5_pial.glb`.

Parcel ID convention:
  0           - medial wall (no parcel)
  1..180      - left hemisphere parcels
  181..360    - right hemisphere parcels

Label format: stripped from CAB-NP's "L_V1_ROI" form to "V1_L" so
parcels match the convention used in
`frontend/content/parcellation/region-to-parcel-map.json`.

Run:
  python backend/scripts/build_parcellation.py
"""

from __future__ import annotations

import csv
import json
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parents[2]
DATA_CACHE = HERE / "backend" / "data"
OUT_DIR = HERE / "frontend" / "public" / "parcellation"

ENIGMA_CSV_URL = (
    "https://raw.githubusercontent.com/MICA-MNI/ENIGMA/master/"
    "enigmatoolbox/datasets/parcellations/glasser_360_fsa5.csv"
)
CABNP_LABEL_URL = (
    "https://raw.githubusercontent.com/ColeLab/ColeAnticevicNetPartition/master/"
    "CortexSubcortex_ColeAnticevic_NetPartition_wSubcorGSR_parcels_LR_LabelKey.txt"
)

EXPECTED_VERTS_PER_HEM = 10_242
EXPECTED_TOTAL_VERTS = EXPECTED_VERTS_PER_HEM * 2
EXPECTED_PARCELS = 360


def cached_get(url: str, filename: str) -> Path:
    """Download `url` to `DATA_CACHE/filename` if not already cached."""
    DATA_CACHE.mkdir(parents=True, exist_ok=True)
    fp = DATA_CACHE / filename
    if not fp.exists():
        print(f"[fetch] {url}")
        urllib.request.urlretrieve(url, fp)
    return fp


def normalize_label(glasser_name: str, hemisphere: str) -> str:
    """
    Convert CAB-NP's "L_V1_ROI" -> "V1_L". Glasser parcel names are
    e.g. V1, V2, MST, 44, 45, FFC, IFJp; some have internal
    underscores (e.g., "p9-46v"), so we strip only the leading
    hemisphere prefix and the trailing "_ROI" suffix.
    """
    if not glasser_name:
        return ""
    parts = glasser_name.split("_")
    # parts[0] is "L" or "R"; parts[-1] is "ROI"; everything else is
    # the parcel core name.
    core = "_".join(parts[1:-1]) if len(parts) >= 3 else glasser_name
    return f"{core}_{hemisphere}"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Per-vertex parcel IDs --------------------------------------
    csv_fp = cached_get(ENIGMA_CSV_URL, "glasser_360_fsa5.csv")
    ids: list[int] = []
    with csv_fp.open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            ids.append(int(line))

    if len(ids) != EXPECTED_TOTAL_VERTS:
        raise RuntimeError(
            f"Expected {EXPECTED_TOTAL_VERTS} vertices, got {len(ids)}"
        )

    left = ids[:EXPECTED_VERTS_PER_HEM]
    right = ids[EXPECTED_VERTS_PER_HEM:]
    max_left = max(left)
    max_right = max(right)

    if max_left > 180:
        raise RuntimeError(f"Left hem parcel ID exceeds 180: {max_left}")
    if max_right > EXPECTED_PARCELS:
        raise RuntimeError(f"Right hem parcel ID exceeds 360: {max_right}")
    if max_right < 181 and any(r > 0 for r in right):
        raise RuntimeError(
            "Right hem has parcel IDs but all are <181 — vertex ordering "
            "may be wrong."
        )

    (OUT_DIR / "hcp_mmp_left.json").write_text(json.dumps(left))
    (OUT_DIR / "hcp_mmp_right.json").write_text(json.dumps(right))
    print(
        f"[wrote] hcp_mmp_left.json   "
        f"({len(left)} verts, parcel IDs 0..{max_left})"
    )
    print(
        f"[wrote] hcp_mmp_right.json  "
        f"({len(right)} verts, parcel IDs 0..{max_right})"
    )

    # 2. Parcel labels ----------------------------------------------
    label_fp = cached_get(CABNP_LABEL_URL, "cabnp_labelkey.txt")
    parcels: dict[str, dict[str, object]] = {}
    with label_fp.open(encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            idx_str = row.get("INDEX", "")
            try:
                idx = int(idx_str)
            except ValueError:
                continue
            if idx < 1 or idx > EXPECTED_PARCELS:
                # CAB-NP includes subcortex rows after the 360 cortical
                # parcels — skip them.
                continue
            hemi = row.get("HEMISPHERE", "").strip()
            network = row.get("NETWORK", "").strip()
            network_key_str = row.get("NETWORKKEY", "0").strip()
            try:
                network_key = int(network_key_str)
            except ValueError:
                network_key = 0
            glasser_name = row.get("GLASSERLABELNAME", "").strip()
            label = normalize_label(glasser_name, hemi)
            parcels[str(idx)] = {
                "label": label,
                "hemisphere": hemi,
                "network": network,
                "networkKey": network_key,
            }

    if len(parcels) != EXPECTED_PARCELS:
        raise RuntimeError(
            f"Expected {EXPECTED_PARCELS} cortical parcels, got {len(parcels)}"
        )

    (OUT_DIR / "parcel-labels.json").write_text(
        json.dumps(parcels, indent=2, ensure_ascii=False)
    )
    print(f"[wrote] parcel-labels.json ({len(parcels)} parcels)")


if __name__ == "__main__":
    main()
