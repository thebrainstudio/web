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
| PP Editorial New | **Substituted with Fraunces** under the `--font-editorial` CSS variable. PP Editorial New is proprietary (Pangram Pangram); their site gates downloads behind a form I can't submit programmatically. To swap: license the files, drop them under `public/fonts/pp-editorial-new/`, replace the Fraunces import in `app/fonts.ts` with a `localFont({...})` pointing at `variable: "--font-editorial"`. See `docs/typography.md`. |
| Z-Anatomy brain mesh | **Not integrated.** Tried 5 candidate GitHub URLs — all 404. Z-Anatomy keeps `.blend` files only; their Sketchfab models require API auth I don't have. To add: download `Brain.glb` from their Sketchfab manually, drop at `public/models/brain.glb`, then build a `BrainAnatomy.tsx` that does `useGLTF` and overlays the 20 region markers from `lib/regions.ts` at anatomically correct positions (will need a position re-map). |
| `<Hand>` 10-instance cap | Wired with dev console warning. Resets on `popstate`. Production silent. |
| Animated `<AtmosphericGlow>` 2-instance cap | Wired with dev console warning. Currently exactly 2 placements (home hero, about closing). |
| `app/test-brain` + `app/test-scroll` typography migration | Still raw HTML headings; debug-only routes, lowest priority. |
| Mirror "reveal" intensity switch | The mirror stub uses `intensity="subtle"`. Phase 5 implementation should toggle to `intensity="pronounced"` (with a CSS-transitioned opacity wrapper) when a prediction returns. |

## Open content questions for the user

1. **GitHub repo URL** — once pushed, swap the `https://github.com` href in `SiteHeader.tsx` for the real URL.
2. **Ambient drone** — keep the generated one, or replace with a designed audio asset?
3. **Brain mesh** — does the abstract node constellation read as cinematic for you, or do you want a real anatomical mesh in Phase 11?
4. **Cross-Cultural pair list** — what Thai-English stimulus pairs should we seed when Phase 7 starts?
5. **TRIBE region count** — TRIBE outputs predictions across many more than 20 voxel groups. We chose 20 well-studied named regions; in Phase 10, when you Colab-generate JSONs, you'll need to map TRIBE's parcellation to our 20. Heads up.
