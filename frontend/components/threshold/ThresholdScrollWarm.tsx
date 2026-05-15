"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Reactivity-pass Fix 13 — reading-depth as colour temperature drift
 * on /en/threshold.
 *
 * As the reader descends the three movements, the page warms
 * imperceptibly. Linear interpolation tied to scroll progress over
 * the article height, written into `--threshold-warm` on `<html>`
 * so it composes into the `<main>` filter stack alongside the
 * per-room Fix 4 temperature.
 *
 * Top of page         → `none`
 * Bottom of movement 3 → `sepia(0.06) brightness(0.96)`
 *
 * Fix 4 already adds the base `sepia(0.12) brightness(0.96)` to the
 * room — this stacks on top, so the bottom of the article shows
 * roughly `sepia(0.18) brightness(0.92)` per the brief.
 *
 * Reduced motion: ScrollTrigger.scrub is set to false so the filter
 * snaps to the bottom value on enter and back on leave instead of
 * scrubbing — same destination, no animation.
 *
 * Resets `--threshold-warm` to `none` on unmount so navigating to
 * another room doesn't carry the warm tint over.
 */
export default function ThresholdScrollWarm({
  trigger,
}: {
  /** CSS selector or HTMLElement that bounds the article. */
  trigger: string | HTMLElement;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const root = document.documentElement;
    const apply = (progress: number) => {
      // Linear interpolation 0 → 1.
      // At progress 0 we write brightness(1) — a valid no-op
      // filter function. (Plain `none` would invalidate the whole
      // composed filter chain on <main>.)
      if (progress <= 0.001) {
        root.style.setProperty("--threshold-warm", "brightness(1)");
        return;
      }
      const sepia = (0.06 * progress).toFixed(3);
      const bright = (1 - 0.04 * progress).toFixed(3);
      root.style.setProperty(
        "--threshold-warm",
        `sepia(${sepia}) brightness(${bright})`,
      );
    };

    const st = ScrollTrigger.create({
      trigger: typeof trigger === "string" ? trigger : trigger,
      start: "top top",
      end: "bottom bottom",
      scrub: reduced ? false : 0.4,
      onUpdate: (self) => apply(self.progress),
      onEnter: () => apply(reduced ? 1 : 0),
      onLeaveBack: () => apply(0),
    });

    return () => {
      st.kill();
      // Same brightness(1) reasoning as above on unmount.
      root.style.setProperty("--threshold-warm", "brightness(1)");
    };
  }, [trigger]);

  return null;
}
