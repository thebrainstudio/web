/**
 * Frontend client for the brain prediction endpoint.
 *
 * Engine cascade on the backend (see `backend/app/main.py`):
 *   1. TRIBE v2 real           — when checkpoint + Meta packages + GPU.
 *   2. embedding_baseline_v1   — fastembed BGE-small over 20 curated
 *                                region anchor texts (the default
 *                                public deployment).
 *   3. 503                     — neither engine ready; this client
 *                                returns null so the caller can fall
 *                                back to lib/fakePredictor.ts.
 *
 * Two call modes:
 *   - `try` (default): POST /api/infer/text. On success, return the
 *      prediction. On 503 or any failure, return null.
 *   - `force`: POST and surface errors as exceptions (debug only).
 *
 * `NEXT_PUBLIC_TRIBE_API_BASE` overrides the API base. Defaults to
 * local dev port 8000. In production set it to the Render service URL
 * (e.g. https://brain-studio-api.onrender.com).
 */

import type { RegionId } from "./regions";

// Default: empty base → same-origin relative path. In production this
// resolves to brain-studio-kappa.vercel.app/api/v1/predict (a Vercel
// Python serverless function shipped alongside the frontend). Override
// with NEXT_PUBLIC_TRIBE_API_BASE to point at a dedicated backend
// (e.g. a Render or Fly.io service running the full embedding/TRIBE
// stack). Local dev: set it to http://127.0.0.1:8000 to talk to the
// local FastAPI server under backend/.
const BASE = process.env.NEXT_PUBLIC_TRIBE_API_BASE ?? "";

/**
 * Response envelope shared by every engine. `engine` distinguishes
 * which one served the prediction (the frontend may surface this as a
 * subtle label so users can see the difference between TRIBE and the
 * baseline). `metadata` is engine-specific and intentionally
 * structurally typed loosely.
 */
export type TribeApiPrediction = {
  engine: string;
  text_preview: string;
  regions: Partial<Record<RegionId, number>>;
  metadata: Record<string, unknown>;
};

/**
 * Whether a given engine name corresponds to a "real" (non-baseline)
 * prediction. The Mirror room may surface a subtle credit chip when
 * `engine === "real"` to honor the distinction.
 */
export function isRealEngine(engine: string | null | undefined): boolean {
  return engine === "real" || engine === "real_tribe_v2";
}

export async function inferText(
  text: string,
  opts?: { signal?: AbortSignal; force?: boolean; pathOverride?: string },
): Promise<TribeApiPrediction | null> {
  if (!text.trim()) return null;

  // /api/v1/predict matches the Vercel Python serverless function
  // under frontend/api/v1/predict.py. The same path is also served
  // by the standalone FastAPI backend (alias for /api/infer/text).
  const path = opts?.pathOverride ?? "/api/v1/predict";
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
      signal: opts?.signal,
    });
    if (res.ok) {
      return (await res.json()) as TribeApiPrediction;
    }
    if (opts?.force) {
      const body = await res.text();
      throw new Error(`Brain API ${res.status}: ${body}`);
    }
    return null;
  } catch (err) {
    if (opts?.force) throw err;
    return null;
  }
}
