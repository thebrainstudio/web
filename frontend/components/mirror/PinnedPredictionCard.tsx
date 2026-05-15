"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { regionById, type RegionId } from "@/lib/regions";
import { activationBandKey } from "@/lib/activationBands";
import { Body, Caption, Mono } from "@/components/typography/Typography";
import { easeImportant } from "@/lib/animations";
import MiniBrainPreview from "./MiniBrainPreview";

/**
 * Move 4 — the pinned prediction card.
 *
 * A small fixed-position card (bottom-left desktop, bottom-sheet style
 * on narrow viewports) showing a single previously-pinned prediction:
 *   - the first ~60 chars of the original text
 *   - a thumbnail brain rendering of the pinned activations
 *   - the top-3 regions of that prediction (compact)
 *   - a Compare/Clear affordance
 *
 * When the user keeps typing after pinning, the parent page enters
 * "compare mode": the diff between the current prediction and the
 * pinned one shows on the card.
 *
 * Visual style: matches the existing region cards (thin brass
 * border, navy-deep background at /60, generous padding). Width
 * capped at 22 rem so it doesn't dominate the viewport.
 */

export type PinnedPrediction = {
  text: string;
  activations: Partial<Record<RegionId, number>>;
  topRegions: { id: RegionId; activation: number }[];
};

type Props = {
  pinned: PinnedPrediction;
  /** Current prediction, if any. When set + different from pinned,
   *  the card renders the compare-mode diff readout. */
  current?: PinnedPrediction | null;
  onClear: () => void;
};

/**
 * Compute the region-by-region delta and pick the strongest moves.
 * Returns a tuple [gainers, losers] each capped at 2 entries.
 */
function computeDelta(
  current: Partial<Record<RegionId, number>>,
  pinned: Partial<Record<RegionId, number>>,
): { id: RegionId; delta: number }[] {
  const out: { id: RegionId; delta: number }[] = [];
  const allKeys = new Set<RegionId>([
    ...(Object.keys(current) as RegionId[]),
    ...(Object.keys(pinned) as RegionId[]),
  ]);
  for (const k of allKeys) {
    const c = current[k] ?? 0;
    const p = pinned[k] ?? 0;
    const d = c - p;
    if (Math.abs(d) >= 0.06) {
      out.push({ id: k, delta: d });
    }
  }
  out.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  return out.slice(0, 5);
}

function shortDisplayName(id: RegionId): string {
  return regionById[id].displayName.replace(/\s*\([LR]\)\s*$/i, "");
}

function shortHemisphere(id: RegionId): string {
  if (id.endsWith("_left")) return "L";
  if (id.endsWith("_right")) return "R";
  return "";
}

export default function PinnedPredictionCard({
  pinned,
  current,
  onClear,
}: Props) {
  const tActivation = useTranslations("activation");
  const inCompareMode = !!current && current.text !== pinned.text;
  const deltas = inCompareMode
    ? computeDelta(current.activations, pinned.activations)
    : [];

  return (
    <AnimatePresence>
      <motion.aside
        // Bottom-left desktop, full-width bottom-sheet on mobile.
        // pointer-events explicit so it sits cleanly above the
        // brain stage (z-0) and below the header (z-40).
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.6, ease: easeImportant }}
        className="border-brass/30 bg-navy-deep/85 fixed bottom-6 left-6 z-30 w-[min(22rem,calc(100vw-3rem))] rounded-sm border p-5 backdrop-blur-md md:left-8 md:bottom-8"
        aria-label="Pinned prediction"
      >
        <header className="flex items-baseline justify-between">
          <Caption uppercase className="text-brass tracking-[0.18em]">
            {inCompareMode ? "Pinned · vs current" : "Pinned"}
          </Caption>
          <button
            type="button"
            onClick={onClear}
            data-hover
            className="text-bone-cream/55 hover:text-brass transition-colors duration-200"
            aria-label="Clear pinned prediction"
          >
            <Caption uppercase className="tracking-[0.18em]">
              Clear
            </Caption>
          </button>
        </header>

        {/* Pinned text excerpt + thumbnail */}
        <div className="mt-4 flex items-start gap-4">
          <div className="border-bone-cream/10 bg-navy-deep relative aspect-square w-16 shrink-0 overflow-hidden rounded-sm border">
            <MiniBrainPreview activations={pinned.activations} />
          </div>
          <div className="min-w-0 flex-1">
            <Body
              italic
              className="text-bone-cream/75 line-clamp-3 text-sm leading-[1.5]"
            >
              {pinned.text.length > 64
                ? pinned.text.slice(0, 60).trimEnd() + "…"
                : pinned.text}
            </Body>
            <div className="text-bone-cream/55 mt-3 flex flex-wrap gap-x-3 gap-y-1">
              {pinned.topRegions.slice(0, 3).map((r) => (
                <span
                  key={r.id}
                  className="inline-flex items-baseline gap-1.5"
                >
                  {/* Integrity-pass: render the qualitative band
                      label, not a decimal percentage. */}
                  <Mono
                    variant="label"
                    className="text-brass tracking-[0.14em]"
                  >
                    {tActivation(activationBandKey(r.activation))}
                  </Mono>
                  <Caption uppercase className="tracking-[0.14em]">
                    {shortDisplayName(r.id)}{" "}
                    <span aria-hidden className="text-bone-cream/40">
                      {shortHemisphere(r.id)}
                    </span>
                  </Caption>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Compare-mode diff readout */}
        <AnimatePresence>
          {inCompareMode && deltas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: easeImportant }}
              className="border-bone-cream/10 mt-5 overflow-hidden border-t pt-4"
            >
              <Caption
                uppercase
                className="text-bone-cream/55 mb-2 block tracking-[0.18em]"
              >
                vs pinned
              </Caption>
              <ul className="space-y-1.5">
                {deltas.map((d) => {
                  const sign = d.delta > 0 ? "+" : "−";
                  return (
                    <li
                      key={d.id}
                      className="flex items-baseline justify-between gap-3"
                    >
                      <Caption
                        uppercase
                        className="text-bone-cream/75 tracking-[0.14em]"
                      >
                        {shortDisplayName(d.id)}{" "}
                        <span
                          aria-hidden
                          className="text-bone-cream/40"
                        >
                          {shortHemisphere(d.id)}
                        </span>
                      </Caption>
                      <Mono
                        variant="label"
                        className={
                          d.delta > 0 ? "text-brass" : "text-bone-cream/55"
                        }
                      >
                        {sign}
                        {Math.round(Math.abs(d.delta) * 100)}
                      </Mono>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </AnimatePresence>
  );
}
