"""
build_neurosynth_activations.py — Fetch Neurosynth meta-analytic
maps and project them onto the HCP-MMP-360 parcellation that the
frontend brain visualization renders (PR-A of the v1.0 real-fMRI
plan).

Pipeline per stimulus:
  1. Resolve stimulus to (term, weight) composition.
  2. For each term, run a NiMARE MKDA-Chi-squared meta-analysis on
     the Neurosynth-v7 dataset to obtain a z-map in MNI152 space.
     Term-level z-maps are cached in `backend/data/term_zmaps/` so
     reruns skip the expensive step.
  3. Project each z-map onto fsaverage5 cortical surface via
     nilearn.surface.vol_to_surf (separately for left and right
     hemispheres).
  4. Aggregate per-vertex values to HCP-MMP-360 parcels using the
     vertex-to-parcel lookups produced by `build_parcellation.py`.
  5. Composite weighted parcel maps if the stimulus has multiple
     terms.
  6. Sigmoid-squash to [0, 1] for the frontend's color ramp.
  7. Emit JSON to shared/activations/<category>/<id>.json with full
     provenance (term composition, study count, citation, license).

Idempotent: re-runs only recompute missing outputs.

Run:
  python backend/scripts/build_neurosynth_activations.py
  python backend/scripts/build_neurosynth_activations.py --force-stimuli
  python backend/scripts/build_neurosynth_activations.py --only atlas
"""

from __future__ import annotations

import argparse
import json
import math
import sys
import time
from collections.abc import Iterable
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import numpy as np

HERE = Path(__file__).resolve().parents[2]
DATA_CACHE = HERE / "backend" / "data"
NS_DIR = DATA_CACHE / "neurosynth"
ZMAP_CACHE = DATA_CACHE / "term_zmaps"
PARCEL_LEFT_FP = HERE / "frontend" / "public" / "parcellation" / "hcp_mmp_left.json"
PARCEL_RIGHT_FP = HERE / "frontend" / "public" / "parcellation" / "hcp_mmp_right.json"
PARCEL_LABELS_FP = HERE / "frontend" / "public" / "parcellation" / "parcel-labels.json"
REGION_MAP_FP = HERE / "frontend" / "content" / "parcellation" / "region-to-parcel-map.json"
# Outputs land directly under frontend/public/activations/ so Next.js
# serves them as static at /activations/<category>/<id>.json. The
# `shared/activations/` path mentioned in the plan is reserved for a
# future backend-served route; for v1.0 the static-serve path is the
# whole story and avoids a copy step.
OUT_ROOT = HERE / "frontend" / "public" / "activations"


# -----------------------------------------------------------------
# Stimulus map — the editorial table that drives every Neurosynth
# query. Each entry is (category, id, composition) where composition
# is a list of (term, weight) pairs that sum to ~1.0.
# -----------------------------------------------------------------

@dataclass(frozen=True)
class Stimulus:
    category: str
    id: str
    composition: tuple[tuple[str, float], ...]
    notes: str = ""


