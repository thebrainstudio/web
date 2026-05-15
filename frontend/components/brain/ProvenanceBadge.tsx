"use client";

import { useTranslations } from "next-intl";
import { Caption } from "@/components/typography/Typography";

/**
 * Integrity-pass — small persistent visual marker that names what
 * kind of model drove the brain visualization a reader is looking
 * at. Sits adjacent to every brain stage; distinct from (and paired
 * with) the existing expandable `ProvenanceFooter`.
 *
 * Four states map to the site's actually-shipped pipeline.
 * `tribe-inference` is reserved for the day a real TRIBE checkpoint
 * serves the prediction end-to-end; not used in this PR.
 */

export type ProvenanceState =
  | "neurosynth"
  | "embedding-baseline"
  | "lexical-heuristic"
  | "literature-informed"
  | "tribe-inference";

const STATE_CLASSES: Record<ProvenanceState, { dot: string; text: string }> = {
  // Neurosynth meta-analytic aggregate — brass dot, brass text, the
  // site's positive default state. Tracks the warm palette the
  // citations + ProvenanceFooter already use.
  neurosynth: {
    dot: "bg-brass",
    text: "text-brass/85",
  },
  // Live embedding backend (Render BGE-small). Cyan — distinct from
  // the brass meta-analytic state but not warning-coloured because
  // the predictor IS real, just narrower than Neurosynth.
  "embedding-baseline": {
    dot: "bg-cyan-glow",
    text: "text-cyan-glow/85",
  },
  // Offline fallback path. Amber dot — a quiet warning that what
  // you're seeing is a lexical heuristic, not a model. The site's
  // standard amber hue keeps the warning legible without screaming.
  "lexical-heuristic": {
    dot: "bg-[#e8a04a]",
    text: "text-[#e8a04a]/90",
  },
  // Cellular descent + a couple of legacy hand-authored animations.
  // Neutral gray — neither a model claim nor a meta-analytic one.
  "literature-informed": {
    dot: "bg-bone-cream/50",
    text: "text-bone-cream/55",
  },
  // Reserved.
  "tribe-inference": {
    dot: "bg-[#7fd17f]",
    text: "text-[#7fd17f]/90",
  },
};

export default function ProvenanceBadge({
  state,
  className = "",
}: {
  state: ProvenanceState;
  className?: string;
}) {
  const t = useTranslations("provenance");
  const cls = STATE_CLASSES[state];
  return (
    <span
      data-provenance={state}
      role="note"
      aria-label={t(`labels.${state}.aria`)}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <span
        aria-hidden
        className={`inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full ${cls.dot}`}
      />
      <Caption uppercase className={`tracking-[0.22em] ${cls.text}`}>
        {t(`labels.${state}.text`)}
      </Caption>
    </span>
  );
}
