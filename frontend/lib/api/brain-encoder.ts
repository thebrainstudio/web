/**
 * Brain-encoder API client.
 *
 * Phase 10 spec: single function `predictBrainActivation(text, locale)`
 * with AbortController cancellation, 8 s timeout, and silent fallback
 * on error. The frontend treats every failure as "fall back to the
 * local lexical-feature predictor" — never surface inference errors to
 * the user as an error state.
 *
 * Three-tier fallback (handled by the caller, not this client):
 *   1. Cloudflare-tunneled local TRIBE backend       — real TRIBE v2
 *   2. Vercel embedding-baseline (/api/v1/predict)   — semantic proxy
 *   3. lib/fakePredictor.ts (in-process)             — lexical features
 *
 * This client tries tier 1 first if NEXT_PUBLIC_TRIBE_API_BASE is set,
 * then tier 2. Tier 3 lives in MirrorInput where it always works.
 */

import type { RegionId } from "@/lib/regions";

const REQUEST_TIMEOUT_MS = 8000;
const REMOTE_BASE = process.env.NEXT_PUBLIC_TRIBE_API_BASE ?? "";

export type EncoderResult = {
  activations: Partial<Record<RegionId, number>>;
  /** Peakedness, [0, 1]. Not a probability. */
  confidence: number;
  /** e.g. "tribe-v2", "embedding_baseline_v1_hf". */
  model_version: string;
  /** True when the response was NOT a real TRIBE forward pass. */
  is_proxy: boolean;
  inference_latency_ms: number;
  /** True if served from the backend's cache. */
  cached?: boolean;
  /** Server response metadata, engine-specific. */
  engine_detail?: Record<string, unknown>;
  /** Server's first-200 chars echo for debugging. */
  text_preview?: string;
};

export type EncoderError =
  | { kind: "abort" }
  | { kind: "timeout" }
  | { kind: "network"; status?: number; message: string }
  | { kind: "rate_limited"; retry_after_seconds: number };

/**
 * Whether the engine identifier corresponds to a real (non-proxy) TRIBE
 * prediction. Used to gate the "real TRIBE" attribution chip vs the
 * "running on baseline" indicator.
 */
export function isRealTribe(modelVersion: string | null | undefined): boolean {
  if (!modelVersion) return false;
  return /^tribe(-|_)v\d/.test(modelVersion);
}

/**
 * POST {text, locale} → EncoderResult.
 *
 * - Cancellable via the passed-in AbortSignal OR our own 8 s timeout.
 * - Resolves to EncoderResult on 200.
 * - Resolves to null on any non-200 / network failure / timeout / abort.
 * - Never throws unless `opts.force === true`.
 *
 * Caller is expected to handle null by falling back to lib/fakePredictor.
 *
 * `baseOverride` lets the caller test tier-2 (Vercel embedding baseline)
 * after tier-1 (tunneled TRIBE) fails. Pass an empty string for
 * same-origin.
 */
