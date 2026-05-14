"use client";

import { Caption } from "@/components/typography/Typography";

/**
 * Brain activation colour-ramp legend.
 *
 * Shows the five stops of the fMRI-style colour ramp the live brain
 * uses, with their meaning in editorial caption typography. The
 * gradient swatch and the colour stops are kept in lockstep with the
 * `activationColor()` function in `BrainAnatomy.tsx`, `BrainViews.tsx`,
 * and `MiniBrainPreview.tsx` — any change there must come back here.
 *
 * The ramp deliberately spans cool → warm so a brain with localised
 * activation reads in one glance: cooler areas are at rest, warmer
 * areas are recruited.
 */

// Five ramp stops — match `IDLE → COLD → COOL → WARM → HOT` in the
// brain renderers. Hex only here so the CSS gradient renders without
// having to import three.js into a server component.
const STOPS: { hex: string; labelKey: "idle" | "low" | "rising" | "peak" | "hot" }[] = [
  { hex: "#3d4a66", labelKey: "idle" },
  { hex: "#1e6cff", labelKey: "low" },
  { hex: "#22d3ee", labelKey: "rising" },
  { hex: "#fde047", labelKey: "peak" },
  { hex: "#ff4f1f", labelKey: "hot" },
];

const LABELS_EN: Record<typeof STOPS[number]["labelKey"], string> = {
  idle: "Idle",
  low: "Low",
  rising: "Rising",
  peak: "Peak",
  hot: "Hot",
};

const MEANINGS_EN: Record<typeof STOPS[number]["labelKey"], string> = {
  idle: "at rest / not recruited by the input",
  low: "slightly above baseline",
  rising: "moderately recruited",
  peak: "strongly recruited — characteristic fMRI peak",
  hot: "most recruited region(s) for this input",
};

export default function BrainColorLegend({
  className = "",
}: {
  className?: string;
}) {
  const gradient = `linear-gradient(to right, ${STOPS.map(
    (s, i) =>
      `${s.hex} ${Math.round((i / (STOPS.length - 1)) * 100)}%`,
  ).join(", ")})`;

  return (
    <div className={className}>
      <Caption
        uppercase
        className="text-bone-cream/55 mb-3 block tracking-[0.18em]"
      >
        Brain colour key
      </Caption>

      {/* The gradient swatch + flanking idle/hot labels. */}
      <div className="flex items-center gap-3">
        <Caption
          uppercase
          className="text-bone-cream/65 shrink-0 tracking-[0.18em]"
        >
          {LABELS_EN.idle}
        </Caption>
        <div
          aria-hidden
          className="border-bone-cream/10 h-3 flex-1 rounded-sm border"
          style={{ background: gradient }}
        />
        <Caption
          uppercase
          className="text-bone-cream/65 shrink-0 tracking-[0.18em]"
        >
          {LABELS_EN.hot}
        </Caption>
      </div>

      {/* Stop-by-stop key. Each row is a small swatch + label + a
          plain-English meaning so the reader doesn't have to guess
          what "rising" means in fMRI terms. */}
      <ul className="mt-4 space-y-1.5">
        {STOPS.map((s) => (
          <li
            key={s.labelKey}
            className="flex items-baseline gap-3"
          >
            <span
              aria-hidden
              className="border-bone-cream/15 inline-block size-3 shrink-0 translate-y-[1px] rounded-full border"
              style={{ background: s.hex }}
            />
            <Caption
              uppercase
              className="text-bone-cream/70 shrink-0 w-16 tracking-[0.18em]"
            >
              {LABELS_EN[s.labelKey]}
            </Caption>
            <Caption className="text-bone-cream/50 italic">
              {MEANINGS_EN[s.labelKey]}
            </Caption>
          </li>
        ))}
      </ul>

      <Caption
        uppercase
        className="text-bone-cream/40 mt-4 block tracking-[0.18em] italic"
      >
        Standard fMRI ramp · cool to warm · informational, not clinical
      </Caption>
    </div>
  );
}
