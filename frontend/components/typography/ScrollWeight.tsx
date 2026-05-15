"use client";

import { useEffect } from "react";

/**
 * Visual-elevation Fix 8 — scroll-velocity font weight.
 *
 * Tracks window.scrollY deltas frame-to-frame and computes a
 * smoothed scroll speed. Maps that speed to a font wght axis
 * value in [380, 480], written as the CSS custom property
 * `--scroll-wght` on <html>. The Typography components for
 * Display and Heading consume this via `font-variation-settings:
 * "wght var(--scroll-wght, 400)"`.
 *
 * Result: scrolling fast visibly thickens the display lettering —
 * a film stock shifting under pressure. When the reader stops,
 * the weight settles back to 400 within 200 ms via
 * exponential decay, no spring rebound.
 *
 *   wght = lerp(400, 480, clamp(velocity / 4000, 0, 1))
 *
 * Velocity is px-per-second based on rAF dt; the constant is
 * tuned so casual scroll (touchpad / wheel) reaches about wght
 * 430, and aggressive flick scroll saturates at 480.
 *
 * Reduced-motion gate: stays pinned at 400. Mount is no-op.
 */
export default function ScrollWeight() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.style.setProperty("--scroll-wght", "400");
      return;
    }

    let raf = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let smoothed = 0;
    let current = 400;
    let stopped = true;

    const tick = (now: number) => {
      const dtMs = Math.max(1, now - lastT);
      const y = window.scrollY;
      const dy = Math.abs(y - lastY);
      const instSpeed = (dy / dtMs) * 1000; // px/sec
      // Smooth via 12-frame EMA-ish ramp; faster decay on stop.
      const k = dy > 0.1 ? 0.35 : 0.18;
      smoothed = smoothed + (instSpeed - smoothed) * k;
      // Map speed → wght 400..480. 4000 px/s saturates the axis.
      const target = 400 + Math.min(1, smoothed / 4000) * 80;
      // 200 ms ease-out to target — frame-rate independent lerp.
      const lerpK = Math.min(1, dtMs / 200);
      current = current + (target - current) * lerpK;
      document.documentElement.style.setProperty(
        "--scroll-wght",
        current.toFixed(1),
      );
      lastY = y;
      lastT = now;
      stopped = smoothed < 5 && Math.abs(current - 400) < 0.5;
      raf = stopped
        ? requestAnimationFrame(idle)
        : requestAnimationFrame(tick);
    };

    // While idle, rAF runs at low frequency until scroll resumes.
    const idle = (now: number) => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 0.5) {
        lastT = now;
        raf = requestAnimationFrame(tick);
      } else {
        raf = requestAnimationFrame(idle);
      }
    };

    raf = requestAnimationFrame(idle);
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
