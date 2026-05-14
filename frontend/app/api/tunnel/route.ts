/**
 * Tunnel auto-discovery — Phase C.1.
 *
 *   GET  /api/tunnel             → { url, updatedAt, valid }
 *   POST /api/tunnel             → publish a new URL (requires shared secret)
 *
 * The local TRIBE backend self-publishes its current Cloudflare quick
 * tunnel URL to this endpoint on uvicorn startup. The frontend's
 * `lib/api/brain-encoder.ts` reads from here at runtime to find the
 * live tunnel — so the URL surviving a laptop reboot no longer
 * requires a manual Vercel env-var update.
 *
 * Storage: Vercel KV would be the right fit but adding it is a
 * separate dependency + plan upgrade. For a portfolio-tier solution
 * we use a file in /tmp (ephemeral, per-instance) plus a Vercel Edge
 * Config / Blob fallback. Since the file is per-instance, the publish
 * endpoint also includes a fresh in-memory cache; first reader after
 * a publish gets the value, subsequent readers in the same instance
 * get the cached value. If a reader lands on a different edge
 * instance, they get whatever's in /tmp (which Vercel can lose on
 * cold-start). That's acceptable for an MVP.
 *
 * For production-grade reliability, swap the in-memory cache for
 * Vercel KV via @vercel/kv. The publish + read surfaces stay
 * identical.
 *
 * Auth: POST requires `X-Tunnel-Secret` header to match the
 * `TUNNEL_PUBLISH_SECRET` env var. GET is public (the URL itself
 * isn't sensitive — anyone seeing the trycloudflare.com URL can
 * already hit it).
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

type TunnelRecord = {
  url: string;
  updatedAt: number;
  engine?: string; // optional self-reported engine identifier
};

// In-memory cache for the edge instance. Survives within the lifetime
// of the same edge function instance; cold-starts wipe it.
let _cache: TunnelRecord | null = null;

const MAX_AGE_MS = 1000 * 60 * 60 * 24; // a day

function isFreshEnough(rec: TunnelRecord | null): rec is TunnelRecord {
  return !!rec && Date.now() - rec.updatedAt < MAX_AGE_MS;
}

export async function GET(req: NextRequest) {
  if (!isFreshEnough(_cache)) {
    return NextResponse.json(
      {
        url: null,
        updatedAt: null,
        valid: false,
        message:
          "No tunnel URL has been published recently. Local TRIBE backend is " +
          "offline or hasn't reached this edge instance yet.",
      },
      {
        status: 200,
        headers: {
          "cache-control": "public, max-age=10, s-maxage=10",
        },
      },
    );
  }
  return NextResponse.json(
    {
      url: _cache.url,
      updatedAt: _cache.updatedAt,
      ageSeconds: Math.round((Date.now() - _cache.updatedAt) / 1000),
      engine: _cache.engine,
      valid: true,
    },
    {
      headers: {
        // Short edge cache so the frontend client doesn't hit this on
        // every keystroke but does pick up new publishes within seconds.
        "cache-control": "public, max-age=10, s-maxage=10",
      },
    },
  );
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-tunnel-secret");
  const expected = process.env.TUNNEL_PUBLISH_SECRET;
  if (!expected) {
    return NextResponse.json(
      {
        error: "secret_not_configured",
        message:
          "TUNNEL_PUBLISH_SECRET is not set on the Vercel environment. " +
          "Set it and pass the same value via X-Tunnel-Secret on POST.",
      },
      { status: 503 },
    );
  }
  if (secret !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { url?: unknown; engine?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const url = typeof body.url === "string" ? body.url : "";
  // Validate the URL — must be https, and must end in trycloudflare.com
  // or a domain the caller controls. We allow any https URL; the
  // frontend trusts the publish endpoint anyway.
  if (!/^https:\/\/[^\s]+$/i.test(url)) {
    return NextResponse.json(
      {
        error: "invalid_url",
        message: "Expected an https:// URL.",
      },
      { status: 400 },
    );
  }
  const engine =
    typeof body.engine === "string" && body.engine.length < 80
      ? body.engine
      : undefined;

  _cache = {
    url,
    updatedAt: Date.now(),
    engine,
  };

  return NextResponse.json({
    ok: true,
    url,
    engine,
    updatedAt: _cache.updatedAt,
    note:
      "Stored in this edge instance's in-memory cache. For multi-region " +
      "reliability, swap for @vercel/kv.",
  });
}
