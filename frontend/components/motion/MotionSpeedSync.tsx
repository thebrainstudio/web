"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { useBrainStageStore } from "@/store/useBrainStageStore";

/**
 * Reactivity-pass — global motion-speed bridge.
 *
 * Reads `motionScale` from the brain store and mirrors it into two
 * places that R3F's useFrame can't reach on its own:
 *
 *   1. `--motion-speed` CSS custom property on `<html>` — CSS
 *      animations and SMIL can multiply their duration via
 *      `animation-duration: calc(var(--motion-speed) * 1s)` if they
 *      care to.
 *   2. `gsap.globalTimeline.timeScale(motionScale)` — every GSAP
 *      timeline on the site (ScrollTrigger scrubs, PinnedCinematic,
 *      ScrollScene tweens) inherits the scale unless they explicitly
 *      opt out by creating their own paused timeline.
 *
 * R3F's useFrame consumers (BrainAnatomy, Synapse, CursorLight) read
 * `motionScale` directly from the store via a `useRef` so the value
 * is sampled per-frame without re-rendering React.
 *
 * Mounted once at the locale layout alongside RoomTemperature and
 * ScrollWeight.
 */
export default function MotionSpeedSync() {
  const motionScale = useBrainStageStore((s) => s.motionScale);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty(
      "--motion-speed",
      motionScale.toFixed(3),
    );
    // GSAP's globalTimeline.timeScale accepts 0 (full pause). Any
    // tween created without an explicit timeline gets attached here
    // by default, so this single call rescales the entire GSAP
    // surface area in one shot.
    gsap.globalTimeline.timeScale(motionScale === 0 ? 0.000001 : motionScale);
  }, [motionScale]);

  return null;
}
