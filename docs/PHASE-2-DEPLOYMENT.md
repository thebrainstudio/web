# Phase 2 deployment — wiring the real predictor

The frontend is already live with the brass-halo / breathing / lerp polish.
The backend code is written, tested locally, and pushed to GitHub. What
remains is connecting the GitHub repo to Render (free tier) so the
production frontend hits a real predictor instead of falling back to
`lib/fakePredictor.ts`.

## What's already done

| Item | Status |
|---|---|
| `backend/tribe/embedding_engine.py` (fastembed BGE-small) | ✅ written, tested locally |
| `backend/tribe/region_anchors.py` (20 region anchors) | ✅ written |
| `backend/app/main.py` (engine cascade + `/api/v1/predict` alias) | ✅ wired |
| `backend/render.yaml` (Render Blueprint) | ✅ written |
| `frontend/components/brain/BrassHalos.tsx` | ✅ deployed |
| Activation lerp tightened to ~1200 ms settle | ✅ deployed |
| Breathing idle (0.18 Hz) replaces EEG drift | ✅ deployed |
| `frontend/lib/tribeClient.ts` updated for new metadata shape | ✅ deployed |

## What you need to do (15 minutes)

### 1. Connect the repo to Render

1. Sign in at <https://render.com> (free account is enough).
2. Dashboard → **New** → **Blueprint**.
3. Connect the GitHub repo `dreamsmanifested6666-dotcom/brain-studio`.
4. Render detects `backend/render.yaml` and stages the
   `brain-studio-api` service automatically.
5. Click **Apply**.

The first deploy takes ~3 min (build) + ~1 min (cold-start). Once
deployed you'll get a URL like
`https://brain-studio-api.onrender.com`.

### 2. Verify the backend

```bash
curl https://brain-studio-api.onrender.com/health
# → expect "active_engine": "embedding_baseline_v1"

curl -X POST https://brain-studio-api.onrender.com/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"I am remembering my grandmother in her kitchen."}'
# → expect regions: { ... } with precuneus / hipp_left high
```

### 3. Wire the env var in Vercel

1. Vercel dashboard → `brain-studio` project → **Settings** → **Environment Variables**.
2. Add `NEXT_PUBLIC_TRIBE_API_BASE` = `https://brain-studio-api.onrender.com`.
3. Apply to: Production, Preview, Development.
4. Redeploy: `cd frontend && vercel --prod --yes` from this repo.

### 4. Verify end-to-end

Open <https://brain-studio-kappa.vercel.app/en/mirror>. Type something
substantive — e.g. *"I am remembering my grandmother in her kitchen, the
smell of bread"*. After the 900 ms settle, you should see brass halos
fade in on the **precuneus**, **left hippocampus**, and **right
hippocampus** anchors. Try music vocabulary and watch the halos shift
to the auditory regions.

## Free-tier caveats

Render's free tier sleeps after 15 min idle. First request after a
sleep wakes the dyno — ~30–60 s. During that wake-up window the
frontend's `tribeClient.ts` returns `null` after a fetch error and
Mirror falls back to `lib/fakePredictor.ts` (the lexical-feature
predictor). Subsequent requests are fast (~50–150 ms).

## Engine honesty

The response carries `engine: "embedding_baseline_v1"`. This is a real
semantic predictor — not TRIBE — and the frontend can surface that
distinction if you want a credit chip later. See `isRealEngine()` in
`frontend/lib/tribeClient.ts`. The shape is interchangeable with what
real TRIBE inference would return; swapping in real TRIBE later
requires no frontend changes.

## Next phases

- **Phase 3**: route transitions (240/360 ms fade), hover/focus rings, Cellular descent.
- **Phase 5**: telemetry + performance budget.
- **Phase 6**: deliverables docs (`/docs/director-handoff.md`, `/docs/awards-readiness.md`).
