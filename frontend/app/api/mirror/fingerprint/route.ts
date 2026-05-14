/**
 * Move 5 — PNG fingerprint export route.
 *
 *   POST /api/mirror/fingerprint
 *   body: { text, activations, caption, locale }
 *   returns: image/png 1080×1080
 *
 *   GET /api/mirror/fingerprint?text=...&a=base64url(activations json)&c=caption&l=locale
 *   returns: image/png 1080×1080 (so the URL itself can be shared as
 *   an OG image; see Move 5.6 in the brief).
 *
 * Composition: see lib/mirror/fingerprint-image.tsx.
 *
 * The GET variant URL-encodes the activations as base64-url'd JSON so
 * the route can be shared as a stable OG image. Modern browsers/X/
 * LinkedIn fetch this URL and unfurl the PNG inline.
 */

import { NextRequest, NextResponse } from "next/server";
import { renderFingerprintImage } from "@/lib/mirror/fingerprint-image";
import { REGION_IDS } from "@/lib/mirror/region-positions";
import type { RegionId } from "@/lib/regions";

export const runtime = "edge";

type Activations = Partial<Record<RegionId, number>>;

const VALID_REGION_IDS = new Set<string>(REGION_IDS);

export type BrainImage = {
  labelKey: "anterior" | "rightLateral" | "posterior" | "leftLateral";
  dataUrl: string;
};

const VALID_LABEL_KEYS = new Set([
  "anterior",
  "rightLateral",
  "posterior",
  "leftLateral",
]);

function sanitizeBrainImages(input: unknown): BrainImage[] {
  if (!Array.isArray(input)) return [];
  const out: BrainImage[] = [];
  for (const item of input.slice(0, 4)) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const labelKey = obj.labelKey;
    const dataUrl = obj.dataUrl;
    if (
      typeof labelKey === "string" &&
      VALID_LABEL_KEYS.has(labelKey) &&
      typeof dataUrl === "string" &&
      dataUrl.startsWith("data:image/png;base64,") &&
      dataUrl.length < 2_000_000 // 2 MB cap per image; sanity bound
    ) {
      out.push({ labelKey: labelKey as BrainImage["labelKey"], dataUrl });
    }
  }
  return out;
}

function sanitizeActivations(input: unknown): Activations {
  if (!input || typeof input !== "object") return {};
  const out: Activations = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (!VALID_REGION_IDS.has(k)) continue;
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isFinite(n)) {
      out[k as RegionId] = Math.max(0, Math.min(1, n));
    }
  }
  return out;
}

function clampString(s: unknown, max: number): string {
  if (typeof s !== "string") return "";
  return s.length > max ? s.slice(0, max) : s;
}

function decodeBase64Url(b64url: string): string {
  // Convert base64url → base64
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  // Pad
  const pad = b64.length % 4;
  const padded = pad ? b64 + "=".repeat(4 - pad) : b64;
  return atob(padded);
}

async function readPayload(req: NextRequest): Promise<{
  text: string;
  activations: Activations;
  caption: string;
  locale: string;
  brainImages: BrainImage[];
}> {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      return {
        text: clampString(body.text, 5000),
        activations: sanitizeActivations(body.activations),
        caption: clampString(body.caption, 600),
        locale: clampString(body.locale, 10) || "en",
        brainImages: sanitizeBrainImages(body.brainImages),
      };
    } catch {
      return {
        text: "",
        activations: {},
        caption: "",
        locale: "en",
        brainImages: [],
      };
    }
  }
  // GET — no brainImages support on the GET variant (URLs aren't a
  // sensible place for ~MB of data URL payload). GET callers see the
  // schematic fallback in fingerprint-image.tsx.
  const url = new URL(req.url);
  const text = clampString(url.searchParams.get("text") ?? "", 5000);
  const caption = clampString(url.searchParams.get("c") ?? "", 600);
  const locale = clampString(url.searchParams.get("l") ?? "en", 10);
  let activations: Activations = {};
  const aParam = url.searchParams.get("a");
  if (aParam) {
    try {
      activations = sanitizeActivations(JSON.parse(decodeBase64Url(aParam)));
    } catch {
      activations = {};
    }
  }
  return { text, activations, caption, locale, brainImages: [] };
}

async function handler(req: NextRequest) {
  const payload = await readPayload(req);
  if (!payload.text && Object.keys(payload.activations).length === 0) {
    return NextResponse.json(
      {
        error: "missing_payload",
        message: "Provide `text` + `activations`.",
      },
      { status: 400 },
    );
  }
  return renderFingerprintImage(payload);
}

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