# Atlas — one term per region, naming the region's primary function.
# All terms verified present in Neurosynth-v7 abstract tfidf vocab.
# Compound terms like "language production" or "spatial navigation"
# don't exist as Neurosynth tokens; use single-word forms.
ATLAS_STIMULI: list[Stimulus] = [
    Stimulus("atlas", "ifg_left",   (("language", 1.0),)),
    Stimulus("atlas", "ifg_right",  (("inhibition", 1.0),)),
    Stimulus("atlas", "pstg_left",  (("speech perception", 1.0),)),
    Stimulus("atlas", "pstg_right", (("auditory", 0.6), ("voice", 0.4))),
    Stimulus("atlas", "mtg_left",   (("semantic", 1.0),)),
    Stimulus("atlas", "mtg_right",  (("semantic", 0.6), ("social", 0.4))),
    Stimulus("atlas", "atl_left",   (("semantic memory", 1.0),)),
    Stimulus("atlas", "atl_right",  (("face", 0.5), ("semantic", 0.5))),
    Stimulus("atlas", "agl_left",   (("theory mind", 0.5), ("default mode", 0.5))),
    Stimulus("atlas", "agl_right",  (("theory mind", 0.6), ("default mode", 0.4))),
    Stimulus("atlas", "hg_left",    (("auditory", 1.0),)),
    Stimulus("atlas", "hg_right",   (("auditory", 1.0),)),
    Stimulus("atlas", "vmpfc",      (("value", 0.5), ("reward", 0.5))),
    Stimulus("atlas", "dmpfc",      (("mentalizing", 0.6), ("self referential", 0.4))),
    Stimulus("atlas", "pcc",        (("default mode", 1.0),)),
    Stimulus("atlas", "precuneus",  (("autobiographical memory", 0.5), ("default mode", 0.5))),
    Stimulus("atlas", "amyg_left",  (("emotion", 0.5), ("salience", 0.5))),
    Stimulus("atlas", "amyg_right", (("fear", 0.5), ("salience", 0.5))),
    Stimulus("atlas", "hipp_left",  (("episodic memory", 1.0),)),
    Stimulus("atlas", "hipp_right", (("episodic memory", 0.6), ("navigation", 0.4))),
]

# Faust passages — composite by editorial decomposition.
# All terms verified in Neurosynth-v7 vocab; "love" → "affective"
# (love is not a token in the abstract tfidf vocabulary).
FAUST_STIMULI: list[Stimulus] = [
    Stimulus(
        "passages", "faust_wager",
        (("reward anticipation", 0.4), ("value", 0.3), ("reward", 0.2), ("self referential", 0.1)),
        notes="Studierzimmer II wager — wanting vs. liking; predicted reward axis.",
    ),
    Stimulus(
        "passages", "faust_walpurgis",
        (("emotion", 0.3), ("attention", 0.3), ("perception", 0.2), ("imagery", 0.2)),
        notes="Walpurgis Night — perceptual flood + dissolution of attentional gate.",
    ),
    Stimulus(
        "passages", "faust_gretchen",
        (("face", 0.3), ("emotion", 0.3), ("autobiographical memory", 0.2), ("affective", 0.2)),
        notes="Gretchen tragedy — face processing + autobiographical-emotion integration.",
    ),
]

# Dante passages.
DANTE_STIMULI: list[Stimulus] = [
    Stimulus(
        "passages", "dante_nel_mezzo",
        (("autobiographical memory", 0.4), ("self referential", 0.3), ("navigation", 0.3)),
        notes="Inferno I.1 — midlife frame, autobiographical self-locating.",
    ),
    Stimulus(
        "passages", "dante_paolo_francesca",
        (("emotion", 0.3), ("reading", 0.3), ("autobiographical memory", 0.2), ("affective", 0.2)),
        notes="Inferno V — reading as triggering autobiographical-emotional loop.",
    ),
    Stimulus(
        "passages", "dante_beatrice",
        (("face", 0.3), ("affective", 0.3), ("attention", 0.2), ("self referential", 0.2)),
        notes="Purgatorio XXX — face of Beatrice, sustained attention on beloved.",
    ),
]

# Music room — composite per genre slot.
# "meditation" not in Neurosynth vocab; "rest" + "default mode"
# carry the contemplative/DMN load instead.
MUSIC_STIMULI: list[Stimulus] = [
    Stimulus(
        "music", "ambient-drone",
        (("rest", 0.4), ("default mode", 0.3), ("auditory", 0.3)),
        notes="Stellardrone 'In Time' — DMN-warming ambient with auditory engagement.",
    ),
    Stimulus(
        "music", "modal-ballad",
        (("music", 0.4), ("auditory", 0.3), ("emotion", 0.3)),
        notes="King Oliver 1923 — ensemble jazz; auditory + limbic warmth.",
    ),
    Stimulus(
        "music", "thai-lullaby",
        (("music", 0.3), ("episodic memory", 0.3), ("emotion", 0.2), ("language", 0.2)),
        notes="Thai pentatonic lullaby — episodic + linguistic + emotional binding.",
    ),
]

