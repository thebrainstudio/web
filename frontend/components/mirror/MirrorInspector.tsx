"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import {
  impressionisticPredict,
  type ImpressionisticPrediction,
  type WordContribution,
} from "@/lib/mirror/impressionistic";
import { regions, regionById, type RegionId } from "@/lib/regions";
import { Body, Caption } from "@/components/typography/Typography";
import { easeImportant } from "@/lib/animations";

/**
 * Move 2 — the hover-coupled mirror.
 *
 * After a settled prediction, the user's text becomes inspectable in
 * two directions:
 *
 *   word → region   hover a word; the brain swings toward the regions
 *                   that word would have driven (per the impressionistic
 *                   predictor's lexicon-derived contributions). 400 ms
 *                   lerp in via the brain stage's existing smoother;
 *                   on hover-out the brain returns to the settled
 *                   prediction.
 *
 *   region → word   hover one of the 20 region pills; the words that
 *                   contributed to that region get a thin brass
 *                   underline. A small caption above the pill row
 *                   shows the region's anatomy + hemisphere + science
 *                   gloss (the curated locked-in format from earlier).
 *
 * Per-word contributions come from `impressionisticPredict(text)`. The
 * settled (TRIBE) prediction doesn't expose per-word data — TRIBE gives
 * one whole-input prediction — so the hover coupling is the
 * impressionistic predictor's accounting, surfaced honestly. The two
 * datasets share the same 20-region vocabulary so the visual is
 * coherent.
 *
 * Mobile: hover translates to tap-to-pin, tap-elsewhere-to-clear.
 */

type Props = {
  /** The text the user typed (drives word tokenization + contributions). */
  text: string;
  /** The settled prediction's activation map (what the brain shows
   *  at rest). On word hover, the brain temporarily moves to the
   *  hovered word's contribution pattern. */
  settledActivations: Partial<Record<RegionId, number>>;
};

const REGION_ORDER: readonly RegionId[] = [
  "ifg_left", "ifg_right",
  "pstg_left", "pstg_right",
  "mtg_left", "mtg_right",
  "atl_left", "atl_right",
  "agl_left", "agl_right",
  "hg_left", "hg_right",
  "vmpfc", "dmpfc",
  "pcc", "precuneus",
  "amyg_left", "amyg_right",
  "hipp_left", "hipp_right",
];

function hemispherePart(id: RegionId): "left" | "right" | "midline" {
  if (id.endsWith("_left")) return "left";
  if (id.endsWith("_right")) return "right";
  return "midline";
}

/** Format the on-hover region label per the design lock-in:
 *  `anatomy · hemisphere · first phrase of scienceGloss`. */
function regionDescriptor(id: RegionId): string {
  const r = regionById[id];
  const anatomy = r.displayName.replace(/\s*\([LR]\)\s*$/i, "").trim();
  const hemi = hemispherePart(id);
  const sci = r.scienceGloss
    .replace(/^Involved in\s*/i, "")
    .replace(/^Implicated in\s*/i, "")
    .replace(/^A\s+/i, "");
  // First clause only.
  const firstClause = sci.split(/[.,;]/)[0].trim();
  const hemiLabel = hemi === "midline" ? "midline" : hemi;
  return `${anatomy} · ${hemiLabel} · ${firstClause.toLowerCase()}`;
}

/**
 * Pick the top-N regions for a single word from its contribution map.
 * Used by word-hover to spotlight the brain.
 */
function topRegionsForWord(
  word: WordContribution,
  n = 3,
): { id: RegionId; weight: number }[] {
  return Object.entries(word.regions)
    .map(([id, w]) => ({ id: id as RegionId, weight: w ?? 0 }))
    .filter((e) => e.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, n);
}

/**
 * Build a `region → set of word indices` reverse-index from the
 * impressionistic contributions list. Used by region-hover to find
 * which words contributed.
 */
function buildRegionToWords(
  prediction: ImpressionisticPrediction,
): Map<RegionId, Set<number>> {
  const out = new Map<RegionId, Set<number>>();
  for (const c of prediction.contributions) {
    for (const region of Object.keys(c.regions) as RegionId[]) {
      if (!out.has(region)) out.set(region, new Set());
      out.get(region)!.add(c.index);
    }
  }
  return out;
}

