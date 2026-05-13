# Cellular View

Real NeuroMorpho.org neuron reconstructions + a procedural synapse with
neurotransmitter dynamics. Lives at `/cellular`.

## The scale problem (honest framing)

A synapse is roughly ten million times smaller than the whole brain.
There is no honest continuous zoom from cortex to synapse. The Cellular
View frames the descent as **deliberate scale travel**, not magnification:

> Each scale below is a different way of seeing — not a closer look at
> the same thing.

Copy reinforces this on the page itself. The macro brain you see on
every other page is TRIBE's cortical-surface prediction. The neurons
here are **not** TRIBE outputs; they're encyclopedic content rendered
in the same aesthetic.

## What ships

| File | Role |
|------|------|
| `backend/scripts/download_cellular_data.py` | Curated NeuroMorpho fetcher |
| `frontend/public/cellular/swc/*.swc` | 6 curated reconstructions (~290 KB total) |
| `frontend/public/cellular/swc/*.meta.json` | Per-cell metadata + citations |
| `frontend/public/cellular/manifest.json` | Index consumed by the page |
| `frontend/public/cellular/MANIFEST.md` | Human-readable manifest |
| `frontend/lib/swcParser.ts` | SWC text → typed graph |
| `frontend/components/cellular/NeuronGeometry.tsx` | LineSegments + soma spheres |
| `frontend/components/cellular/Synapse.tsx` | Procedural bouton + spine + particle NTs |
| `frontend/app/cellular/page.tsx` | The room itself |

## Data source

[NeuroMorpho.org](https://neuromorpho.org) — the canonical repository
for digital reconstructions of neuronal morphology. Each cell is
contributed by a specific lab and licensed individually (most under
CC BY). The manifest carries `reference_pmid` and `neuromorpho_page`
links so attribution is one click away.

### Currently shipped

| NMO ID | Cell | Species | Lab |
|--------|------|---------|-----|
| 227 | CA1 pyramidal (hippocampus) | rat | Amaral |
| 5515 | Layer 5 pyramidal (motor cortex) | rat | Bikson |
| 43 | Cortical pyramidal | monkey | Wearne_Hof |
| 15 | Cortical pyramidal | monkey | Wearne_Hof |
| 33 | Cortical pyramidal | monkey | Wearne_Hof |
| 149 | Cortical pyramidal | rat | Turner |

To add more: edit `CURATED` in `backend/scripts/download_cellular_data.py`
and re-run `python backend/scripts/download_cellular_data.py`.

## Rendering choices

- **LineSegments instead of TubeGeometry per segment.** A pyramidal cell
  has 1000–5000 SWC samples; 5000 individual TubeGeometries would melt
  the GPU. A single `THREE.BufferGeometry` with `position` + `color`
  attributes uploads in <1ms and renders flat. The Bloom pass on the
  canvas gives the thin lines a soft gloss that reads as "delicate
  neural arbor."
- **Soma as a bright yellow emissive sphere.** Visual anchor; matches
  the fMRI peak band on the macro brain so the color language stays
  consistent.
- **Color per SWC type.** brass = apical dendrite (the iconic trunk),
  bone = basal dendrites, cyan = axon, amber = glial process.

## Synapse — what's procedural and what's faithful

Faithful:
- Bouton + spine geometry roughly match the canonical EM-recovered shapes.
- Vesicle cluster sits on the bouton's cleft-facing surface (active zone).
- Each neurotransmitter has a distinct release pattern (burst vs trickle)
  and traversal time consistent with the literature (glutamate fast,
  dopamine slow volume transmission).

Illustrative:
- Particle paths are eased lerps with random jitter, not actual diffusion
  trajectories.
- Action-potential travel speed is slowed for legibility (real APs are
  1–2 ms; we run at 250–1000 ms depending on the speed control).
- We don't simulate receptor binding kinetics or post-synaptic potentials.

Copy makes this clear: *"Same mechanics, different transmitters, very
different downstream effects."*

## Deferred from spec (follow-up sessions)

- **Tissue view** with multiple neurons + glia woven through it.
- **Astrocyte / oligodendrocyte / microglia rendering.** Spec calls for
  these prominently; the dataset doesn't yet include glial reconstructions
  and the page only shows a single-neuron + single-synapse focus today.
- **Scale-travel choreography from rooms.** The "Descend into tissue ↓"
  button on Mirror / Music / Cross-Cultural is not wired yet.
- **Region pre-selection from the macro brain.** All neurons are listed
  manually for now.
- **Narrate toggle** (TTS over the synapse play-by-play).
- **Reduced-motion fallback** — currently the same animation plays at
  reduced motion. Should swap to a static ghost arc.
- **Mobile "simplified cellular mode."**

These are all listed in STUBS.md.

## Performance characteristics

- A single neuron renders at ~150 KB SWC and produces ~5000 line segments.
  60 fps on a 2020 laptop.
- The synapse view's particle pool is 160 (max), with bloom — runs 60 fps
  on the same machine.
- Two R3F canvases are mounted on the cellular page (neuron + synapse).
  This is one of the few places in the site that mounts more than one
  canvas; performance is acceptable because each is a small viewport.

## How to add a new neuron

1. Find the NMO ID at https://neuromorpho.org (use the search; the page
   URL shows the id).
2. Append to `CURATED` in `backend/scripts/download_cellular_data.py`:

```py
Curated(
    nmo_id=12345,
    region_key="pcc",   # one of our 20 region ids
    role="Description that becomes the manifest entry.",
    surprising="One Jungian-style line for the UI gloss.",
),
```

3. Re-run `python backend/scripts/download_cellular_data.py`.
4. The new cell appears in the chooser at `/cellular` and in `manifest.json`.