# Mandalas — contemplative-attention composite, per tradition.
# "meditation" missing in Neurosynth; substituted with rest + default
# mode + imagery, which together approximate contemplative attention
# in the meta-analytic vocabulary.
MANDALA_STIMULI: list[Stimulus] = [
    Stimulus("mandalas", "fludd",            (("rest", 0.4), ("default mode", 0.4), ("attention", 0.2))),
    Stimulus("mandalas", "hildegard",        (("rest", 0.3), ("imagery", 0.4), ("emotion", 0.3))),
    Stimulus("mandalas", "bhavachakra",      (("rest", 0.5), ("default mode", 0.3), ("attention", 0.2))),
    Stimulus("mandalas", "sri_yantra",       (("rest", 0.4), ("attention", 0.3), ("self referential", 0.3))),
    Stimulus("mandalas", "aztec_sun_stone",  (("imagery", 0.4), ("default mode", 0.3), ("attention", 0.3))),
    Stimulus("mandalas", "chartres_rose",    (("rest", 0.3), ("imagery", 0.4), ("attention", 0.3))),
    Stimulus("mandalas", "splendor_solis",   (("imagery", 0.4), ("self referential", 0.3), ("default mode", 0.3))),
]

# Cross-cultural — English vs Thai sides anchored on the linguistic finding.
# "loneliness", "mother", "beauty", "aesthetic" all missing from
# Neurosynth vocab; substituted with the closest single-word terms
# that carry the semantic load (social, face, reward, emotion).
CROSSCULTURAL_STIMULI: list[Stimulus] = [
    Stimulus("crosscultural", "loneliness_english",
             (("social", 0.3), ("emotion", 0.3), ("language", 0.2), ("self referential", 0.2))),
    Stimulus("crosscultural", "loneliness_thai",
             (("social", 0.3), ("emotion", 0.3), ("self referential", 0.2), ("autobiographical memory", 0.2))),
    Stimulus("crosscultural", "mother_english",
             (("face", 0.4), ("social", 0.3), ("emotion", 0.3))),
    Stimulus("crosscultural", "mother_thai",
             (("face", 0.3), ("autobiographical memory", 0.3), ("social", 0.2), ("respect", 0.2))),
    Stimulus("crosscultural", "beautiful_english",
             (("reward", 0.4), ("face", 0.3), ("perception", 0.3))),
    Stimulus("crosscultural", "beautiful_thai",
             (("reward", 0.3), ("perception", 0.3), ("emotion", 0.2), ("body", 0.2))),
]

# Bridges — one per canonical section.
# "implicit", "interoception" missing in Neurosynth vocab — use
# "memory" + "semantic" for implicit; "interoceptive" for embodiment.
BRIDGES_STIMULI: list[Stimulus] = [
    Stimulus("bridges", "language-meaning",       (("semantic", 0.5), ("language", 0.5))),
    Stimulus("bridges", "memory-reconstruction",  (("episodic memory", 1.0),)),
    Stimulus("bridges", "salience-numinosity",    (("salience", 0.5), ("emotion", 0.5))),
    Stimulus("bridges", "implicit-cognition-unconscious", (("memory", 0.5), ("semantic", 0.5))),
    Stimulus("bridges", "dmn-and-self-system",    (("default mode", 1.0),)),
    Stimulus("bridges", "embodiment-feeling",     (("interoceptive", 0.5), ("emotion", 0.5))),
    Stimulus("bridges", "attention-as-axis",      (("attention", 1.0),)),
    Stimulus("bridges", "fear-anxiety-defense",   (("fear", 0.5), ("anxiety", 0.5))),
    Stimulus("bridges", "reward-motivation",      (("reward", 0.5), ("motivation", 0.5))),
    Stimulus("bridges", "face-emotion",           (("face", 0.5), ("emotion", 0.5))),
    Stimulus("bridges", "predictive-coding",      (("prediction error", 0.6), ("expectation", 0.4))),
]

