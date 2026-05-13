# Brain Studio — Backend

FastAPI service that serves precomputed TRIBE predictions during Phases 1–9
and (Phase 10) will host real-time TRIBE v2 inference.

## Local dev

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
./start.ps1
```

Health check: http://127.0.0.1:8000/health

## Endpoints

| Method | Path | Phase |
|--------|------|-------|
| GET | `/health` | 1 |
| GET | `/api/predictions` | 1 — lists precomputed stimulus ids |
| GET | `/api/predictions/{stimulus_id}` | 1 — fetches one precomputed JSON |
| POST | `/api/infer/text` | 10 — currently returns 503 |

## TRIBE v2 weights

Cached locally at
`C:\Users\Frank\.cache\huggingface\hub\models--facebook--tribev2\snapshots\f894e783020944dcd96e5568550afe2aa9743f9f\`.
Phase 10 will wire a loader that reads `best.ckpt` + `config.yaml` and runs
inference on GPU (RTX 3080 Ti, 16 GB) when available, CPU otherwise.

## Precomputed predictions

User produces these on Colab Pro and drops the JSONs into
`../shared/predictions/`. Filename = stimulus id (e.g.
`mirror_example_01.json`).
