/**
 * Shared procedural OG card renderer. audit-fix: Task 4.
 *
 * Each room's `opengraph-image.tsx` imports this and supplies its own
 * title + subtitle, so the cards share the same palette/typography
 * without duplicating the JSX. Kept in lib/ (not under app/) so Next.js
 * doesn't try to treat it as a route file.
 */

import { ImageResponse } from "next/og";
import { OG_PALETTE } from "@/lib/seo";
import { SITE_URL } from "@/lib/urls";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

export function renderRoomOgCard(args: {
  /** Room name in Fraunces italic. e.g. "Brain Mirror" */
  title: string;
  /** Short one-line subtitle. e.g. "Text → predicted activation" */
  subtitle: string;
  /** Small uppercase eyebrow shown above the title. e.g. "01 · Room" */
  eyebrow?: string;
}): ImageResponse {
  const { title, subtitle, eyebrow = "The Brain Studio" } = args;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(180deg, ${OG_PALETTE.navyDeep} 0%, ${OG_PALETTE.navyMid} 50%, ${OG_PALETTE.navyEnd} 100%)`,
          display: "flex",
          flexDirection: "column",
          padding: "64px 80px",
          color: OG_PALETTE.boneCream,
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Faint brass arc, anchors the lower half */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            pointerEvents: "none",
          }}
        >
          <svg
            width={OG_SIZE.width}
            height={OG_SIZE.height}
            viewBox={`0 0 ${OG_SIZE.width} ${OG_SIZE.height}`}
          >
            <ellipse
              cx="600"
              cy="500"
              rx="520"
              ry="140"
              fill="none"
              stroke={OG_PALETTE.brass}
              strokeOpacity="0.14"
              strokeWidth="1"
            />
            <ellipse
              cx="600"
              cy="500"
              rx="360"
              ry="90"
              fill="none"
              stroke={OG_PALETTE.brass}
              strokeOpacity="0.08"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Eyebrow */}
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.32em",
            color: OG_PALETTE.brass,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>

        {/* Title — Fraunces italic feel via Georgia fallback */}
        <div
          style={{
            marginTop: 100,
            fontSize: 96,
            fontStyle: "italic",
            letterSpacing: "-0.025em",
            lineHeight: 1.02,
            maxWidth: 1040,
            color: OG_PALETTE.boneCream,
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            letterSpacing: "-0.005em",
            lineHeight: 1.35,
            maxWidth: 980,
            color: OG_PALETTE.boneCreamMuted,
          }}
        >
          {subtitle}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "space-between",
            color: OG_PALETTE.boneCream,
            opacity: 0.55,
            fontSize: 18,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          <span>{SITE_URL.replace(/^https?:\/\//, "")}</span>
          <span>Six rooms · TRIBE v2</span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