export async function predictBrainActivation(
  text: string,
  locale: string,
  opts?: {
    signal?: AbortSignal;
    force?: boolean;
    baseOverride?: string;
    timeoutMs?: number;
  },
): Promise<EncoderResult | null> {
  if (!text.trim()) return null;

  const base = opts?.baseOverride ?? REMOTE_BASE;
  const timeoutMs = opts?.timeoutMs ?? REQUEST_TIMEOUT_MS;
  const path = "/api/v1/predict";

  // Compose an AbortController that fires on either caller abort or our
  // own timeout — whichever happens first.
  const localController = new AbortController();
  const timeoutId = setTimeout(() => localController.abort("timeout"), timeoutMs);
  const onCallerAbort = () => localController.abort("caller-abort");
  if (opts?.signal) {
    if (opts.signal.aborted) {
      clearTimeout(timeoutId);
      return null;
    }
    opts.signal.addEventListener("abort", onCallerAbort, { once: true });
  }

  try {
    const res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, locale }),
      signal: localController.signal,
    });
    if (res.ok) {
      const data = (await res.json()) as
        | EncoderResult
        | { regions: Partial<Record<RegionId, number>>; engine?: string };
      // Two shapes the backend may return:
      //   New (Phase 10): EncoderResult with `activations`.
      //   Old (Vercel serverless): { regions, engine, ... }.
      // Normalize.
      if ("activations" in data) {
        return data as EncoderResult;
      }
      const legacy = data as {
        regions: Partial<Record<RegionId, number>>;
        engine?: string;
        metadata?: { elapsed_ms?: number };
        text_preview?: string;
      };
      return {
        activations: legacy.regions,
        confidence: 0.5,
        model_version: legacy.engine ?? "unknown",
        is_proxy: true,
        inference_latency_ms: legacy.metadata?.elapsed_ms ?? 0,
        cached: false,
        text_preview: legacy.text_preview,
      };
    }
    if (opts?.force) {
      const body = await res.text();
      throw new Error(`brain-encoder ${res.status}: ${body}`);
    }
    return null;
  } catch (err) {
    if (opts?.force) throw err;
    return null;
  } finally {
    clearTimeout(timeoutId);
    if (opts?.signal) {
      opts.signal.removeEventListener("abort", onCallerAbort);
    }
  }
}

/**
 * Discovered tunnel URL — fetched from the auto-discovery endpoint
 * (/api/tunnel) at runtime. Cached for the lifetime of the page session
 * to avoid hitting the discovery endpoint on every prediction.
 */
let _discoveredTunnelUrl: string | null | undefined = undefined;
let _discoveryPromise: Promise<string | null> | null = null;

async function discoverTunnelUrl(): Promise<string | null> {
  if (_discoveredTunnelUrl !== undefined) return _discoveredTunnelUrl;
  if (_discoveryPromise) return _discoveryPromise;
  _discoveryPromise = (async () => {
    try {
      const res = await fetch("/api/tunnel", {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) {
        _discoveredTunnelUrl = null;
        return null;
      }
      const data = (await res.json()) as { url?: string; valid?: boolean };
      _discoveredTunnelUrl = data.valid && data.url ? data.url : null;
      return _discoveredTunnelUrl;
    } catch {
      _discoveredTunnelUrl = null;
      return null;
    }
  })();
  return _discoveryPromise;
}

/**
 * Three-tier predict: tunneled TRIBE first, then Vercel embedding
 * baseline, then null. Caller handles null by using fakePredict.
 *
 * The tunnel URL comes from one of three sources, in priority order:
 *   1. NEXT_PUBLIC_TRIBE_API_BASE env var (compile-time pin — useful
 *      when the user has a stable Cloudflare-named tunnel or a
 *      dedicated TRIBE host).
 *   2. /api/tunnel discovery endpoint (runtime — the local backend
 *      self-publishes its current trycloudflare.com URL there on
 *      startup, so the frontend doesn't need rebuilding when the
 *      tunnel URL changes after a laptop reboot).
 *   3. (skipped — fall through to Tier 2 same-origin baseline).
 */
export async function predictWithFallback(
  text: string,
  locale: string,
  opts?: { signal?: AbortSignal },
): Promise<EncoderResult | null> {
  // Tier 1: compile-pinned tunnel (NEXT_PUBLIC_TRIBE_API_BASE).
  if (REMOTE_BASE) {
    const remote = await predictBrainActivation(text, locale, {
      signal: opts?.signal,
      baseOverride: REMOTE_BASE,
    });
    if (remote) return remote;
  } else {
    // Tier 1.5: runtime-discovered tunnel.
    const discovered = await discoverTunnelUrl();
    if (discovered) {
      const remote = await predictBrainActivation(text, locale, {
        signal: opts?.signal,
        baseOverride: discovered,
      });
      if (remote) return remote;
    }
  }
  // Tier 2: Vercel embedding baseline (same-origin /api/v1/predict).
  const baseline = await predictBrainActivation(text, locale, {
    signal: opts?.signal,
    baseOverride: "",
  });
  return baseline;
}
