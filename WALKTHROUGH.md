# The Brain Studio — walkthrough

Every public route, what's there, what's stubbed.

🔗 **Live:** https://thebrainstudio.org

## Routes

### `/` — Home

Five-shot scroll cinema. Built.

| Shot | Beat |
|------|------|
| 1 | Cold open. Hero italic editorial: *"There is a model that predicts what your brain will do."* Each word fades in 60 ms apart. Amber-lamp top glow (animated). |
| 2 | Brain glides left, scale 0.7, warm lighting. Right column pins for 3 screen-heights revealing the TRIBE explanation in three steps. |
| 3 | Brain re-centers. Three room doorways. Hover lerps brain to that room's signature pattern. Cool-cathedral subtle glow. |
| 4 | Brain shrinks to corner. Three parallax insight cards. |
| 5 | Brain re-centers large. *"Begin."* in display italic. Three room CTAs. |

### `/mirror` — Brain Mirror

Built. Interactive.

- Brain glides to upper-third on entry; textarea rises from below.
- Type or paste any text → 300 ms debounce sets live brain target → 900 ms debounce commits and reveals the top-3 regions.
- Each region card: anatomy (Caption brass), display name (Heading), science gloss (Body), poetic gloss (Body italic), activation percent (Mono `variant="value"`).
- Loading messages cycle every 900 ms: *"Reading." → "Resolving semantic structure." → "Mapping onto predicted activation."*
- Amber-lamp glow steps from `subtle` to `pronounced` when a prediction lands — the room warms with the user.
- Save Insight → 1080 × 1080 PNG with brain snapshot, your text, top region's poetic gloss, brass watermark.
- Pinned 3-step essay below input.
- Three curated examples (after Carson, after Borges, a Thai lullaby fragment). Hover previews the pattern; click loads back into the textarea.
- **Predictor**: local lexical-feature placeholder. Tries `/api/infer/text` first; falls back to local on 503.

### `/music` — NeuroMusic Lab

Built. Silent for now (audio licensing is Phase 11 polish).

- Three modes: **Library** / **Compare** / **Upload** (the latter is an honest stub).
- Tracks ship as 60-second activation timelines. Scrubber advances time via rAF; `sampleTimeline(t)` lerps between adjacent frames so the brain follows the music continuously.
- Library tracks: Sigur Rós · Ágætis byrjun, John Coltrane · Naima, a Thai lullaby fragment.
- Compare: side-by-side two players; the focused channel drives the persistent brain.
- Closing pinned sequence: three insight essays (default-mode / limbic / hippocampal), each step drives the brain to its track's mid-point.

### `/crosscultural` — Cross-Cultural Brain

Built.

- Pinned entry: *"This model was trained on English." → "What it cannot translate is the most honest finding." → "Begin."*
- Three Thai-English pairs (loneliness ↔ เหงา, mother ↔ แม่, beautiful ↔ สวย) render as side-by-side 2D brain maps. English: vivid palette. Thai: desaturated brass-only — the visual statement is "the model goes quiet here."
- Divergence score (L2 distance, scaled 0–100, large Mono).
- Top-5 diverging regions with anatomy and Δ%.
- Pinned field notes (one per pair) with `<Hand>` marginalia.
- Closing Jungian section + Phase 11 submission-form teaser.

### `/about` — About

Built. Long-form scroll essay.

1. Opening line in display italic.
2. Pinned three-step: what TRIBE is.
3. Three parallax paragraphs: what it doesn't do (training-distribution bias, hemodynamic lag, region labels as anatomy).
4. The single Jung paragraph.
5. Live citation list from `lib/citations.ts` with DOI links.
6. Credits — Meta AI, Anthropic, a Chulalongkorn student from the Faculty of Psychology.
7. Roadmap — Phases 10, 11, 12 with one-line scope.
8. Closing line + amber-lamp bottom glow (animated).

### Debug routes (not in nav)

- `/test-brain` — per-region activation sliders + lighting preset switcher.
- `/test-scroll` — five-scene scroll choreography demo.
- `/test-atmospherics` — preset / intensity / animate toggles for `<AtmosphericGlow>`.

### Error states

- `app/error.tsx` — *"The model lost its line for a moment."* + retry + home.
- `app/not-found.tsx` — *"Out of the training distribution / We didn't learn that page."* + 4 prefetch links.
- `app/loading.tsx` — brass pulse-bar + *"Resolving room"* caption while a server segment streams.

## Systems

### Typography
- `--font-editorial` (Fraunces shim for PP Editorial New) does all running text.
- `--font-mono` (JetBrains Mono) for numerical / technical only.
- `--font-hand` (Caveat) marginalia only — dev warning at 11+ instances/page.
- `--font-thai` (Noto Serif Thai) automatic glyph fallback inside editorial stack.
- Four sizes: `text-display` 72px / `text-heading` 32px / `text-body` 16px / `text-caption` 13px. No other sizes used.
- Six semantic components: `<Display>` / `<Heading>` / `<Body>` / `<Caption>` / `<Mono>` (value/label/code variants) / `<Hand>`.

