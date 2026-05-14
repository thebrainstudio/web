import { regionById, type RegionId } from "@/lib/regions";
import { activationColor } from "@/lib/brain/activation-palette";
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
 * Each entry: region anatomy + activation strength + a thin
 * coloured bar. The dual presentation (original/translation in the
 * literary rooms) is achieved by rendering two of these side-by-
 * side; the parent component handles layout.
 */
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
          const pct = Math.round(value * 100);
          return (
            <li key={id}>
              <div className="flex items-baseline justify-between gap-3">
                <Caption className="text-bone-cream/85 text-[0.78rem]">
                  {r.displayName}
                </Caption>
                <Mono
                  variant="label"
                  className="text-brass tabular-nums tracking-[0.12em]"
                >
                  {pct}%
                </Mono>
              </div>
              <div
                aria-hidden
                className="bg-bone-cream/8 mt-2 h-px w-full overflow-hidden"
              >
                <div
                  className="h-px"
                  style={{
                    width: `${pct}%`,
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
