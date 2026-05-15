/**
 * Move 5 — Shareable PNG fingerprint composition.
 *
 * Server-side ImageResponse rendering for the Mirror room's "export
 * 1080×1080" affordance. Uses Next.js's built-in @vercel/og under
 * the hood; renders inside Satori (SVG-based) so the brain has to be
 * SVG, not WebGL.
 *
 * Composition (museum wall card more than social-media share):
 *   Top third      eyebrow + user's text in Fraunces italic, truncated
 *                  with a brass fade-out gradient if > 400 chars.
 *   Middle third   schematic top-down brain silhouette with the 20
 *                  regions as colored dots at their stylized
 *                  positions (lib/regions.ts). Same activation
 *                  colour ramp as the live brain — five stops from
 *                  IDLE through HOT.
 *   Bottom third   caption + thin brass divider + brand line in
 *                  Mono uppercase tracking-wide + URL.
 *
 * Fonts: ImageResponse defaults are limited to system serifs; we use
 * "Georgia, serif" (Fraunces fallback) for body and a generic mono
 * for the brand line. The PNG embeds these so it renders consistently
 * wherever it's shared.
 */

import { ImageResponse } from "next/og";
import type { RegionId } from "@/lib/regions";
import { SITE_URL } from "@/lib/urls";
import {
  REGION_IDS,
  REGION_POSITIONS,
  REGION_SHORT_NAMES,
  hemisphereInitial,
} from "@/lib/mirror/region-positions";

// Inline the PALETTE rather than importing from @/lib/seo, which
// drags `next-intl/locales` into the edge bundle and pushes us back
// over the 1 MB Edge Function limit on the Hobby plan.
const PALETTE = {
  navyDeep: "#0a1428",
  navyMid: "#0d162e",
  navyEnd: "#11192e",
  boneCream: "#f0e8d8",
  brass: "#c9a961",
  brassMuted: "rgba(201, 169, 97, 0.18)",
} as const;

export const FINGERPRINT_SIZE = { width: 1080, height: 1080 } as const;
export const FINGERPRINT_CONTENT_TYPE = "image/png";

// ── Activation colour ramp — IDENTICAL to BrainAnatomy ─────────────
// Inlined as hex strings so Satori can rasterize without a Three.js
// Color object.

const RAMP = [
  { stop: 0.0, color: "#3d4a66" }, // IDLE
  { stop: 0.33, color: "#1e6cff" }, // COLD
  { stop: 0.62, color: "#22d3ee" }, // COOL
  { stop: 0.84, color: "#fde047" }, // WARM
  { stop: 1.0, color: "#ff4f1f" }, // HOT
] as const;