export default function MirrorInspector({ text, settledActivations }: Props) {
  const t = useTranslations("mirror");
  const setActivations = useBrainStageStore((s) => s.setActivations);

  // Impressionistic prediction over the current text — pure function,
  // recomputes only when `text` changes. Drives both directions of
  // hover.
  const impressionistic = useMemo(
    () => (text.trim().length > 0 ? impressionisticPredict(text) : null),
    [text],
  );

  const regionToWords = useMemo(
    () =>
      impressionistic ? buildRegionToWords(impressionistic) : new Map(),
    [impressionistic],
  );

  const [hoveredWord, setHoveredWord] = useState<number | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<RegionId | null>(null);

  // Word-hover → brain spotlight.
  // On enter: temporarily push the brain toward this word's top-3
  // regions. On leave: restore the settled prediction.
  //
  // Spotlight contrast is intentionally dramatic — hovered regions
  // saturate at 1.0, others drop to 0.04 (nearly idle). The user's
  // settled TRIBE prediction has many regions in the 0.4-0.7 band, so
  // a subtle spotlight reads as "barely moved." High contrast makes
  // the swing read at a glance, which is the whole point of the
  // hover affordance.
  const enterWord = useCallback(
    (wordIdx: number) => {
      if (!impressionistic) return;
      setHoveredWord(wordIdx);
      const word = impressionistic.contributions[wordIdx];
      if (!word) return;
      const tops = topRegionsForWord(word, 3);
      if (tops.length === 0) {
        // Word has no lexicon match (e.g. "remembering"). Don't replace
        // the brain activations — let the user see the settled
        // prediction without a misleading "this word means nothing"
        // signal. But still mark the word as hovered so the visual
        // feedback (brass tint) confirms the input was registered.
        return;
      }
      const spotlight: Partial<Record<RegionId, number>> = {};
      for (const r of REGION_ORDER) spotlight[r] = 0.04;
      for (const t of tops) spotlight[t.id] = 1.0;
      setActivations(spotlight as Record<string, number>);
    },
    [impressionistic, setActivations],
  );

  const leaveWord = useCallback(() => {
    setHoveredWord(null);
    setActivations(settledActivations as Record<string, number>);
  }, [setActivations, settledActivations]);

  // Region-hover → underline matching words.
  const enterRegion = useCallback((id: RegionId) => {
    setHoveredRegion(id);
  }, []);
  const leaveRegion = useCallback(() => {
    setHoveredRegion(null);
  }, []);

  if (!impressionistic || impressionistic.contributions.length === 0) {
    return null;
  }

  // Words from the same lower-cased impressionistic tokenization, paired
  // with surrounding whitespace from the original text. We can't perfectly
  // round-trip whitespace through the lexicon tokenizer, but we get the
  // shape right by walking the original text and matching regex hits.
  const tokens = impressionistic.contributions;
  const wordsHighlightedByRegion = hoveredRegion
    ? (regionToWords.get(hoveredRegion) ?? new Set<number>())
    : new Set<number>();

  return (
    <div className="mt-12 md:mt-16">
      <Caption
        uppercase
        className="text-bone-cream/55 mb-4 block tracking-[0.18em]"
      >
        Inspect — hover a word, or a region
      </Caption>

      {/*
        Hoverable text — each word a span. Hovering a word swings the
        brain toward its top-3 contribution regions; hovering a region
        below underlines the words that contributed.
      */}
      <Body
        className="text-bone-cream/85 leading-[1.85]"
        as="p"
      >
        {tokens.map((tok, i) => {
          const isHovered = hoveredWord === i;
          const isUnderlinedByRegion = wordsHighlightedByRegion.has(i);
          // Words with no lexicon match still get a hover indicator
          // (so the user knows their hover was registered) but no brain
          // swing. Slightly muted accent so it's clear it's an
          // "inert" hover.
          const word = impressionistic.contributions[i];
          const hasContribution = Object.keys(word?.regions ?? {}).length > 0;
          return (
            <span key={i}>
              <span
                role="button"
                tabIndex={0}
                aria-label={`Inspect "${tok.word}"`}
                onMouseEnter={() => enterWord(i)}
                onMouseLeave={leaveWord}
                onFocus={() => enterWord(i)}
                onBlur={leaveWord}
                onTouchStart={() =>
                  hoveredWord === i ? leaveWord() : enterWord(i)
                }
                className={`relative inline-block cursor-pointer rounded-sm px-1 transition-all duration-[220ms] ${
                  isHovered
                    ? hasContribution
                      ? "bg-brass/25 text-bone-cream ring-1 ring-brass/60"
                      : "bg-bone-cream/10 text-bone-cream/70 ring-1 ring-bone-cream/20"
                    : "text-bone-cream/85 hover:text-bone-cream hover:bg-bone-cream/5"
                }`}
                data-hover
              >
                {tok.word}
                {/*
                  Brass underline when a region hover claims this word.
                  1 px, /60 opacity per the brief; animated in 220 ms.
                */}
                <motion.span
                  aria-hidden
                  className="bg-brass pointer-events-none absolute -bottom-0.5 left-1 right-1 h-[1px]"
                  initial={false}
                  animate={{
                    opacity: isUnderlinedByRegion ? 0.7 : 0,
                  }}
                  transition={{
                    duration: 0.22,
                    ease: easeImportant,
                  }}
                />
              </span>
              {i < tokens.length - 1 ? " " : ""}
            </span>
          );
        })}
      </Body>

      {/*
        Live "inspecting" feedback. When a word is hovered, show which
        regions the brain is swinging toward (or a "no lexicon match"
        message for inert words). Gives the user immediate visual
        confirmation that their hover was registered, separate from the
        brain swing itself (which can be subtle in busy patterns).
      */}
      <div className="mt-3 min-h-[1.5rem]">
        <AnimatePresence mode="wait">
          {hoveredWord !== null && impressionistic.contributions[hoveredWord] && (
            <motion.div
              key={hoveredWord}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: easeImportant }}
            >
              {(() => {
                const word = impressionistic.contributions[hoveredWord];
                const tops = topRegionsForWord(word, 3);
                if (tops.length === 0) {
                  return (
                    <Caption
                      uppercase
                      className="text-bone-cream/45 tracking-[0.18em] italic"
                    >
                      &quot;{word.word}&quot; — no lexicon match · brain holds steady
                    </Caption>
                  );
                }
                return (
                  <Caption
                    uppercase
                    className="text-brass tracking-[0.18em]"
                  >
                    &quot;{word.word}&quot; →{" "}
                    {tops
                      .map((t) =>
                        regionById[t.id].displayName.replace(
                          /\s*\([LR]\)\s*$/i,
                          "",
                        ),
                      )
                      .join(" · ")}
                  </Caption>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Region label — only when a region is being hovered. */}
      <div className="mt-6 min-h-[1.5rem]">
        <AnimatePresence mode="wait">
          {hoveredRegion && (
            <motion.div
              key={hoveredRegion}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.24, ease: easeImportant }}
            >
              <Caption
                uppercase
                className="text-brass tracking-[0.18em]"
              >
                {regionDescriptor(hoveredRegion)}
              </Caption>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/*
        20 region pills. Hover one to see its driving words underlined.
        Pills carry a thin brass outline when their region has any
        contribution in the current text — silent way of saying "this
        region had a vote." Otherwise they're muted.
      */}
      <div className="mt-4 flex flex-wrap gap-2">
        {REGION_ORDER.map((id) => {
          const hasContribution = regionToWords.has(id);
          const isHovered = hoveredRegion === id;
          return (
            <button
              key={id}
              type="button"
              onMouseEnter={() => enterRegion(id)}
              onMouseLeave={leaveRegion}
              onFocus={() => enterRegion(id)}
              onBlur={leaveRegion}
              aria-label={`Inspect ${regionById[id].anatomyName}`}
              data-hover
              className={`group rounded-sm border px-2.5 py-1 text-xs uppercase tracking-[0.16em] transition-colors duration-[220ms] ${
                isHovered
                  ? "border-brass text-brass bg-brass/10"
                  : hasContribution
                    ? "border-bone-cream/30 text-bone-cream/70 hover:border-brass/60 hover:text-brass"
                    : "border-bone-cream/10 text-bone-cream/35 hover:border-bone-cream/20"
              }`}
            >
              {regionById[id].displayName.replace(/\s*\([LR]\)\s*$/i, "")}{" "}
              <span
                aria-hidden
                className="opacity-60"
              >
                {hemispherePart(id) === "left" && "L"}
                {hemispherePart(id) === "right" && "R"}
              </span>
            </button>
          );
        })}
      </div>

      <Caption
        uppercase
        className="text-bone-cream/40 mt-4 block tracking-[0.18em] italic"
      >
        Hover a word: the brain swings toward its regions. Hover a
        region: the words that voted for it underline. {t("disclaimer")}
      </Caption>
    </div>
  );
}
