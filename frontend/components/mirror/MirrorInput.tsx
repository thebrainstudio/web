"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { easeCinematic } from "@/lib/animations";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import { fakePredict, type Prediction } from "@/lib/fakePredictor";
import { inferText } from "@/lib/tribeClient";
import { Caption } from "@/components/typography/Typography";
import MirrorLoadingMessage from "./MirrorLoadingMessage";

// audit-fix: Task 10. Soft cap on textarea content — keeps prediction
// requests bounded and prevents accidental long-paste failures.
const MAX_LENGTH = 5000;
// audit-fix: Task 10. Live-update debounce (was 300ms). 350ms matches
// the audit brief's recommendation for input → prediction trigger.
const LIVE_DEBOUNCE_MS = 350;

type Props = {
  /** Receive every settled prediction. */
  onPrediction: (text: string, prediction: Prediction) => void;
  initial?: string;
};

/**
 * The Brain Mirror's text input.
 *
 * Two debounce windows:
 *   - 300ms (live): updates the persistent brain's activations so the user
 *     sees the visualization breathe as they type.
 *   - 700ms (settled): commits the result, fires `onPrediction`, and shows
 *     the top-3 region reveal.
 *
 * Placeholder is editorial italic (`<Body italic>` glyphs via a styled
 * textarea). Resizes vertically; respects reduced motion.
 */
export default function MirrorInput({ onPrediction, initial = "" }: Props) {
  const t = useTranslations("mirror");
  const [value, setValue] = useState(initial);
  const [settling, setSettling] = useState(false);
  const setActivations = useBrainStageStore((s) => s.setActivations);
  const resetIdle = useBrainStageStore((s) => s.resetIdle);

  const liveTimer = useRef<number | null>(null);
  const settleTimer = useRef<number | null>(null);

  useEffect(() => {
    if (liveTimer.current) window.clearTimeout(liveTimer.current);
    if (settleTimer.current) window.clearTimeout(settleTimer.current);

    if (value.trim().length < 3) {
      resetIdle();
      setSettling(false);
      return;
    }

    setSettling(true);

    liveTimer.current = window.setTimeout(() => {
      const pred = fakePredict(value);
      setActivations(pred.activations as Record<string, number>);
    }, LIVE_DEBOUNCE_MS);

    const controller = new AbortController();
    settleTimer.current = window.setTimeout(async () => {
      // Try real TRIBE inference first; fall back to the local predictor.
      const remote = await inferText(value, { signal: controller.signal });
      const local = fakePredict(value);
      const merged: Prediction = remote
        ? { activations: remote.regions, features: local.features }
        : local;
      setActivations(merged.activations as Record<string, number>);
      onPrediction(value, merged);
      setSettling(false);
    }, 900);

    return () => {
      controller.abort();
      if (liveTimer.current) window.clearTimeout(liveTimer.current);
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    };
  }, [value, setActivations, resetIdle, onPrediction]);

  // Pre-fill on mount with initial (used for example clicks)
  useEffect(() => {
    setValue(initial);
  }, [initial]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: easeCinematic, delay: 0.25 }}
    >
      <label htmlFor="mirror-input" className="sr-only">
        {t("title")}
      </label>
      <textarea
        id="mirror-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        // audit-fix: Task 10. Placeholder from i18n bundle so it
        // localizes with the rest of the room copy.
        placeholder={t("title")}
        rows={4}
        spellCheck={false}
        // audit-fix: Task 10. Soft cap; browser enforces.
        maxLength={MAX_LENGTH}
        className="font-editorial text-body w-full resize-none bg-transparent leading-[1.65] text-bone-cream italic placeholder:text-bone-cream/60 focus:outline-none"
        data-hover
      />
      <div
        aria-hidden
        className="bg-bone-cream/15 mt-1 h-px w-full overflow-hidden"
      >
        <motion.div
          className="bg-brass h-full"
          animate={{ width: settling ? "100%" : "0%" }}
          transition={{ duration: settling ? 0.9 : 0.3, ease: easeCinematic }}
        />
      </div>
      {/*
        audit-fix: Task 10. Visible character counter — small, brass,
        uppercase tracking, native to the existing caption typography.
        Stays subdued at /55 until 90% capacity, when it nudges brass
        to flag the soft cap is close.
      */}
      <div className="mt-2 flex justify-end">
        <Caption
          uppercase
          className={`tracking-[0.18em] tabular-nums ${
            value.length / MAX_LENGTH >= 0.9
              ? "text-brass"
              : "text-bone-cream/55"
          }`}
        >
          {t("charCounter", { used: value.length, max: MAX_LENGTH })}
        </Caption>
      </div>
      {/*
        audit-fix: Task 10. sr-only live region for screen readers.
        Populated with the localized "Predicting…" while inference is
        in-flight; cleared otherwise. role=status with aria-live=polite
        is the standard idiom — assistive tech announces transitions
        without stealing focus.
      */}
      <div role="status" aria-live="polite" className="sr-only">
        {settling ? t("predicting") : ""}
      </div>
      <MirrorLoadingMessage active={settling} />
    </motion.div>
  );
}
