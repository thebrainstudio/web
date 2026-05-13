/**
 * Frontend client for the TRIBE inference endpoint.
 *
 * Two modes:
 *   - `try` (default): POST to /api/infer/text. On success, return the
 *      real prediction. On 503 or any failure, return null so the caller
 *      falls back to the local placeholder predictor.
 *   - `force`: POST and surface errors as exceptions (debug only).
 *
 * `NEXT_PUBLIC_TRIBE_API_BASE` overrides the API base if the FastAPI
 * backend is hosted elsewhere (e.g. on Render). Defaults to local dev.
 */

import type { RegionId } from "./regions";

const BASE =
  process.env.NEXT_PUBLIC_TRIBE_API_BASE ?? "http://127.0.0.1:8000";

export type TribeApiPrediction = {
  engine: string;
  text_preview: string;
  regions: Partial<Record<RegionId, number>>;
  metadata: {
    checkpoint_path: string;
    text_backbone: string;
    hidden_size: number;
    hemodynamic_offset_s: number;
  };
};

export async function inferText(
  text: string,
  opts?: { signal?: AbortSignal; force?: boolean },
): Promise<TribeApiPrediction | null> {
  if (!text.trim()) return null;

  try {
    const res = await fetch(`${BASE}/api/infer/text`, {
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
      throw new Error(`TRIBE API ${res.status}: ${body}`);
    }
    return null;
  } catch (err) {
    if (opts?.force) throw err;
    return null;
  }
}
