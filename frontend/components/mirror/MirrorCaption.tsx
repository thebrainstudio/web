"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  generateCaption,
  type CaptionResult,
} from "@/lib/mirror/caption-generator";
import { savedExamples } from "@/lib/savedExamples";
import { Body, Caption } from "@/components/typography/Typography";
import { easeImportant } from "@/lib/animations";
import type { RegionId } from "@/lib/regions";

/**
 * Move 3 — the "what just happened" caption.
 *
 * Two short sentences (occasionally three) that name the top-3
 * activated regions and what they do, optionally referencing one of
 * the three curated example texts when the pattern matches strongly.
 *
 * Visual treatment:
 *   - Fraunces (Body), opacity `text-bone-cream/85`.
 *   - Fades in over 800 ms with a 12 px upward translate.
 *   - Easing cubic-bezier(0.22, 1, 0.36, 1) (=easeImportant).
 *   - Below the caption: a fixed disclaimer line in Caption typography,
 *     opacity `text-bone-cream/75`. Only its presence is animated, not
 *     its content — keeps the honesty signal stable across updates.
 *   - Re-keys on caption text change so AnimatePresence triggers an
 *     out-in transition (old fades 300 ms, new fades in 600 ms +
 *     delay handled by AnimatePresence wait mode).
 *
 * Localization status:
 *   - English caption shipped now; translators fill in
 *     `messages/<locale>.json` under `mirror.caption.*` keys.
 *   - The disclaimer is i18n-aware (`mirror.disclaimer`) and ships
 *     in all 6 locales today.
 *   - When the caption keys are missing, the generator falls back to
 *     the English string — the experience never breaks across locales.
 */

type Props = {
  activations: Partial<Record<RegionId, number>>;
  /** Optional className for layout positioning. */
  className?: string;
};

export default function MirrorCaption({ activations, className = "" }: Props) {
  const t = useTranslations("mirror");

  const result = useMemo<CaptionResult>(
    () =>
      generateCaption({
        activations,
        examples: savedExamples.map((ex) => ({
          id: ex.id,
          label: ex.label,
          activations: ex.activations,
        })),
      }),
    [activations],
  );

  // Below-threshold state: hide entirely. The settled prediction has to
  // genuinely have signal before we surface a caption — anything else
  // would be the model talking when there's nothing to say.
  if (result.belowSignalThreshold) return null;

  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          // Re-key on the text content so the old caption can exit and
          // the new caption enter when activations shift.
          key={result.text}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{
            duration: 0.8,
            ease: easeImportant,
          }}
        >
          <Body className="text-bone-cream/85 italic max-w-[34rem]">
            {result.text}
          </Body>
        </motion.div>
      </AnimatePresence>

      {/*
        Disclaimer is mounted whenever the caption section is rendered.
        Its content is fixed; only its presence is animated, so it
        doesn't churn between every activation update. Caption
        typography, uppercase tracking, /55 opacity per the brief.
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: easeImportant, delay: 0.2 }}
      >
        <Caption
          uppercase
          className="text-bone-cream/75 tracking-[0.18em] mt-4 block max-w-[34rem]"
        >
          {t("disclaimer")}
        </Caption>
      </motion.div>
    </div>
  );
}
