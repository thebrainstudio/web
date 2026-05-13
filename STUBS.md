# Stubs & TODO_CONTENT markers

What this session left as placeholders. Phases 5–12 will replace these.

## Content stubs

| Where | What's stubbed | Resolution phase |
|-|-|-|
| `frontend/components/audio/AmbientDrone.tsx` | Web Audio API generated 3-oscillator drone replaces a real ambient drone asset. Sounds OK but you may prefer a designed loop. Place an MP3 at `frontend/public/audio/ambient-drone.mp3` and rewrite to `<audio loop>` + master gain. | 11 (Polish) |
| `frontend/components/brain/BrainConstellation.tsx` | Abstract 20-node constellation (no anatomical GLB). The "shell" is a low-poly icosahedron with a faint brass wireframe. Replace with a real brain mesh whenever you have a permissive-license one. The 20 region ids map to `lib/regions.ts`. | 11 (Polish) |
| `frontend/lib/citations.ts` | 10 well-known references seeded. Verify each DOI; replace anything outdated; add more for room-specific essays. | 9 (About) |
| `frontend/app/about/page.tsx` | One-screen stub. Will become a long-form scroll essay. | 9 |
| `frontend/app/mirror/page.tsx` | One-screen stub. Will become the Brain Mirror interactive room. | 5 |
| `frontend/app/music/page.tsx` | One-screen stub. Will become the NeuroMusic Lab. | 6 |
| `frontend/app/crosscultural/page.tsx` | One-screen stub. Will become the Cross-Cultural Brain. | 7 |
| `frontend/components/nav/SiteHeader.tsx` | GitHub link points to `https://github.com` (placeholder). Replace with the actual repo URL when the user pushes. | next commit |

## Engineering stubs

| Where | What | Resolution |
|-|-|-|
| `backend/app/main.py` | `POST /api/infer/text` returns 503. Real TRIBE inference is Phase 10. The cached checkpoint lives at `C:\Users\Frank\.cache\huggingface\hub\models--facebook--tribev2\snapshots\f894e783020944dcd96e5568550afe2aa9743f9f\best.ckpt`. | 10 |
| `shared/predictions/` | Empty. User produces JSONs on Colab Pro and drops them here. Schema in `shared/predictions/README.md`. | as content lands |
| Frontend → backend wiring | Frontend doesn't call `/api/predictions/*` yet. Will wire in Phase 5 (Brain Mirror) via TanStack Query. | 5 |
| Particle materialization (Shot 1) | The brief mentioned a custom shader that scatters→assembles brain vertices on first paint. This session used a simpler fade-in. Add a vertex shader pass in `BrainConstellation` when you want the dramatic intro. | 11 |
| Hemodynamic lag callout | Spec says: "TRIBE outputs are offset 5 seconds in the past — communicate this." The site doesn't yet show this in any room. Add when temporal animations land (Music room's scrubber). | 6 |

## Production verifications still TODO

| Check | Status |
|-|-|
| Lighthouse Performance ≥ 85 (mobile + desktop) | not run; production build is clean and static prerender works for all pages |
| WCAG AA contrast on every text/background combo | informally OK (palette is high-contrast on navy); not audited |
| Reduced-motion across every animation | wired (Lenis off, ScrollTrigger pinning skipped, ParallaxLayer speed=1); not stress-tested |
| Screen-reader region announcer on the brain | `aria-live` polite region not yet added; planned in Phase 5 (when activations carry meaning) |
| GitHub repo URL in nav | placeholder until repo is pushed |

## Typography + atmospherics (second session additions)

| Item | Status / Notes |
|-|-|
| PP Editorial New | **Substituted with Fraunces, tuned closer.** Fraunces is now configured with opsz + SOFT axes + `style: ["normal","italic"]` to read closer to PP Editorial New's editorial character. To swap to the real licensed PP Editorial New: see [`app/fonts.local.example.ts`](frontend/app/fonts.local.example.ts) — rename to `fonts.ts` after placing files under `public/fonts/pp-editorial-new/`. The CSS variable name `--font-editorial` is identical, so no component code changes. |
| Z-Anatomy brain mesh | **Upgraded to procedural anatomical form.** Z-Anatomy's published artifacts are `.blend` only (Sketchfab download requires their API auth). Replaced the bare icosahedron shell with a two-hemisphere procedural mesh that has: midline longitudinal fissure (each hemisphere shifted ±0.18 off-center), multi-octave sulci displacement via 3D value noise, frontal-lobe protrusion, inferior taper, plus a cerebellum bulb at the inferior-posterior position. Brass wireframe accent layer for surface fold cues. The 20 region nodes still drive activation. To swap for a real anatomical GLB: drop the file at `public/models/brain.glb`, build `BrainAnatomy.tsx` that does `useGLTF`, re-map region positions. |
| Real TRIBE inference | **Wired end-to-end.** `backend/tribe/model.py` is an architecture-faithful re-implementation of TRIBE v2's `FmriEncoder` (177M parameters) reverse-engineered from the checkpoint state_dict + config. It loads cleanly (`strict=False` succeeds with zero key drift). Forward pass on random text features produces shape `(1, 1, 20484)` — the actual fsaverage5 vertex predictions. `text_features.py` does the Llama-3.2-3B layer extraction; `region_mapping.py` projects 20484 vertices to the 20 named regions (approximate vertex-range mapping — proper Destrieux atlas is the next polish step). `predict.py` glues it all together. To enable: `pip install torch transformers`, `huggingface-cli login` + accept Llama-3.2 license, `TRIBE_ENGINE=real`. Frontend's `lib/tribeClient.ts` already tries the real endpoint and falls back to the local predictor on 503. |
| GitHub URL | Wired to `https://github.com/frankcaules`. Change in `components/nav/SiteHeader.tsx` if needed. |
| Favicon + OG image | `app/icon.tsx` generates a 64×64 brass italic `B` on navy. `app/opengraph-image.tsx` generates a 1200×630 brass editorial wordmark with a constellation hint. Both via `next/og` at build time. |
| Lighthouse | `scripts/lighthouse.sh <url>` runs against any URL, writes `lighthouse.html`. Not auto-run; suggested to do locally. |
| `<Hand>` 10-instance cap | Wired with dev console warning. Resets on `popstate`. Production silent. |
| Animated `<AtmosphericGlow>` 2-instance cap | Wired with dev console warning. Currently exactly 2 placements (home hero, about closing). |
| `app/test-brain` + `app/test-scroll` typography migration | Still raw HTML headings; debug-only routes, lowest priority. |
| Music room audio | Saved for later per the user's direction. Drop licensed audio files at `public/audio/<id>.mp3`, set `track.src` in `lib/musicTracks.ts`. |

## Open content questions for the user

1. **GitHub repo URL** — once pushed, swap the `https://github.com` href in `SiteHeader.tsx` for the real URL.
2. **Ambient drone** — keep the generated one, or replace with a designed audio asset?
3. **Brain mesh** — does the abstract node constellation read as cinematic for you, or do you want a real anatomical mesh in Phase 11?
4. **Cross-Cultural pair list** — what Thai-English stimulus pairs should we seed when Phase 7 starts?
5. **TRIBE region count** — TRIBE outputs predictions across many more than 20 voxel groups. We chose 20 well-studied named regions; in Phase 10, when you Colab-generate JSONs, you'll need to map TRIBE's parcellation to our 20. Heads up.