### Atmospheric depth
- Body vertical wash (navy → indigo smoke), `background-attachment: fixed`.
- Film grain overlay (~1 KB inline SVG, 4 % opacity, 2 % under `motion-reduce`).
- `<AtmosphericGlow>` with three presets (amber-lamp / cool-cathedral / oxblood-ember), three intensities, optional animate. Exactly 6 placements across the site (home Shot 1 + Shot 3, mirror, music, crosscultural, about). Animated: 2 (home hero + about closing — at the cap).

### Persistent brain
- One R3F `<Canvas>` mounted at root layout, never unmounts.
- Zustand store (`useBrainStageStore`) holds transform, lighting preset, per-region activations.
- 20-node constellation with brass wireframe shell; nodes ramp idle→cyan→amber→oxblood per activation.
- Three lighting presets (cinematic / warm / clinical) crossfade over ~600 ms.
- ScrollScene wrapper writes targets when a section enters the viewport; the canvas lerps in `useFrame`.
- `preserveDrawingBuffer: true` enables the Mirror save-insight PNG.

### Accessibility
- Skip-to-content link (sr-only by default, brass on focus).
- `<RegionAnnouncer>` aria-live="polite" reads the top three active regions every 1.6 s.
- Brass focus-visible ring everywhere.
- All animations honor `prefers-reduced-motion` (Lenis off, ScrollTrigger pinning bypassed, ParallaxLayer speed=1, AtmosphericGlow drops one intensity step + ignores animate).
- `prefers-contrast: more` flattens the body wash to deep navy.
- WCAG AA contrast holds on every text/background combo I verified manually (the brightest glow point is ~10 % opacity over navy — bone-cream text reads cleanly).

## Stubbed / next sessions

| Item | Resolution path |
|-|-|
| PP Editorial New | License from Pangram Pangram, drop files under `public/fonts/pp-editorial-new/`, replace the Fraunces import in `app/fonts.ts` with a `localFont({...})` mapped to the same `--font-editorial` variable. |
| Z-Anatomy brain GLB | Download from their Sketchfab manually (requires their auth), drop at `public/models/brain.glb`, then build `components/brain/BrainAnatomy.tsx` that does `useGLTF` and overlays the 20 region markers. The constellation we have is a deliberate alternative — abstract, honest-about-itself; the GLB swap is a polish move. |
| Real TRIBE inference | Set `TRIBE_ENGINE=real` env var, install Meta's `tribe` / `neuralset` packages (currently private), plus Llama-3.2-3B locally. Backend already detects the checkpoint and surfaces all metadata. Frontend already falls back gracefully — once inference returns 200, MirrorInput uses real predictions automatically. |
| Music room audio | Drop licensed audio files at `public/audio/<id>.mp3`, set `track.src` in `lib/musicTracks.ts`. The scrubber will play them; the timeline already drives the brain in sync. |
| Cross-Cultural pair submission form | Phase 11 feature; backend route + UI. |
| Upload mode (Music) | Client-side feature extraction stub; Phase 11. |
| Mirror reveal `pronounced` glow opacity transition | Wired but CSS transition on the glow's opacity wrapper could be smoother; cosmetic polish. |

## Commit history

```
60-second timeline   feat: Phase 11 — error/404/skip link/RegionAnnouncer
                     feat: Phase 10 — TRIBE inference scaffold + fallback
                     feat: Phase 9 — About long-form essay
                     feat: Phase 8 — nav active state, mobile sheet, loading
                     feat: Phase 7 — Cross-Cultural Brain
                     feat: Phase 6 — NeuroMusic Lab
                     feat: Phase 5 — Brain Mirror room
                     feat: typography + atmospheric depth (3 layers)
                     docs: STUBS.md + live URL in README
                     feat: Phase 4 — home cinema, room cards, cursor, drone
                     feat: Phase 3 — scroll-as-camera system
                     feat: Phase 2 — 20-region constellation + 3 lighting
                     feat: Phase 1 — foundation scaffold
```

## How to run locally

```powershell
cd brain-studio\frontend
pnpm install
pnpm dev   # http://localhost:3000

cd ..\backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
./start.ps1   # http://127.0.0.1:8000/health
```

`pnpm build` from `frontend/` will pre-render all 11 routes statically.

## What still wants attention before "ship"

1. **PP Editorial New licensing** — the visual identity will shift slightly when the real font lands.
2. **Real TRIBE inference** — every preview is currently honestly labeled "simulated locally"; flipping that to real is the single biggest unlock.
3. **Lighthouse run** — I haven't run it; expect a clean 85+ but verify in your environment.
4. **Image OG / favicon** — neither shipped this session; pick assets that match the aesthetic.
5. **GitHub remote** — `<SiteHeader>` links to `https://github.com` as a placeholder. Update when the repo lands.