ALL_STIMULI: tuple[Stimulus, ...] = tuple(
    ATLAS_STIMULI
    + FAUST_STIMULI
    + DANTE_STIMULI
    + MUSIC_STIMULI
    + MANDALA_STIMULI
    + CROSSCULTURAL_STIMULI
    + BRIDGES_STIMULI
)


# -----------------------------------------------------------------
# Pipeline
# -----------------------------------------------------------------

def unique_terms(stimuli: Iterable[Stimulus]) -> list[str]:
    """Return the sorted unique set of Neurosynth terms across stimuli."""
    seen: set[str] = set()
    for s in stimuli:
        for term, _ in s.composition:
            seen.add(term)
    return sorted(seen)


def ensure_dataset() -> Any:
    """
    Fetch the Neurosynth-v7 dataset via NiMARE. Cached on disk; runs
    once. Returns a nimare.dataset.Dataset.
    """
    from nimare.extract import fetch_neurosynth
    from nimare.io import convert_neurosynth_to_dataset

    NS_DIR.mkdir(parents=True, exist_ok=True)
    cached_dataset_fp = NS_DIR / "neurosynth_v7_dataset.pkl.gz"
    if cached_dataset_fp.exists():
        import pickle, gzip
        print(f"[neurosynth] loading cached dataset {cached_dataset_fp}")
        with gzip.open(cached_dataset_fp, "rb") as f:
            return pickle.load(f)

    print(f"[neurosynth] downloading dataset to {NS_DIR} (one-time, ~50 MB)")
    files = fetch_neurosynth(
        data_dir=NS_DIR,
        version="7",
        overwrite=False,
        source="abstract",
        vocab="terms",
        return_type="files",
    )
    print(f"[neurosynth] downloaded {len(files)} files; converting to dataset")
    db = files[0] if isinstance(files, list) else files
    dset = convert_neurosynth_to_dataset(
        coordinates_file=db["coordinates"],
        metadata_file=db["metadata"],
        annotations_files=db["features"],
        target="mni152_2mm",
    )
    import pickle, gzip
    with gzip.open(cached_dataset_fp, "wb") as f:
        pickle.dump(dset, f)
    print(f"[neurosynth] dataset cached to {cached_dataset_fp}")
    return dset


def compute_term_zmap(dset: Any, term: str) -> Any:
    """
    Run a NiMARE MKDA-Chi2 meta-analysis on studies tagged with
    `term`. Returns the z statistic map as a nibabel NIfTI image.
    Cached in `term_zmaps/` by sanitized term name.
    """
    safe = term.replace(" ", "_").replace("/", "_")
    ZMAP_CACHE.mkdir(parents=True, exist_ok=True)
    cache_fp = ZMAP_CACHE / f"{safe}_z.nii.gz"
    if cache_fp.exists():
        import nibabel as nib
        return nib.load(str(cache_fp))

    print(f"[meta] running MKDA-Chi2 for '{term}'…", flush=True)
    t0 = time.monotonic()

    # Select studies whose abstract mentions the term above a
    # canonical frequency threshold (matches Neurosynth defaults).
    feature_name = f"terms_abstract_tfidf__{term}"
    try:
        ids = dset.get_studies_by_label(labels=[feature_name], label_threshold=0.001)
    except Exception:
        # Some terms may not exist in the abstract vocabulary; try
        # alternative formulations.
        return None

    if not ids:
        print(f"[meta] no studies matched '{term}'; skipping")
        return None
    if len(ids) < 10:
        print(f"[meta] only {len(ids)} studies for '{term}' — sparse, skipping")
        return None

    sub_dset = dset.slice(ids)

    from nimare.meta.cbma.mkda import MKDAChi2
    estimator = MKDAChi2()
    result = estimator.fit(sub_dset, dset)
    z_img = result.get_map("z_desc-association")
    z_img.to_filename(str(cache_fp))
    print(
        f"[meta] '{term}' over {len(ids)} studies in "
        f"{time.monotonic() - t0:.1f}s -> {cache_fp.name}"
    )
    return z_img