function lerpColor(a: string, b: string, t: number): string {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function activationColor(a: number): string {
  const v = Math.max(0, Math.min(1, a));
  for (let i = 0; i < RAMP.length - 1; i++) {
    const s0 = RAMP[i];
    const s1 = RAMP[i + 1];
    if (v >= s0.stop && v <= s1.stop) {
      const t = (v - s0.stop) / (s1.stop - s0.stop);
      return lerpColor(s0.color, s1.color, t);
    }
  }
  return RAMP[RAMP.length - 1].color;
}

// ── Top-down brain projection ────────────────────────────────────────
// regions.position is [-1, 1] in (x, y, z). For a top-down view we
// project (x, z) to a 2D circle of radius ~280 px centred at (540, 480).
// The brain isn't quite circular — slightly oval — but the dots are
// the signal, not the silhouette.

const CENTER_X = 540;
const CENTER_Y = 540;
const RADIUS = 220;

function dotPosition(pos: readonly [number, number, number]): {
  cx: number;
  cy: number;
} {
  return {
    cx: CENTER_X + pos[0] * RADIUS,
    cy: CENTER_Y - pos[2] * RADIUS, // Z forward (anterior) → up in 2D
  };
}

function shortName(id: RegionId): string {
  return REGION_SHORT_NAMES[id];
}

// ── Top-3 helpers ────────────────────────────────────────────────────

type Activations = Partial<Record<RegionId, number>>;

function pickTopN(activations: Activations, n: number) {
  return Object.entries(activations)
    .map(([id, v]) => ({ id: id as RegionId, v: v ?? 0 }))
    .sort((a, b) => b.v - a.v)
    .slice(0, n);
}

// ── Composition ──────────────────────────────────────────────────────

export type BrainImageInput = {
  labelKey: "anterior" | "rightLateral" | "posterior" | "leftLateral";
  dataUrl: string;
};

const VIEW_ORDER: BrainImageInput["labelKey"][] = [
  "anterior",
  "rightLateral",
  "posterior",
  "leftLateral",
];

const VIEW_LABELS: Record<BrainImageInput["labelKey"], string> = {
  anterior: "Anterior",
  rightLateral: "Right lateral",
  posterior: "Posterior",
  leftLateral: "Left lateral",
};

export function renderFingerprintImage(args: {
  text: string;
  activations: Activations;
  caption: string;
  locale: string;
  brainImages?: BrainImageInput[];
}): ImageResponse {
  const { text, activations, caption, locale, brainImages = [] } = args;
  const top = pickTopN(activations, 3);
  const truncatedText =
    text.length > 400 ? text.slice(0, 380).trimEnd() + "…" : text;
  // Index brain images by labelKey for ordered render.
  const brainsByKey = new Map<BrainImageInput["labelKey"], string>();
  for (const b of brainImages) brainsByKey.set(b.labelKey, b.dataUrl);
  const hasRealBrains = brainsByKey.size > 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(180deg, ${PALETTE.navyDeep} 0%, ${PALETTE.navyMid} 60%, ${PALETTE.navyEnd} 100%)`,
          display: "flex",
          flexDirection: "column",
          color: PALETTE.boneCream,
          fontFamily: "Georgia, serif",
          position: "relative",
          padding: "60px 70px",
        }}
      >
        {/*
          Top third — user's text, eyebrow above. Generous Fraunces
          italic at a large size. Truncated at ~400 chars.
        */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            height: 320,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 18,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily: "Menlo, monospace",
              color: PALETTE.brass,
            }}
          >
            Brain Mirror · Your fingerprint
          </div>
          <div
            style={{
              display: "flex",
              fontSize: text.length > 200 ? 28 : 36,
              lineHeight: 1.35,
              fontStyle: "italic",
              color: PALETTE.boneCream,
              marginTop: 28,
              maxHeight: 260,
              overflow: "hidden",
            }}
          >
            {truncatedText}
          </div>
        </div>

        {/*
          Middle third — four anatomical brain views.
          When the user clicks Export on the live Mirror page, the
          client captures the four BrainViews canvases as PNG data
          URLs and POSTs them in `brainImages`. We render those real
          fsaverage5 mesh renders here (the same brain the user just
          saw on the page) instead of the dot schematic.

          Fallback: when no brainImages are present (GET callers,
          older clients), we render the SVG dot schematic so the
          composition never breaks.
        */}
        <div
          style={{
            display: "flex",
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 0,
            height: 460,
          }}
        >
          {hasRealBrains ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              {/* Row of four anatomical brain views */}
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  gap: 16,
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                {VIEW_ORDER.map((key) => {
                  const url = brainsByKey.get(key);
                  if (!url) return null;
                  return (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: 215,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: 215,
                          height: 215,
                          borderRadius: 4,
                          border: `1px solid ${PALETTE.brassMuted}`,
                          background: PALETTE.navyDeep,
                          overflow: "hidden",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={VIEW_LABELS[key]}
                          width={215}
                          height={215}
                          style={{
                            width: 215,
                            height: 215,
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          fontSize: 13,
                          fontFamily: "Menlo, monospace",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "rgba(240, 232, 216, 0.7)",
                          marginTop: 12,
                        }}
                      >
                        {VIEW_LABELS[key]}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/*
                Brain colour key — same five-stop fMRI ramp used by the
                live brain renders (IDLE → COLD → COOL → WARM → HOT).
                Compact form: idle/hot endpoints flanking a horizontal
                gradient bar, with the five named stops listed in mono
                tracking-wide below. Same legend the user sees on the
                page in `BrainColorLegend.tsx`.
              */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 720,
                  marginTop: 32,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      fontSize: 12,
                      fontFamily: "Menlo, monospace",
                      letterSpacing: "0.20em",
                      textTransform: "uppercase",
                      color: "rgba(240, 232, 216, 0.7)",
                    }}
                  >
                    Idle
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      height: 12,
                      borderRadius: 2,
                      border: `1px solid ${PALETTE.brassMuted}`,
                      background: `linear-gradient(to right, ${RAMP.map(
                        (s, i) =>
                          `${s.color} ${Math.round(
                            (i / (RAMP.length - 1)) * 100,
                          )}%`,
                      ).join(", ")})`,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      fontSize: 12,
                      fontFamily: "Menlo, monospace",
                      letterSpacing: "0.20em",
                      textTransform: "uppercase",
                      color: "rgba(240, 232, 216, 0.7)",
                    }}
                  >
                    Hot
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginTop: 8,
                    paddingLeft: 44,
                    paddingRight: 44,
                  }}
                >
                  {["low", "rising", "peak"].map((label) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        fontSize: 10,
                        fontFamily: "Menlo, monospace",
                        letterSpacing: "0.20em",
                        textTransform: "uppercase",
                        color: "rgba(240, 232, 216, 0.45)",
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 11,
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    color: "rgba(240, 232, 216, 0.45)",
                    marginTop: 10,
                  }}
                >
                  Standard fMRI ramp · cool to warm · informational, not clinical
                </div>
              </div>
            </div>
          ) : (
            <svg
              width={1080}
              height={460}
              viewBox="0 0 1080 460"
              style={{ position: "absolute" }}
            >
              {/* Cortical silhouette — peanut shape suggesting the two
                  hemispheres seen top-down. */}
              <ellipse
                cx={CENTER_X}
                cy={230}
                rx={RADIUS + 30}
                ry={RADIUS + 40}
                fill={PALETTE.brassMuted}
                fillOpacity={0.08}
                stroke={PALETTE.brassMuted}
                strokeWidth={1.5}
              />
              {/* Inter-hemispheric fissure */}
              <line
                x1={CENTER_X}
                y1={230 - RADIUS - 40}
                x2={CENTER_X}
                y2={230 + RADIUS + 40}
                stroke={PALETTE.brassMuted}
                strokeWidth={1}
                strokeOpacity={0.4}
              />
              {/* Region dots */}
              {REGION_IDS.map((id) => {
                const a = activations[id] ?? 0;
                const { cx, cy } = dotPosition(REGION_POSITIONS[id]);
                const sy = cy - 310;
                const fill = activationColor(a);
                const size = 18 + Math.round(a * 16);
                return (
                  <g key={id}>
                    <circle
                      cx={cx}
                      cy={sy}
                      r={size}
                      fill={fill}
                      fillOpacity={0.92}
                      stroke="rgba(240, 232, 216, 0.35)"
                      strokeWidth={1}
                    />
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/*
          Bottom third — caption + thin brass divider + brand line.
        */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            height: 240,
            marginTop: "auto",
          }}
        >
          {/* Top-3 readout — small typographic key. */}
          <div
            style={{
              display: "flex",
              gap: 28,
              fontSize: 18,
              fontFamily: "Menlo, monospace",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(240, 232, 216, 0.7)",
            }}
          >
            {top.map((t) => (
              <div
                key={t.id}
                style={{ display: "flex", alignItems: "baseline", gap: 8 }}
              >
                <span style={{ color: PALETTE.brass }}>
                  {Math.round(t.v * 100)}
                </span>
                <span>
                  {shortName(t.id)} {hemisphereInitial(t.id)}
                </span>
              </div>
            ))}
          </div>

          {/* Caption sentence — Fraunces, /70. */}
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontStyle: "italic",
              lineHeight: 1.4,
              color: "rgba(240, 232, 216, 0.7)",
              marginTop: 24,
            }}
          >
            {caption.length > 280 ? caption.slice(0, 270).trimEnd() + "…" : caption}
          </div>

          {/* Thin brass divider */}
          <div
            style={{
              width: "100%",
              height: 1,
              background: PALETTE.brass,
              opacity: 0.4,
              marginTop: 24,
            }}
          />

          {/* Brand line */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 16,
              fontFamily: "Menlo, monospace",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(240, 232, 216, 0.55)",
              marginTop: 16,
            }}
          >
            <span>The Brain Studio · Brain Mirror · {locale}</span>
            <span>{SITE_URL.replace(/^https?:\/\//, "")}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...FINGERPRINT_SIZE,
    },
  );
}
