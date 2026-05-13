"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { easeCinematic } from "@/lib/animations";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import { fakePredict, type Prediction } from "@/lib/fakePredictor";
import { inferText } from "@/lib/tribeClient";
import MirrorLoadingMessage from "./MirrorLoadingMessage";

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
    }, 300);

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
        Paste any text to see the predicted brain response.
      </label>
      <textarea
        id="mirror-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something. Anything."
        rows={4}
        spellCheck={false}
        className="font-editorial text-body w-full resize-none bg-transparent leading-[1.65] text-bone-cream italic placeholder:text-bone-cream/30 focus:outline-none"
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
      <MirrorLoadingMessage active={settling} />
    </motion.div>
  );
}
