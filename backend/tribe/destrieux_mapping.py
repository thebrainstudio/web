"""
Principled mapping from Destrieux 2009 (a2009s, 148 parcels) to the
Brain Studio's 20 named regions.

The Destrieux atlas (https://surfer.nmr.mgh.harvard.edu/fswiki/CorticalParcellation)
provides 74 cortical parcels per hemisphere on the fsaverage5 surface,
with neuroanatomically transparent labels (e.g. `G_front_inf-Opercular`
which is the pars opercularis of the inferior frontal gyrus — Broca's
area, BA 44). Each Brain Studio region is hand-mapped to the Destrieux
parcels that best correspond to its definition in
`frontend/lib/regions.ts`.

Subcortical structures (amygdala, hippocampus) are NOT in Destrieux —
that atlas covers cortical surface only. For amyg_left/right and
hipp_left/right we fall back to the nearest cortical parcels that
flank the medial temporal lobe (the parahippocampal gyrus + temporal
pole). TRIBE v2's fsaverage5 output is itself surface-only, so any
"hippocampus" prediction from a surface-only model is already a
cortical proxy. The Brain Studio's hippocampus label is honest about
this — the regional gloss in `lib/regions.ts` describes the
hippocampus's *cortical companions*, and the visualization places the
3D anchor in the medial temporal lobe.

Mapping was hand-built by FCH on 2026-05-14 with reference to:
  - Destrieux et al. 2010, NeuroImage: "Automatic parcellation of human
    cortical gyri and sulci using standard anatomical nomenclature"
  - Hagoort 2014, "Nodes and networks in the neural architecture for
    language"
  - Glasser 2016 MMP regional name table (for cross-validation)

For each region, the mapping prefers anatomical specificity over
functional generalization (e.g. ifg_left = pars opercularis ∪ pars
triangularis, NOT the whole inferior frontal gyrus).

================================================================
DESTRIEUX PARCEL NAMING CONVENTION
================================================================

In nilearn's `fetch_atlas_destrieux_2009()`, parcel labels are byte
strings of the form `b'G_front_inf-Opercular'` where the prefix
disambiguates:

  G_*       gyrus (surface gyral crown)
  S_*       sulcus
  Lat_*     lateral
  Pole_*    pole
  G_and_S_* combined gyrus + sulcus

Hemisphere is determined by which atlas array you read (left vs right);
the labels themselves are not hemisphere-prefixed.
"""

from __future__ import annotations

from typing import Final

# Map: brain-studio region_id → list of Destrieux parcel names that
# constitute it. Parcels are read hemisphere-aware (e.g. ifg_left
# pulls these parcels from the left-hemisphere Destrieux array,
# ifg_right from the right-hemisphere array).
#
# Where a region is bilateral on the medial wall (vmpfc, dmpfc, pcc,
# precuneus), we include parcels from BOTH hemispheres in the same
# mapping entry — see _is_bilateral below.

