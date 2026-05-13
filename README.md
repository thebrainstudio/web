# The Brain Studio

🔗 **Live preview:** https://brain-studio-kappa.vercel.app/

A cinematic educational website powered by Meta's TRIBE v2 brain encoder.
Three rooms: **Brain Mirror** (paste any text, see your brain "react"),
**NeuroMusic Lab** (hear how sound moves the mind), and
**Cross-Cultural Brain** (where the model breaks down across languages).

Debug routes (not in nav):
- `/test-brain` — per-region activation sliders + lighting preset switcher
- `/test-scroll` — five-scene scroll camera demo with pinned + parallax

## Repo layout

```
brain-studio/
├── frontend/      Next.js 16 App Router, R3F, Tailwind v4, Lenis + GSAP
├── backend/       FastAPI; serves precomputed JSONs (and, in Phase 10, runs TRIBE)
└── shared/
    └── predictions/   Drop precomputed TRIBE JSONs here (produced on Colab Pro)
```

## Quick start

```powershell
# Frontend
cd frontend
pnpm install
pnpm dev   # http://localhost:3000

# Backend
cd ..\backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
./start.ps1   # http://127.0.0.1:8000/health
```

## Phase tracker

| Phase | Status |
|-------|--------|
| 1 — Foundation (Next, Tailwind, fonts, Lenis+GSAP, persistent canvas, FastAPI shell, Vercel) | ✅ shipped |
| 2 — 3D brain (20-region constellation, 3 lighting presets, citations) | ✅ shipped |
| 3 — Scroll-as-camera system (ScrollScene, PinnedSequence, ParallaxLayer) | ✅ shipped |
| 4 — Home page cinema (5 shots) | ✅ shipped |
| 5 — Brain Mirror room | future |
| 6 — NeuroMusic Lab room | future |
| 7 — Cross-Cultural Brain room | future |
| 8 — Nav polish + page transitions hardening | future |
| 9 — About page (long-form scroll essay) | future |
| 10 — TRIBE inference wired (uses cached checkpoint) | future |
| 11 — Polish, perf, accessibility | future |
| 12 — Final verification + walkthrough doc | future |
