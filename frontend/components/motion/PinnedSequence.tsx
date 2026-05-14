"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { easeCinematic } from "@/lib/animations";

type PinnedSequenceProps = {
  /** Number of pinned steps. */
  steps: number;
  /**
   * How much vertical scroll (in viewport-heights) each step consumes.
   * Default 0.7 = roughly 2/3 of a screen height per step. The old
   * default was 1.0 which felt sticky — readers reported feeling
   * "stuck" on the essay section because three steps demanded three
   * full screen-scrolls. 0.7 stays long enough to read a short step
   * without straining wrists.
   */
  stepDuration?: number;
  children: ReactNode;
  className?: string;
};

/**
 * Pins a section for `steps × stepDuration × 100vh` of scroll and
 * reveals each PinnedStep child in turn as scroll progresses. Reduced
 * motion bypasses the pin and crossfades the steps as the section
 * scrolls naturally.
 */
export default function PinnedSequence({
  steps,
  stepDuration = 0.7,
  children,
  className,
}: PinnedSequenceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const onChange = () => setPrefersReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!ref.current || prefersReduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      pin: innerRef.current,
      start: "top top",
      end: () => `+=${window.innerHeight * steps * stepDuration}`,
      scrub: true,
      onUpdate: (self) => setProgress(self.progress),
    });

    return () => {
      trigger.kill();
    };
  }, [steps, stepDuration, prefersReduced]);

  // Reduced motion: passive crossfade based on which step's window we're in.
  useEffect(() => {
    if (!prefersReduced || !ref.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 80%",
      end: "bottom 20%",
      onUpdate: (self) => setProgress(self.progress),
    });
    return () => trigger.kill();
  }, [prefersReduced]);

  const stepArray = Children.toArray(children).filter(isValidElement);
  const stepCount = stepArray.length;

  // Map progress 0..1 to current step index. Each step gets an equal slice.
  // Add a 6% threshold so the first step is visible from the start.
  const currentStep = Math.min(
    stepCount - 1,
    Math.max(0, Math.floor(progress * stepCount * 0.9999)),
  );

  // Fade the pinned content out as we approach the end of the pin range,
  // so it doesn't visually overlap the next section while still pinned at
  // top: fixed. 0 fade until 0.88, then linear ramp to 0 by 0.98.
  const fadeOut =
    progress < 0.88 ? 1 : Math.max(0, 1 - (progress - 0.88) / 0.1);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        height: prefersReduced ? "auto" : `${steps * stepDuration * 100}vh`,
      }}
    >
      <div
        ref={innerRef}
        style={{
          height: prefersReduced ? "auto" : "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          opacity: fadeOut,
          transition: "opacity 0.18s linear",
        }}
      >
        <AnimatePresence mode="wait">
          {stepArray.map((step, i) =>
            i === currentStep ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{
                  duration: 0.6,
                  ease: easeCinematic,
                }}
                style={{ position: "absolute", inset: 0 }}
              >
                {step}
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function PinnedStep({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}
