# Mirror demo recording — 90-second script

> 1080p screen capture, no audio. Cursor visible. Hard-refresh
> `brain-studio-kappa.vercel.app/en/mirror` before recording so the
> tunnel + Llama warm up.

## Timing — 90 seconds total

| Time | What | Why |
|---|---|---|
| **0:00–0:08** | Land on the hero. The brain visible behind the title. Read "Type something. Anything." aloud silently. | Establish the page's invitation. |
| **0:08–0:20** | Click into the textarea. Type slowly: *"I am remembering my grandmother in her kitchen, the smell of bread."* Watch the brain warm region by region as each phrase lands. Watch the atmosphere pulse softly with each keystroke. | **Move 1** — real-time activation. |
| **0:20–0:25** | Stop typing. Wait for the 400 ms settle. Brass halos fade in on the top-3 regions. The caption appears below the textarea. The disclaimer settles below the caption. | **Move 3** — what just happened caption + Move 1 settled lerp. |
| **0:25–0:32** | Scroll down to the 4-angle brain views. The same prediction rendered from anterior, right lateral, posterior, left lateral. Same colour ramp; the four panels read in lockstep. | **Auxiliary** — every angle of your prediction. |
| **0:32–0:46** | Hover the word *grandmother*. Brain swings toward memory + emotional regions. Hover *kitchen*. Brain swings toward concrete/imagery regions. Move down to the region pills and hover *Hippocampus L*. The words *grandmother* and *kitchen* underline with thin brass strokes. | **Move 2** — hover-coupled mirror, both directions. |
| **0:46–0:55** | Scroll back to the action row. Click **Pin this prediction**. The pinned card appears bottom-left with the brain thumbnail. | **Move 4** — pin. |
| **0:55–1:12** | Clear the textarea. Type a contrasting input: *"The melody I heard, the violins rising, the rhythm of the song."* Wait for settle. The pinned card's diff readout updates — `+` deltas on auditory regions, `−` deltas on memory regions. | **Move 4** — compare mode. |
| **1:12–1:25** | Click **Export · PNG 1080×1080**. PNG downloads. Open it in Preview/Photos — show the museum-card composition: text at top, fingerprint brain dots in the middle, caption + brass divider + brand line at the bottom. | **Move 5** — shareable fingerprint. |
| **1:25–1:30** | Cut back to the page. End on the disclaimer line: "Predicted activation. Not your brain. The model's best guess about how a brain like its training set would respond." | The honest ending. |

## What to call out in v/o (if you add narration later)

- The brain is rendered live with the user's text via **Meta FAIR's TRIBE
  v2** running on the user's RTX 3080 Ti, tunneled through Cloudflare.
- The attribution chip below the textarea is **CC-BY-NC-4.0 compliant**
  — creator + paper + model card + license URL.
- The page is **interactive in five layers**: live brain rendering,
  the brass halos for top-3 regions, the 4-angle anatomy views, the
  hover-coupled inspector, and the pin/compare/export affordances.

## Hardware setup

- Laptop with RTX 3080 Ti running `backend/scripts/start_with_tunnel.ps1`
  before the demo. The tunnel URL must be published via
  `publish_tunnel.py` so the production frontend can discover it
  through `/api/tunnel`.
- Verify `https://brain-studio-kappa.vercel.app/api/tunnel` returns
  `valid: true` before pressing record.

## Common gotchas

- If TRIBE is offline, the page silently falls back to the embedding
  baseline (Vercel `/api/v1/predict`). The attribution chip will show
  "Running on baseline" instead of "TRIBE engine online" — pause and
  restart the tunnel before recording.
- First request after a sleep is slow (~30 s for Llama warm). Pre-warm
  by hitting `/v1/predict` once before recording.
- Hard-refresh before each take so the brain centroids and vertex-
  region cache load fresh.
