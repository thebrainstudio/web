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
| 3 — Scroll-as-camera system | ✅ shipped |
| 4 — Home page cinema (5 shots) | ✅ shipped |
| ✦ — Typography system + atmospheric depth (3 layers) | ✅ shipped |
| 5 — Brain Mirror room (input → reveal → save PNG) | ✅ shipped |
| 6 — NeuroMusic Lab (Library / Compare / Upload + timeline scrubber + insight essays) | ✅ shipped |
| 7 — Cross-Cultural Brain (Thai/English pairs + dual brain maps + divergence) | ✅ shipped |
| 8 — Nav polish + mobile sheet + loading.tsx + transition hardening | ✅ shipped |
| 9 — About long-form scroll essay (citations + credits + roadmap) | ✅ shipped |
| 10 — TRIBE inference scaffold (loader + Colab script + graceful fallback) | ✅ shipped |
| 11 — error/404/skip-link/RegionAnnouncer accessibility pass | ✅ shipped |
| 12 — Final verification + WALKTHROUGH.md | ✅ shipped |

See [WALKTHROUGH.md](WALKTHROUGH.md) for what every route does and what
remains stubbed.
