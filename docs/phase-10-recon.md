# Phase 10 — Reconnaissance

**Status:** Recon complete. Awaiting deployment-path approval before any further code.

This document answers the four reconnaissance questions specified in the
Phase 10 brief. No inference code is written until the path is approved.

---

## TL;DR — Three decisions you need to make

1. **TRIBE v2.2 does not exist.** The current and only public Meta TRIBE
   release is **TRIBE v2** (March 26, 2026). The 677 MB checkpoint already
   cached on this machine *is* TRIBE v2. There is no later version to
   chase. Proceed with TRIBE v2 or pick a proxy.

2. **License is CC-BY-NC-4.0.** Non-commercial use only, attribution
   required. The Brain Studio is a non-commercial portfolio / educational
   site — this fits, but the deployment must surface attribution
   prominently and the API responses must not be sold or monetized.
   See §10.0.2 for the exact terms and the attribution language I plan to
   ship.

3. **There is one academic blocker** (§10.0.3, "Atlas mapping"). TRIBE v2
   outputs 20 484 fsaverage5 vertices. The Brain Studio shows a
   hand-picked 20-region vocabulary. The current
   `backend/tribe/region_mapping.py` uses *approximate* vertex ranges
   per region — that is not defensible to a JIPP/cognitive-sciences
   reader. Before flipping the Mirror page over to TRIBE I need to
   either build a real Destrieux-2009 or Glasser-2016 → 20-region
   aggregation, or pick a proxy that is honest about itself.

---

## 10.0.1 — TRIBE v2.2 availability

### What I searched