def project_to_fsaverage5(z_img: Any) -> tuple[np.ndarray, np.ndarray]:
    """
    Project an MNI152 z-map to fsaverage5 cortical surface vertices.
    Returns (left_hem_array, right_hem_array), each shape (10242,).
    """
    from nilearn import datasets as _ds
    from nilearn.surface import vol_to_surf

    fs = _ds.fetch_surf_fsaverage("fsaverage5")
    left = np.asarray(vol_to_surf(z_img, fs["pial_left"]))
    right = np.asarray(vol_to_surf(z_img, fs["pial_right"]))
    return left, right


def aggregate_to_parcels(
    left_verts: np.ndarray,
    right_verts: np.ndarray,
    parcels_left: list[int],
    parcels_right: list[int],
) -> dict[int, float]:
    """
    Average per-vertex values within each parcel. Returns
    {parcel_id (1-360): mean value}. Parcel 0 (medial wall) is
    excluded.
    """
    out: dict[int, list[float]] = {}
    for v, p in zip(left_verts, parcels_left):
        if p == 0:
            continue
        out.setdefault(p, []).append(float(v))
    for v, p in zip(right_verts, parcels_right):
        if p == 0:
            continue
        out.setdefault(p, []).append(float(v))
    return {pid: float(np.mean(vs)) for pid, vs in out.items()}


def sigmoid_squash(values: dict[int, float], center: float = 2.5, scale: float = 1.2) -> dict[int, float]:
    """
    Map raw z-values to [0, 1] via a sigmoid. Defaults are tuned so
    z ≈ center maps to ~0.5 and z ≈ center+2*scale maps to ~0.85,
    matching the perceptual scale the existing Destrieux pipeline
    uses on the frontend.
    """
    out: dict[int, float] = {}
    for pid, v in values.items():
        x = (v - center) / scale
        out[pid] = 1.0 / (1.0 + math.exp(-x))
    return out


def composite_parcels(
    per_term: dict[str, dict[int, float]],
    composition: tuple[tuple[str, float], ...],
) -> dict[int, float]:
    """
    Weighted average across term parcel maps. Terms whose maps are
    None (missing) are skipped; weights renormalized.
    """
    available = [(t, w) for t, w in composition if per_term.get(t) is not None]
    if not available:
        return {}
    total_w = sum(w for _, w in available)
    out: dict[int, float] = {}
    parcel_ids: set[int] = set()
    for t, _ in available:
        parcel_ids.update(per_term[t].keys())
    for pid in parcel_ids:
        s = 0.0
        for t, w in available:
            s += (w / total_w) * per_term[t].get(pid, 0.0)
        out[pid] = s
    return out


