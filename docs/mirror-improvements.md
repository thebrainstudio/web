# Mirror improvements — what shipped

> Branch `mirror-improvements`. Production:
> [brain-studio-kappa.vercel.app/en/mirror](https://brain-studio-kappa.vercel.app/en/mirror).
> All five Moves from the design-critic brief plus an auxiliary
> 4-angle brain view, infra hardening, and analytics. Backend TRIBE v2
> via Cloudflare quick tunnel pointed at the user's local RTX 3080 Ti.

## Move 1 — real-time activation while typing

Files touched:
- `frontend/lib/mirror/impressionistic.ts` *(new)* — lexicon-driven
  per-keystroke predictor. 7 small lexicons (emotion, concrete,
  abstract, music, social, self, function). Produces per-word
  contributions consumed by Move 2 and the caption generator.
- `frontend/components/atmospheric/PersistentAtmosphere.tsx` — listens
  for `brain-studio:keystroke-pulse` events and emits a brief opacity
  pulse (idle → idle+0.04 over 180 ms, decay 440 ms,
  cubic-bezier(0.16, 1, 0.3, 1)). Coalesces fast typing.
- `frontend/components/mirror/MirrorInput.tsx` — 60 ms impressionistic
  loop on every keystroke. 400 ms settled debounce fires the
  TRIBE/baseline request. Per-keystroke AbortController.
  `prefers-reduced-motion` suppresses the impressionistic loop +
  atmosphere pulse.
- `frontend/lib/animations.ts` — added `easeImportant` constant
  (cubic-bezier(0.22, 1, 0.36, 1)) for Move 3+ "most important moments".

Visible change: the persistent brain now shifts as the user types,
not only after they pause. Impressionistic activations render at 55 %
brightness; settled predictions render at full brightness. Atmosphere
pulses softly with each keystroke.

Tested: typing one letter, a sentence, deleting, pasting a paragraph.
Each path produces the expected visible behaviour. Reduced-motion
mode confirmed via macOS Accessibility settings.

## Move 2 — hover-coupled mirror

Files touched:
- `frontend/components/mirror/MirrorInspector.tsx` *(new)* — both
  directions of hover. Word → brain swings toward that word's top-3
  contribution regions. Region pill → words that contributed to it
  underline (1 px brass, /60 opacity, 220 ms animation).
- `frontend/app/[locale]/mirror/page.tsx` — mounts the inspector
  below the brain views once a settled prediction exists.

Tested: hover each word in a sentence and watch the brain follow.
Hover region pills and watch the matching words underline. Region
label caption appears above the pill row with anatomy + hemisphere +
science gloss (the locked-in format).

## Move 3 — "what just happened" caption

Files touched:
- `frontend/lib/mirror/caption-generator.ts` *(new)* — pure function.
  Top-3 regions named in a "X meeting Y meeting Z" functional summary.
  Optionally compares to one of three `savedExamples` when
  cosine-sim ≥ 0.92.
- `frontend/components/mirror/MirrorCaption.tsx` *(new)* — Fraunces
  /70 body with 800 ms fade + 12 px upward translate on
  `easeImportant`. Disclaimer line below in Caption uppercase
  tracking-wide at /55.
- `messages/{en,es,ca,th,ja,zh-CN}.json` — `mirror.disclaimer` added
  across all 6 locales.

Caption body itself ships English-only. Translator follow-up needed
for the function phrases per region; see
[mirror-i18n-new-keys.md](./mirror-i18n-new-keys.md).

Tested: settled prediction lands, caption appears 600 ms later with
the upward translate. Typing more text fades the old caption and
fades in the new one. Below the signal threshold (text < 3 words),
the caption hides entirely.

## Move 4 — Pin + Compare

Files touched:
- `frontend/components/mirror/PinnedPredictionCard.tsx` *(new)* —
  fixed bottom-left card with thumbnail brain, top-3 readout, and
  the diff readout when in compare mode.
- `frontend/components/mirror/MiniBrainPreview.tsx` *(new)* —
  single-view static brain thumbnail. Same fsaverage5 mesh + colour
  ramp as the main brain.
- `frontend/app/[locale]/mirror/page.tsx` — Pin button in the action
  row + compare-mode state.

Tested: pin a prediction, type more, watch the diff readout. Clear
the pin. Verified the pin is session-scoped (clears on page reload).

## Move 5 — Shareable PNG fingerprint (1080 × 1080)

Files touched:
- `frontend/lib/mirror/fingerprint-image.tsx` *(new)* — composition
  via Next.js `ImageResponse`. Top third: user's text in Fraunces
  italic (Georgia fallback). Middle third: schematic top-down brain
  with 20 colored dots at stylized positions, dot size scales with
  activation. Bottom third: top-3 readout + caption + brass divider
  + brand line.
- `frontend/lib/mirror/region-positions.ts` *(new)* — minimal region
  data (IDs + positions + short names + hemisphere helper). Created
  to keep the Edge function under Vercel's 1 MB Hobby-plan limit
  (the full `lib/regions.ts` plus `lib/seo.ts` blew past 1 MB).
- `frontend/app/api/mirror/fingerprint/route.ts` *(new)* — Edge
  runtime handler. Accepts POST `{text, activations, caption,
  locale}` or GET `?text=…&a=base64url(json)&c=…&l=…`. Returns
  PNG. Sanitizes inputs.
- `frontend/components/mirror/ExportPngButton.tsx` *(new)* — UI
  trigger. Re-runs the caption generator to embed the on-screen
  caption in the PNG. Downloads as
  `brain-mirror-YYYY-MM-DD-<6-char-sha256>.png` — identical inputs
  produce identical filenames.

Tested: POST to `/api/mirror/fingerprint` returns 78 KB PNG (1080×1080
RGBA 8-bit). Button on `/en/mirror` triggers download with correct
filename.

The "OG-image-as-URL" idea (Move 5.6) is wired via the GET variant —
share the URL itself and Twitter/LinkedIn/Discord can unfurl the
PNG inline.

## Auxiliary fixes done in this branch

- **Brain hero position** `Y = 0.9 → 0.42` so the brain is visible in
  the hero (was clipped above the viewport).
- **Brass halos use real mesh centroids** computed from the
  fsaverage5 GLB via `lib/brain/regionCentroids.ts`, not the stylized
  atlas-nav coordinates (which floated off the rendered mesh).
- **Halo color** brass `#c9a961` → cyan-glow `#5cc8d6` (existing palette
  token) for contrast with the warm activation ramp.
- **4-angle brain views** — `BrainViews.tsx` with four mini canvases
  (anterior / right / posterior / left lateral) below the main brain.
  Same colour ramp, same activations, fixed cameras, no bloom.
- **ScrollScene overwrite fix** — was hard-setting brain activations
  to `signaturePatterns.mirror` on essay-section scroll-in, so no
  matter what the user typed the brain reverted to the same demo
  pattern. Now the demo pattern only fires before the user has any
  real prediction.
- **Destrieux atlas mapping wired** — `tribe/predict.py` was still
  importing the OLD approximate vertex-range mapping. Switched to
  the new `region_mapping_destrieux.py` + added a 3.5× sharpening
  factor before the sigmoid so predictions now span the full
  `[0.00, 1.00]` dynamic range instead of compressing to `[0.45,
  0.58]`.
- **Essay scroll feel** — `PinnedSequence.stepDuration` defaults
  `1.0 → 0.7`, and the Mirror essay section dropped the pinned
  sequence entirely in favour of a stacked layout. Section height
  drops from ~300 vh to ~150 vh; "stuck-scroll" complaint resolved.

## Phase C — infra hardening

- **Tunnel auto-discovery** (`/api/tunnel`). Backend self-publishes
  its current tunnel URL on startup via the new
  `backend/scripts/publish_tunnel.py`. Frontend reads from the
  discovery endpoint at runtime. No more re-setting
  `NEXT_PUBLIC_TRIBE_API_BASE` after laptop reboots.
- **Llama + TRIBE preload** at uvicorn startup. First-request
  latency drops from ~60 s to ~300 ms. Controlled by
  `TRIBE_PRELOAD` env (default on).

## Phase D — site polish

- Home → Mirror callout at the bottom of Shot 1: "Or skip ahead —
  type into the Mirror →" in caption typography at /55 opacity.
- Vercel Analytics + Speed Insights mounted in the root layout. No
  cookies, no PII. Page views + Core Web Vitals.
- OG image verification: all 7 room routes (mirror / music /
  crosscultural / threshold / archetypes / cellular / about) return
  `200 image/png` for their `opengraph-image` endpoint.

## Known follow-ups

See [mirror-known-issues.md](./mirror-known-issues.md) for the
honest punch list of what's *not* polished yet — text-only TRIBE
auditory bias, CPU fallback, sister-rooms attribution, search
palette i18n, Cellular View choreography, embedding anchor tuning.
