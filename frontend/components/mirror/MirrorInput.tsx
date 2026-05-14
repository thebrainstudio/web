"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { easeCinematic } from "@/lib/animations";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import { fakePredict, type Prediction } from "@/lib/fakePredictor";
import {
  isRealTribe,
  predictWithFallback,
  type EncoderResult,
} from "@/lib/api/brain-encoder";
import { Caption } from "@/components/typography/Typography";
import MirrorLoadingMessage from "./MirrorLoadingMessage";
import AttributionChip, {
  type AttributionState,
} from "./AttributionChip";

// audit-fix: Task 10. Soft cap on textarea content — keeps prediction
// requests bounded and prevents accidental long-paste failures.
const MAX_LENGTH = 5000;
// phase-10: Settle debounce — 400 ms is "the thought is finishing"
// per the design-critic brief. Earlier audit had 350 ms for the live
// pre-update; we keep that too so the brain breathes as the user types.
const LIVE_DEBOUNCE_MS = 350;
const SETTLE_DEBOUNCE_MS = 400;

/**
 * If NEXT_PUBLIC_TRIBE_API_BASE is configured at build time, the site
 * was deployed pointing at a tunneled TRIBE backend. That state
 * determines whether the attribution chip's "TRIBE engine online"
 * status is even reachable.
 */
const TRIBE_BACKEND_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_TRIBE_API_BASE);

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
  const locale = useLocale();
  const [value, setValue] = useState(initial);
  const [settling, setSettling] = useState(false);
  // phase-10: track which engine produced the last settled response so
  // the AttributionChip can show TRIBE vs baseline honestly.
  const [attribution, setAttribution] = useState<AttributionState>(
    TRIBE_BACKEND_CONFIGURED ? "tribe-live" : "baseline-only",
  );
  const setActivations = useBrainStageStore((s) => s.setActivations);
  const resetIdle = useBrainStageStore((s) => s.resetIdle);

  const liveTimer = useRef<number | null>(null);
  const settleTimer = useRef<number | null>(null);
  // phase-10: in-flight request controller so rapid typing cancels the
  // previous request before firing a new one.
  const inflightController = useRef<AbortController | null>(null);

  useEffect(() => {
    if (liveTimer.current) window.clearTimeout(liveTimer.current);
    if (settleTimer.current) window.clearTimeout(settleTimer.current);

    if (value.trim().length < 3) {
      resetIdle();
      setSettling(false);
      if (inflightController.current) {
        inflightController.current.abort();
        inflightController.current = null;
      }
      return;
    }

    setSettling(true);

    liveTimer.current = window.setTimeout(() => {
      const pred = fakePredict(value);
      setActivations(pred.activations as Record<string, number>);
    }, LIVE_DEBOUNCE_MS);

    settleTimer.current = window.setTimeout(async () => {
      // Abort any in-flight inference from a previous keystroke and
      // start a new one.
      if (inflightController.current) {
        inflightController.current.abort();
      }
      const controller = new AbortController();
      inflightController.current = controller;

      const local = fakePredict(value);
      let remote: EncoderResult | null = null;
      try {
        remote = await predictWithFallback(value, locale, {
          signal: controller.signal,
        });
      } catch (err) {
        // predictWithFallback never throws under normal operation, but
        // guard anyway so the experience continues to work.
        console.debug("[mirror] predict failed, using fakePredict", err);
      }

      // If the request was aborted by a newer keystroke, do nothing.
      if (controller.signal.aborted) return;

      const merged: Prediction = remote
        ? {
            activations: remote.activations as Record<string, number>,
            features: local.features,
          }
        : local;
      setActivations(merged.activations as Record<string, number>);
      onPrediction(value, merged);
      setSettling(false);

      // phase-10: update attribution chip with honesty.
      if (remote && isRealTribe(remote.model_version)) {
        setAttribution("tribe-live");
      } else if (TRIBE_BACKEND_CONFIGURED) {
        setAttribution("baseline-fallback");
      } else {
        setAttribution("baseline-only");
      }

      // Clear the controller if it's still the one we own (a later
      // request may have replaced it).
      if (inflightController.current === controller) {
        inflightController.current = null;
      }
    }, SETTLE_DEBOUNCE_MS);

    return () => {
      if (liveTimer.current) window.clearTimeout(liveTimer.current);
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
      if (inflightController.current) {
        inflightController.current.abort();
        inflightController.current = null;
      }
    };
  }, [value, setActivations, resetIdle, onPrediction, locale]);

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
      {/*
        phase-10: honest attribution chip. License CC-BY-NC-4.0 §3.a.1
        requires retaining creator + paper + model-card + license URL
        whenever the licensed material is shared. The chip surfaces all
        four when TRIBE is live, and degrades honestly to "running on
        baseline" otherwise.
      */}
      <AttributionChip state={attribution} />
    </motion.div>
  );
}
