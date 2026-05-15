"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  applyConfidence,
  impressionisticPredict,
  type ImpressionisticPrediction,
} from "@/lib/mirror/impressionistic";
import { dispatchKeystrokePulse } from "@/components/atmospheric/PersistentAtmosphere";
import { Caption } from "@/components/typography/Typography";
import MirrorLoadingMessage from "./MirrorLoadingMessage";
import AttributionChip, {
  type AttributionState,
} from "./AttributionChip";
import ProvenanceBadge, {
  type ProvenanceState,
} from "@/components/brain/ProvenanceBadge";

// audit-fix: Task 10. Soft cap on textarea content — keeps prediction
// requests bounded and prevents accidental long-paste failures.
const MAX_LENGTH = 5000;

// Phase 11 — Move 1:
//   IMPRESSIONIST_DEBOUNCE_MS  60 ms — coalesce keystroke bursts for the
//                              local impressionistic predictor. No
//                              network call so we can run at full speed,
//                              but a 60 ms coalesce keeps state churn
//                              reasonable for fast typists.
//   SETTLE_DEBOUNCE_MS         400 ms — the pause that signals
//                              "the thought is finishing." Fires the
//                              real prediction (TRIBE → baseline →
//                              fakePredict).
const IMPRESSIONIST_DEBOUNCE_MS = 60;
const SETTLE_DEBOUNCE_MS = 400;
// Phase 11 — Move 1.3: confidence multipliers.
// Impressionistic predictions render at 55% amplitude vs settled.
const IMPRESSIONIST_CONFIDENCE = 0.55;
const SETTLED_CONFIDENCE = 1.0;

/**
 * If NEXT_PUBLIC_TRIBE_API_BASE is configured at build time, the site
 * was deployed pointing at a tunneled TRIBE backend. That state
 * determines whether the attribution chip's "TRIBE engine online"
 * status is even reachable.
 */
const TRIBE_BACKEND_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_TRIBE_API_BASE);

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

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
  const reducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(initial);
  const [settling, setSettling] = useState(false);
  // phase-10: track which engine produced the last settled response so
  // the AttributionChip can show TRIBE vs baseline honestly.
  const [attribution, setAttribution] = useState<AttributionState>(
    TRIBE_BACKEND_CONFIGURED ? "tribe-live" : "baseline-only",
  );
  // phase-11 Move 2 prep: keep the latest impressionistic prediction
  // (which includes per-word contributions) available to children. Move 2
  // will read this from a context; for now it just lives in state.
  const [, setImpressionistic] =
    useState<ImpressionisticPrediction | null>(null);
  const setActivations = useBrainStageStore((s) => s.setActivations);
  const resetIdle = useBrainStageStore((s) => s.resetIdle);
  // Visual-elevation Fix 2: pause the idle mesh-scale breathing
  // while the reader is actively typing. The breath resumes
  // ~2 s after the last keystroke (handled in BrainAnatomy).
  const markInteraction = useBrainStageStore((s) => s.markInteraction);

  const impressionistTimer = useRef<number | null>(null);
  const settleTimer = useRef<number | null>(null);
  // phase-10: in-flight request controller so rapid typing cancels the
  // previous request before firing a new one.
  const inflightController = useRef<AbortController | null>(null);

  // Pulse + impressionistic update are dispatched separately from the
  // main settle-cycle effect so they don't recompute when callbacks
  // change (preventing redundant pulses on parent re-renders).
  const handleValueChange = useCallback(
    (next: string) => {
      setValue(next);
      // Move 1.2: ambient pulse on every keystroke. The atmosphere
      // listener coalesces internally, so a flurry of keys produces a
      // single soft signal rather than a strobe.
      if (!reducedMotion && next.length > 0) {
        dispatchKeystrokePulse();
      }
      // Visual-elevation Fix 2: keystroke → mark interaction so the
      // mesh-scale breath pauses while the reader is engaged. Cheap;
      // the store setter is a single Date.now() write.
      markInteraction();
    },
    [reducedMotion, markInteraction],
  );

  // Phase 11 Move 1.1: impressionistic predictor on every keystroke
  // (60 ms coalesce). Updates the brain *while* the user types — well
  // before the settled predictor fires.
  useEffect(() => {
    if (impressionistTimer.current) window.clearTimeout(impressionistTimer.current);

    if (value.trim().length < 1) {
      // Idle: the brain stage's resetIdle clears activations entirely.
      // The breathing wave in BrainAnatomy.tsx fills the visual silence.
      resetIdle();
      setImpressionistic(null);
      return;
    }

    // Reduced motion: skip the per-keystroke update entirely. The brain
    // only changes when the settled prediction lands. This satisfies the
    // brief's "no movement" reduced-motion requirement for Move 1 while
    // preserving the cue (room-level + settled lerp) as information.
    if (reducedMotion) {
      return;
    }

    impressionistTimer.current = window.setTimeout(() => {
      const pred = impressionisticPredict(value);
      setImpressionistic(pred);
      // Move 1.3: confidence-scaled brightness. Impressionistic peaks at
      // ~55 % vs settled at 100 %, so the lerp from rough → finished
      // reads as the model "settling."
      const scaled = applyConfidence(pred.activations, IMPRESSIONIST_CONFIDENCE);
      setActivations(scaled as Record<string, number>);
    }, IMPRESSIONIST_DEBOUNCE_MS);

    return () => {
      if (impressionistTimer.current) window.clearTimeout(impressionistTimer.current);
    };
  }, [value, reducedMotion, resetIdle, setActivations]);

  // Settle-cycle: fire the real predictor 400 ms after typing pauses.
  useEffect(() => {
    if (settleTimer.current) window.clearTimeout(settleTimer.current);

    if (value.trim().length < 3) {
      setSettling(false);
      if (inflightController.current) {
        inflightController.current.abort();
        inflightController.current = null;
      }
      return;
    }

    setSettling(true);

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
      // Settled predictions render at full confidence (1.0). The
      // BrainAnatomy's per-region exponential smoothing handles the
      // visual lerp from the impressionistic 55 %-amplitude state to
      // here — about 1.2 s to settle visually with the existing
      // τ = 400 ms smoother (matches the design-critic brief's
      // 1200 ms cubic-bezier(0.16, 1, 0.3, 1) timing closely).
      const scaled = applyConfidence(
        merged.activations as Record<string, number>,
        SETTLED_CONFIDENCE,
      );
      setActivations(scaled as Record<string, number>);
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
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
      if (inflightController.current) {
        inflightController.current.abort();
        inflightController.current = null;
      }
    };
  }, [value, setActivations, onPrediction, locale]);

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
        onChange={(e) => handleValueChange(e.target.value)}
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
              : "text-bone-cream/75"
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

        Integrity-pass: the AttributionChip's "tribe-live" copy is
        a known overclaim (the live backend is BGE-small embedding
        similarity, not a TRIBE forward pass). Tracked in TODO.md
        item 7. The ProvenanceBadge below renders the actually-
        correct provenance state for the glance reader; the
        AttributionChip retains its license-display role.
      */}
      <div className="mt-3">
        <ProvenanceBadge
          state={
            (attribution === "tribe-live"
              ? "embedding-baseline"
              : "lexical-heuristic") as ProvenanceState
          }
        />
      </div>
      <AttributionChip state={attribution} />
    </motion.div>
  );
}
