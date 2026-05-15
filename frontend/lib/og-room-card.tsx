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

/**
 * Locale → Google Fonts CDN URL for the title face. For Latin
 * locales we keep Fraunces italic (the editorial register).
 * Non-Latin locales swap to Noto Sans (500) so the glyphs render
 * in their native typeface instead of falling through to whatever
 * generic serif the Edge runtime has available.
 *
 * Italic style only applies to Latin — Sans 500 in upright form is
 * the editorial register for CJK/Thai.
 */
type FontSpec = {
  url: string;
  name: string;
  style: "normal" | "italic";
  weight: 400 | 500 | 700;
};

const LOCALE_FONT: Record<string, FontSpec> = {
  en: {
    url: "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,500&display=swap",
    name: "Fraunces",
    style: "italic",
    weight: 500,
  },
  es: {
    url: "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,500&display=swap",
    name: "Fraunces",
    style: "italic",
    weight: 500,
  },
  ca: {
    url: "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,500&display=swap",
    name: "Fraunces",
    style: "italic",
    weight: 500,
  },
  th: {
    url: "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@500&display=swap",
    name: "NotoSansThai",
    style: "normal",
    weight: 500,
  },
  ja: {
    url: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500&display=swap",
    name: "NotoSansJP",
    style: "normal",
    weight: 500,
  },
  "zh-CN": {
    url: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@500&display=swap",
    name: "NotoSansSC",
    style: "normal",
    weight: 500,
  },
};

/**
 * Resolve a Google Fonts CSS URL → raw font binary. Hits the
 * Google CSS endpoint, extracts the woff2 URL, fetches it. Edge
 * runtime safe.
 */
async function loadGoogleFont(cssUrl: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(cssUrl, {
      headers: {
        // Force a woff2 response by sending a UA that Google
        // recognizes as supporting the format.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605 Safari/605",
      },
    }).then((r) => r.text());
    const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('woff2'\)/);
    if (!match) return null;
    const fontUrl = match[1].replace(/['"]/g, "");
    const buffer = await fetch(fontUrl).then((r) => r.arrayBuffer());
    return buffer;
  } catch {
    return null;
  }
}

export async function renderRoomOgCard(args: {
  /** Room name in Fraunces italic. e.g. "Brain Mirror" */
  title: string;
  /** Short one-line subtitle. e.g. "Text → predicted activation" */
  subtitle: string;
  /** Small uppercase eyebrow shown above the title. e.g. "01 · Room" */
  eyebrow?: string;
  /** Locale segment (en, es, th, ja, ca, zh-CN). */
  locale?: string;
}): Promise<ImageResponse> {
  const { title, subtitle, eyebrow = "The Brain Studio", locale = "en" } = args;
  const fontSpec = LOCALE_FONT[locale] ?? LOCALE_FONT.en;
  const fontBuffer = await loadGoogleFont(fontSpec.url);
  const titleFontFamily = fontSpec.name;
  const isLatin = fontSpec.style === "italic";
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

        {/* Title — locale-aware font. Latin locales get Fraunces
            italic; CJK/Thai get Noto Sans 500 upright. Letter-
            spacing tightens only on Latin (negative tracking on
            CJK glyphs looks broken). */}
        <div
          style={{
            marginTop: 100,
            fontSize: isLatin ? 96 : 80,
            fontStyle: isLatin ? "italic" : "normal",
            fontFamily: titleFontFamily,
            letterSpacing: isLatin ? "-0.025em" : "0",
            lineHeight: isLatin ? 1.02 : 1.25,
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
    {
      ...OG_SIZE,
      fonts: fontBuffer
        ? [
            {
              name: titleFontFamily,
              data: fontBuffer,
              style: fontSpec.style,
              weight: fontSpec.weight,
            },
          ]
        : undefined,
    },
  );
}