DESTRIEUX_TO_REGION: Final[dict[str, list[str]]] = {
    # ── Frontal language regions ────────────────────────────────────
    # Broca's region = pars opercularis (BA 44) + pars triangularis (BA 45)
    "ifg_left": [
        "G_front_inf-Opercular",
        "G_front_inf-Triangul",
    ],
    "ifg_right": [
        "G_front_inf-Opercular",
        "G_front_inf-Triangul",
    ],

    # ── Posterior superior temporal (Wernicke-adjacent) ─────────────
    # pSTG = posterior third of the superior temporal gyrus.
    # Destrieux splits STG into anterior, lateral, and planum
    # temporale subdivisions. Posterior STG corresponds to lateral STG
    # plus planum temporale (Wernicke proper).
    "pstg_left": [
        "G_temp_sup-Lateral",
        "G_temp_sup-Plan_tempo",
    ],
    "pstg_right": [
        "G_temp_sup-Lateral",
        "G_temp_sup-Plan_tempo",
    ],

    # ── Middle temporal gyrus ───────────────────────────────────────
    "mtg_left": [
        "G_temporal_middle",
    ],
    "mtg_right": [
        "G_temporal_middle",
    ],

    # ── Anterior temporal lobe (semantic hub) ───────────────────────
    # ATL ≈ temporal pole + anterior portion of the superior temporal
    # gyrus. Destrieux has a discrete "Pole_temporal" parcel which is
    # the cleanest definition.
    "atl_left": [
        "Pole_temporal",
        "G_temp_sup-G_T_transv",  # anterior STG continuation
    ],
    "atl_right": [
        "Pole_temporal",
        "G_temp_sup-G_T_transv",
    ],

    # ── Angular gyrus (semantic / DMN hub) ──────────────────────────
    "agl_left": [
        "G_pariet_inf-Angular",
    ],
    "agl_right": [
        "G_pariet_inf-Angular",
    ],

    # ── Heschl's gyrus / primary auditory cortex ────────────────────
    # Destrieux has the dedicated transverse temporal gyrus parcel.
    "hg_left": [
        "G_temp_sup-G_T_transv",
    ],
    "hg_right": [
        "G_temp_sup-G_T_transv",
    ],

    # ── Medial prefrontal: vmPFC ────────────────────────────────────
    # Ventromedial prefrontal cortex spans the medial orbital frontal
    # gyrus and the gyrus rectus. Bilateral parcels — averaged.
    "vmpfc": [
        "G_orbital",
        "G_rectus",
        "S_orbital_med-olfact",
    ],

    # ── Medial prefrontal: dmPFC ────────────────────────────────────
    # Dorsomedial prefrontal cortex = superior frontal gyrus medial
    # surface + paracingulate region.
    "dmpfc": [
        "G_front_sup",  # the medial portion is captured by averaging this large parcel
        "G_and_S_cingul-Ant",
    ],

    # ── Posterior cingulate cortex (DMN core) ───────────────────────
    "pcc": [
        "G_cingul-Post-dorsal",
        "G_cingul-Post-ventral",
    ],

    # ── Precuneus (DMN + autobiographical) ──────────────────────────
    "precuneus": [
        "G_precuneus",
    ],

    # ── Amygdala (subcortical — proxied) ────────────────────────────
    # The amygdala is a subcortical nucleus — not in Destrieux's
    # cortical-surface parcellation. TRIBE's fsaverage5 output is
    # surface-only too, so any "amygdala" prediction would already be
    # a cortical proxy. We pull from the most amygdala-adjacent
    # cortical parcels: parahippocampal gyrus and temporal pole.
    # Honest in the regional gloss; "the surface near the amygdala."
    "amyg_left": [
        "G_oc-temp_med-Parahip",
        "Pole_temporal",
    ],
    "amyg_right": [
        "G_oc-temp_med-Parahip",
        "Pole_temporal",
    ],

    # ── Hippocampus (subcortical — proxied) ─────────────────────────
    # Same caveat as amygdala. Cortical proxy = parahippocampal gyrus.
    "hipp_left": [
        "G_oc-temp_med-Parahip",
        "S_oc-temp_med_and_Lingual",
    ],
    "hipp_right": [
        "G_oc-temp_med-Parahip",
        "S_oc-temp_med_and_Lingual",
    ],
}

# Regions that are anatomically bilateral on the medial wall — when
# we look up parcels for these, we include both hemispheres.
BILATERAL_REGIONS: Final[set[str]] = {
    "vmpfc",
    "dmpfc",
    "pcc",
    "precuneus",
}


def is_bilateral(region_id: str) -> bool:
    return region_id in BILATERAL_REGIONS


def hemisphere_for(region_id: str) -> str | None:
    """
    Returns 'left', 'right', or None (for bilateral midline regions).
    """
    if region_id in BILATERAL_REGIONS:
        return None
    if region_id.endswith("_left"):
        return "left"
    if region_id.endswith("_right"):
        return "right"
    return None