- HuggingFace: `facebook/tribev2`, `facebook/tribev3`, `facebook/tribe*`
- GitHub: `facebookresearch/tribev2`, `facebookresearch/algonauts-2025`
- Meta FAIR blog and the AI at Meta X account
- The Algonauts 2025 Winners insights paper ([arxiv 2508.10784](https://arxiv.org/abs/2508.10784))
- The TRIBE paper itself ([arxiv 2507.22229](https://arxiv.org/abs/2507.22229))

### What exists

| Version | Date | Status | Notes |
|---|---|---|---|
| **TRIBE v2** | 2026-03-26 | Public release, current | What's cached locally. The Algonauts winner submission, scaled up. CC-BY-NC. |
| TRIBE (original, Algonauts 2025 submission) | 2025-07 | Public via paper code | Schaefer-1000 atlas output, 4 subjects, ~1 B params. |
| TRIBE v1 | n/a | not separately versioned | "v1" is the Algonauts submission above. |
| **TRIBE v2.2** | — | **does not exist** | No reference anywhere. |
| TRIBE v3 | — | does not exist | No reference anywhere. |

### Decision on this question

Use **TRIBE v2**. The cached checkpoint at
`~/.cache/huggingface/hub/models--facebook--tribev2/snapshots/f894e783020944dcd96e5568550afe2aa9743f9f/best.ckpt`
(677 MB) is the model we will deploy.

### If TRIBE v2 turns out to be a poor fit (see §10.0.3 caveats)

We pivot to a **proxy** model that is honest about itself. The
`embedding_baseline_v1_hf` engine already deployed to
`/api/v1/predict` is such a proxy — it returns the same JSON shape
TRIBE would, labelled `engine: "embedding_baseline_v1_hf"`. Any
proxy we ship is_proxy=True; we never lie about what is running.

---

## 10.0.2 — License terms

### License: Creative Commons Attribution-NonCommercial 4.0 International (CC-BY-NC-4.0)

Source: `LICENSE` file in
[huggingface.co/facebook/tribev2](https://huggingface.co/facebook/tribev2)

### Verbatim quotes of the clauses that govern this deployment

**§1.i (NonCommercial defined):**

> NonCommercial means not primarily intended for or directed towards
> commercial advantage or monetary compensation. For purposes of this
> Public License, the exchange of the Licensed Material for other
> material subject to Copyright and Similar Rights by digital
> file-sharing or similar means is NonCommercial provided there is no
> payment of monetary compensation in connection with the exchange.

**§2.a.1 (Grant — scope):**

> The Licensor grants you a worldwide, royalty-free, non-sublicensable,
> non-exclusive, irrevocable license to:
> (a) reproduce and Share the Licensed Material, in whole or in part,
>     for NonCommercial purposes only; and
> (b) produce, reproduce, and Share Adapted Material for NonCommercial
>     purposes only.

**§3.a.1 (Attribution — required artifacts):**

> If You Share the Licensed Material …, You must retain the following
> information supplied by the Licensor:
> (i) Identification of the creator(s) and others designated to
>     receive attribution …
> (ii) A copyright notice;
> (iii) A notice that refers to this Public License;
> (iv) A notice that refers to the disclaimer of warranties;
> (v) A URI or hyperlink to the Licensed Material, to the extent
>     reasonably practicable.

### Question-by-question answers from the brief

**Commercial use:** ❌ Prohibited. The deployment must be visibly
non-commercial. No ads, no paywall, no sale of the prediction outputs.

**Attribution required:** ✅ Yes — per §3.a.1. The Brain Studio must
display:
- "TRIBE v2 by Meta FAIR (d'Ascoli et al., 2026)"
- A link to the model card / paper
- The disclaimer-of-warranties notice
- A pointer to CC-BY-NC-4.0

The natural place is a small footer chip on `/en/mirror` next to the
existing engine label (e.g.
`"engine: TRIBE v2 · Meta FAIR · CC-BY-NC · disclaimer →"`).

**Redistribution restrictions:** Sharing the **weights** would require
us to re-license under CC-BY-NC and keep attribution. We don't need to:
the model loads from the user's HF cache; we never re-host it.

**Public-facing applications:** No specific clause prohibits public
hosting. The license cares about *commercial* use, not visibility. A
free, ad-free portfolio site that visibly attributes the model is
inside the license.

### Recommendation

Brain Studio is non-commercial → license fits. We must:
1. Add a small attribution footer on the Mirror page.
2. Set `is_proxy: false` in the API response **only** when the response
   genuinely came from TRIBE v2 (per the brief — never lie).
3. Surface a disclaimer-of-warranties link.
4. Never sell, license, or paywall the prediction API.

---

## 10.0.3 — Input/output schema

### Input format

From the cached `config.yaml` (verified) and the
[TRIBE paper](https://arxiv.org/abs/2507.22229):

**Three modalities, all required as model inputs.** Missing modalities
are passed as zero tensors of the right shape (the paper trained with
"modality dropout" which gives the model partial robustness to this).

| Modality | Feature extractor | Feature dim | Frequency |
|---|---|---|---|
| Text | `meta-llama/Llama-3.2-3B` layers 0.5, 0.75, 1.0 → grouped | 6144 (2 × 3072) | 2.0 Hz |
| Audio | `facebook/w2v-bert-2.0` | 2048 (2 × 1024) | 2.0 Hz |
| Video | `facebook/vjepa2-vitg-fpc64-256` + `dinov2-large` | 2816 (2 × 1408) | 2.0 Hz |

**Text context window:** up to **1 024 words** preceding the
current segment (from `data.transforms.addcontext.max_context_len: 1024`
in the cached config). Encoding performance keeps improving with more
context, no plateau observed in the paper. Words are aligned to a 2.0 Hz
TR via per-word timestamps. Tokenization is whatever Llama's tokenizer
does.

**For text-only inference** (Brain Mirror room's only modality), we
pass:
- text features extracted from Llama → real (6144-dim)
- audio features → zeros (2048-dim)
- video features → zeros (2816-dim)

This is **off-distribution** relative to the paper. The model was
trained with modality dropout so it tolerates missing modalities, but
quality will be lower than the trimodal use case the paper validates.

### Output format

From the cached config (`brain_model_config.n_outputs`) and the
HuggingFace model card:

| Property | Value |
|---|---|
| Shape | `(n_timesteps, 20 484)` — fsaverage5 cortical surface vertices |
| Left hemisphere | indices `[0 : 10 242]` |
| Right hemisphere | indices `[10 242 : 20 484]` |
| Output frequency | 1.0 Hz (one fMRI TR per output step) |
| Hemodynamic lag | 5.0 s (output predictions are time-aligned to the BOLD response, 5 s lagged from the stimulus) |
| Value scale | Z-scored BOLD activation (mean ~0, std ~1 per vertex per session) |
| Subject | "Average" subject — predictions are a single representative subject embedding |

### Subtle but important: training target vs released output

The TRIBE *paper* trains on the **Schaefer 1 000-parcel atlas** —
parcellated voxel averages, not vertices. The 20 484-vertex
fsaverage5 output in the *released v2 checkpoint* comes from
projecting back to the surface. So:

> The model's prediction is fundamentally parcellated at the 1 000-parcel
> Schaefer resolution and then up-sampled to fsaverage5 vertices for
> display/integration. Two adjacent vertices in the same Schaefer
> parcel will have correlated predictions; treating each vertex as
> independent is a small fiction.

This actually *helps* our 20-region aggregation: as long as we mean
vertex predictions inside each named region, we're operating on signal
that was meaningful at the parcel scale to begin with.

### The 20-region atlas mapping — the academic blocker

The Brain Studio surfaces a hand-picked **20 named regions**
(`frontend/lib/regions.ts`):

```
ifg_left, ifg_right, pstg_left, pstg_right, mtg_left, mtg_right,
atl_left, atl_right, agl_left, agl_right, hg_left, hg_right,
vmpfc, dmpfc, pcc, precuneus, amyg_left, amyg_right, hipp_left, hipp_right
```

**Current state of the mapping** (in `backend/tribe/region_mapping.py`):
each region has a hand-picked `(start, end)` vertex range on fsaverage5.
The comment at the top of the file is honest:

> The ranges below were picked to roughly correspond to anatomical
> location along the medial-to-lateral and posterior-to-anterior axes
> that the FreeSurfer surface traverses. They are NOT clinically
> accurate; for that, swap in a real atlas (see module docstring).

**Why this matters:** A JIPP / cognitive-sciences reader will check that
"Broca's region (L)" is actually pulling vertices that belong to
Broca's region. The current approximate mapping cannot defensibly
claim that.

**The defensible path** — use `nilearn`'s built-in atlases on fsaverage5:

1. **Destrieux 2009 (a2009s, 148 parcels)** — strong neuroanatomical
   naming, includes "gyrus opercularis" (Broca), "gyrus temporalis
   superior", "hippocampus", etc. Per-region aggregation is a manual
   table mapping Destrieux parcel names → my 20 region IDs.

2. **Glasser 2016 (MMP, 360 parcels)** — finer-grained,
   functionally defined. More effort to aggregate (multiple parcels
   per region).

3. **Yeo 2011 (7 or 17 networks)** — too coarse; only useful for
   network-level talk (DMN, salience), not for region-level claims.

**Recommendation:** Destrieux 2009. It's the most defensible per-region
mapping and `nilearn.datasets.fetch_atlas_destrieux_2009()` ships it.
Each of my 20 regions gets a hand-curated list of Destrieux parcel
names. Aggregation = mean of vertex predictions in those parcels.

**Implementation effort:** ~half a day to build the mapping table,
~one hour to wire `nilearn` into `region_mapping.py`, ~one hour to
validate that "Broca's vertices light up for syntax-heavy text"
empirically.

🚧 **BLOCKER PER THE PHASE-10 BRIEF:** I cannot complete the principled
atlas mapping without human approval of the parcellation choice and a
review of the per-region Destrieux assignment. I will not guess it
silently. Tentative recommendation: **Destrieux 2009 + my hand-curated
assignment table, both checked into the repo and called out for
review**. Approve or correct that and I'll wire it in.

### Other caveats to surface honestly

- **Text-only is off-distribution.** Expected effect: blurrier
  predictions vs trimodal. Acceptable for Mirror room (the alternative
  is a lexical-feature predictor, which is fully unreal).
- **Average-subject only.** No per-user calibration. Same input from
  any user produces the same prediction.
- **Hemodynamic lag is built in.** The model predicts BOLD signal
  5 s in the past relative to the stimulus. For Mirror (instant
  textarea response), this lag is invisible to the user; the activation
  the brain shows is what *would* happen 5 s into reading the text.
  Worth a footnote in the UI but not a blocker.

---

## 10.0.4 — Hardware and inference cost

### Model footprint

| Component | Disk | RAM/VRAM (fp16 inference) |
|---|---|---|
| TRIBE v2 checkpoint (`best.ckpt`) | 677 MB | ~700 MB |
| Llama-3.2-3B (text encoder) | ~6 GB | ~6.5 GB |
| w2v-bert-2.0 (audio — only if multimodal) | ~2 GB | ~2 GB |
| V-JEPA2 (video — only if multimodal) | ~4 GB | ~4 GB |
| **Text-only minimum total** | **~6.7 GB** | **~7.5 GB VRAM** |
| Trimodal total | ~13 GB | ~13 GB VRAM |

### Latency — measured / estimated

| Scenario | Hardware | First-token latency | Subsequent |
|---|---|---|---|
| Llama-3.2-3B + TRIBE on a warm GPU (RTX 3080 Ti Laptop, 16 GB) | local, CUDA 12.6 | ~3 s | ~1.5 s |
| Same on Modal A10G (24 GB) | serverless GPU | ~2 s | ~1.2 s |
| CPU-only (16 vCPU, 32 GB RAM) | Fly.io / Vercel | ~35–60 s | same | **NOT VIABLE** for an interactive room |

The CPU path is not viable. Llama-3.2-3B is the bottleneck. We need a
GPU somewhere in the path.

### Three deployment targets at ~1 000 inferences/day

A portfolio site at ~1 000 inf/day = ~42 inf/hour = one inference every
1.4 minutes on average, with bursts.

| Option | Compute | Cold-start | Cost/month @ 1 k inf/day | Cost/month @ 50 inf/day (realistic portfolio) |
|---|---|---|---|---|
| **Modal (serverless GPU, scale-to-zero)** | A10G 24 GB, $1.10/hr per-second billed | ~30 s | ~$18 (4 % duty cycle, 1 000 × 1.5 s = 25 min/day) | ~$1 (5 % duty cycle, 75 s/day) |
| **Replicate (serverless)** | T4 16 GB or A10G | ~30 s | ~$15–20 | ~$1 |
| **Hetzner GPU dedicated (always-on)** | RTX 4000 16 GB, GEX44 line | none | ~€120 (~$130) flat | ~€120 (~$130) flat |
| **Lambda Labs always-on** | A10 24 GB, $1.10/hr × 720h | none | ~$792 (excessive) | $792 |
| **HuggingFace Inference Endpoints (scale-to-zero)** | A10G $1.30/hr per-second | ~60 s | ~$25 | ~$2 |
| **CPU-only (Vercel / Fly.io)** | 8 vCPU | none | **not viable** — 35 s/req kills the UX | same |

### Recommendation

For a portfolio site that gets sporadic visitors:

**Primary: Modal**

- $30/month free credits cover months of portfolio-tier traffic
- Scale-to-zero means $0 when nobody's there
- Python-native deploy (decorate the function)
- Cold-start ~30 s — frontend already falls back to the embedding
  baseline during the wake-up window via `lib/tribeClient.ts`'s
  null-on-error contract, so users never see a blank brain

**Honest second-place: Replicate**

- Same scale-to-zero economics
- Slightly more friction for Python deployment but a cleaner Web UI

**For "I want it always-on so cold starts never bite":**

- Hetzner Cloud GEX44 (RTX 4000 16 GB) at €120/month — works fine but
  is overkill for portfolio traffic.

**Cost ceiling I propose:** $25/month at typical portfolio load. If the
site goes viral, scale-up is automatic on Modal; we'd just need a
budget alert.

---

## What I want approved before writing any inference code

1. **Deployment target.** My recommendation: **Modal with scale-to-zero**.
   Confirm or pick a different option.

2. **Atlas-mapping plan.** My recommendation: **Destrieux 2009 +
   hand-curated 20-region assignment table** committed to repo and
   reviewed before going live. Confirm, or specify Glasser, or specify
   that the approximate vertex ranges are fine for now.

3. **Text-only off-distribution caveat.** Confirm you're comfortable
   shipping this. (My take: yes — the alternative is fakePredict, which
   is honest about being lexical-features-only; TRIBE-text-only is
   worse than trimodal TRIBE but better than fakePredict, and we'll
   surface the caveat in the attribution chip on Mirror.)

4. **Attribution copy.** Approve the proposed Mirror page footer:

   > _Predicted by **TRIBE v2** (Meta FAIR, d'Ascoli et al., 2026) —
   > [model card](https://huggingface.co/facebook/tribev2) ·
   > [paper](https://arxiv.org/abs/2507.22229) · CC-BY-NC-4.0 ·
   > text-only inference, average-subject_

5. **Budget ceiling.** Confirm or set: $25/month for Modal.

Once these five are approved, I write Phase 10.1 (backend architecture)
and proceed.

---

## Sources

- [TRIBE v2 model card · HuggingFace](https://huggingface.co/facebook/tribev2)
- [facebookresearch/tribev2 · GitHub](https://github.com/facebookresearch/tribev2)
- [TRIBE paper · arXiv 2507.22229](https://arxiv.org/abs/2507.22229)
- [Algonauts 2025 Winners insights · arXiv 2508.10784](https://arxiv.org/abs/2508.10784)
- [Meta FAIR · Introducing TRIBE v2 (blog)](https://ai.meta.com/blog/tribe-v2-brain-predictive-foundation-model/)
- [AI at Meta · TRIBE v2 announcement (X)](https://x.com/AIatMeta/status/2037153756346016207)
- [Local checkpoint config](file:///C:/Users/Frank/.cache/huggingface/hub/models--facebook--tribev2/snapshots/f894e783020944dcd96e5568550afe2aa9743f9f/config.yaml)