def top_regions_20(
    parcel_acts: dict[int, float],
    parcel_labels: dict[str, dict[str, Any]],
    region_map: dict[str, list[str]],
    top_k: int = 4,
) -> list[dict[str, Any]]:
    """
    Express the top-K activated 20-region IDs by aggregating parcel
    activations back to the 20-region vocabulary.
    """
    # Build parcel-label -> id reverse lookup.
    label_to_id: dict[str, int] = {
        v["label"]: int(k) for k, v in parcel_labels.items()
    }

    region_acts: dict[str, float] = {}
    for region, parcels in region_map.items():
        if region.startswith("_") or not parcels:
            continue
        vals: list[float] = []
        for label in parcels:
            pid = label_to_id.get(label)
            if pid is None:
                continue
            vals.append(parcel_acts.get(pid, 0.0))
        if vals:
            region_acts[region] = float(np.mean(vals))

    ordered = sorted(region_acts.items(), key=lambda kv: kv[1], reverse=True)
    return [
        {"region": r, "activation": round(a, 4)} for r, a in ordered[:top_k]
    ]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--only",
        nargs="*",
        default=None,
        help="Restrict to one or more categories (atlas, passages, music, …)",
    )
    parser.add_argument(
        "--force-stimuli",
        action="store_true",
        help="Recompute stimulus JSON outputs even when present.",
    )
    parser.add_argument(
        "--force-terms",
        action="store_true",
        help="Recompute term z-maps even when cached.",
    )
    args = parser.parse_args()

    # Load parcellation lookups.
    if not PARCEL_LEFT_FP.exists():
        print(
            "[error] parcellation files missing. Run "
            "`python backend/scripts/build_parcellation.py` first.",
            file=sys.stderr,
        )
        sys.exit(1)
    parcels_left = json.loads(PARCEL_LEFT_FP.read_text())
    parcels_right = json.loads(PARCEL_RIGHT_FP.read_text())
    parcel_labels = json.loads(PARCEL_LABELS_FP.read_text())
    region_map = json.loads(REGION_MAP_FP.read_text())

    # Filter stimuli.
    stimuli = ALL_STIMULI
    if args.only:
        stimuli = tuple(s for s in stimuli if s.category in set(args.only))
    print(f"[stimuli] {len(stimuli)} entries across categories: "
          f"{sorted({s.category for s in stimuli})}")

    if args.force_terms:
        for p in ZMAP_CACHE.glob("*.nii.gz"):
            p.unlink()
        print("[terms] cache cleared")

    # Fetch + cache Neurosynth dataset.
    dset = ensure_dataset()

    # Compute term-level parcel activations.
    terms = unique_terms(stimuli)
    print(f"[terms] {len(terms)} unique terms: {terms}")
    per_term_parcels: dict[str, dict[int, float] | None] = {}
    for term in terms:
        z_img = compute_term_zmap(dset, term)
        if z_img is None:
            per_term_parcels[term] = None
            continue
        left_v, right_v = project_to_fsaverage5(z_img)
        raw = aggregate_to_parcels(left_v, right_v, parcels_left, parcels_right)
        squashed = sigmoid_squash(raw)
        per_term_parcels[term] = squashed
        print(f"[term] {term} -> {len(squashed)} parcels populated")

    # Emit stimulus JSONs.
    written = 0
    for s in stimuli:
        out_dir = OUT_ROOT / s.category
        out_dir.mkdir(parents=True, exist_ok=True)
        out_fp = out_dir / f"{s.id}.json"
        if out_fp.exists() and not args.force_stimuli:
            continue

        composite = composite_parcels(per_term_parcels, s.composition)
        if not composite:
            print(f"[skip] {s.category}/{s.id}: no parcel data after composite")
            continue

        composition_human = [[t, w] for t, w in s.composition]
        terms_used = [t for t, _ in s.composition if per_term_parcels.get(t) is not None]
        # Sum study count across used terms (rough provenance signal).
        # NiMARE doesn't surface study count after the fact without
        # re-running the slice; we record the count of unique terms
        # plus the composition for honesty.
        payload: dict[str, Any] = {
            "id": f"{s.category}_{s.id}",
            "source": "Neurosynth meta-analysis",
            "license": "CC0",
            "citation": "Yarkoni et al., Nature Methods 2011, doi:10.1038/nmeth.1635",
            "parcellation": "HCP-MMP-360 (Glasser 2016, doi:10.1038/nature18933)",
            "methodology": (
                "NiMARE MKDA-Chi2 meta-analysis on Neurosynth-v7 (>14,000 "
                "fMRI studies). Z-map projected to fsaverage5 via "
                "nilearn.surface.vol_to_surf, averaged within HCP-MMP-360 "
                "parcels, sigmoid-squashed (center=2.5, scale=1.2) into [0,1]."
            ),
            "composition": composition_human,
            "terms_used": terms_used,
            "notes": s.notes,
            "parcel_activations": {
                str(pid): round(float(v), 4) for pid, v in composite.items()
            },
            "top_regions_20": top_regions_20(composite, parcel_labels, region_map),
        }
        out_fp.write_text(json.dumps(payload, indent=2, ensure_ascii=False))
        written += 1
        print(f"[write] {out_fp.relative_to(HERE)}")

    print(f"[done] {written} stimulus JSONs written under {OUT_ROOT.relative_to(HERE)}")


if __name__ == "__main__":
    main()
