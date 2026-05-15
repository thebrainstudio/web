"use client";

import { useTranslations } from "next-intl";
import { regionById, type RegionId } from "@/lib/regions";
import { activationColor } from "@/lib/brain/activation-palette";
import { activationBandKey, bandFor } from "@/lib/activationBands";
import { Caption, Mono } from "@/components/typography/Typography";

/**
 * Compact brain-prediction sidebar for a literary passage.
 *
 * NOT a real TRIBE inference. This is a literature-informed
 * composite — the same kind of careful guess the Archetypes
 * mandalas room uses — drawn from the cited neuroscience literature
 * about what a brain-encoding model would plausibly warm if it read
 * the passage in question. The chip below the readout names it as
 * such; the room's Movement 2 cites the underlying papers.
 *
 * Integrity-pass (Commit 3): the per-region readout no longer shows
 * a two-decimal percentage — the underlying data doesn't support
 * that precision. Each region renders a qualitative band label
 * ("strongest response" / "moderate" / "minimal" / "near silence")
 * via `lib/activationBands`. The thin coloured bar still varies in
 * width (now per-band, not per-percent) so the visual hierarchy
 * across regions stays legible.
 */
// Width of the visual bar by band — quasi-quantitative, no decimal claim.
const BAND_WIDTH: Record<ReturnType<typeof bandFor>, number> = {
  strongest: 92,
  moderate: 58,
  minimal: 28,
  "near-silence": 8,
};

export default function BrainPrediction({
  label,
  activations,
  disclaimer,
}: {
  /** Top-level label, e.g. "Original" / "Translation". */
  label: string;
  /** Per-region [0, 1] activations. Top 4 will render. */
  activations: Partial<Record<RegionId, number>>;
  /** Honest disclaimer text — usually the same per room. */
  disclaimer: string;
}) {
  const t = useTranslations("activation");

  const top = (Object.entries(activations) as [RegionId, number][])
    .filter(([, v]) => v > 0.05)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="border-bone-cream/10 bg-navy-deep/40 rounded-sm border p-5">
      <Caption uppercase className="text-brass tracking-[0.22em] block">
        {label}
      </Caption>
      <ul className="mt-5 space-y-3">
        {top.map(([id, value]) => {
          const r = regionById[id];
          if (!r) return null;
          const color = activationColor(value);
          const band = bandFor(value);
          const widthPct = BAND_WIDTH[band];
          return (
            <li key={id}>
              <div className="flex items-baseline justify-between gap-3">
                <Caption className="text-bone-cream/85 text-[0.78rem]">
                  {r.displayName}
                </Caption>
                <Mono
                  variant="label"
                  className="text-brass tracking-[0.12em]"
                >
                  {t(activationBandKey(value))}
                </Mono>
              </div>
              <div
                aria-hidden
                className="bg-bone-cream/8 mt-2 h-px w-full overflow-hidden"
              >
                <div
                  className="h-px"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: color,
                    opacity: 0.85,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-bone-cream/35 mt-5 text-[0.7rem] italic leading-snug">
        {disclaimer}
      </p>
    </div>
  );
}
