"use client";

import { useEffect, useRef, useState } from "react";
import { useBrainStageStore } from "@/store/useBrainStageStore";

/**
 * Global film-grain overlay.
 *
 * Two paths:
 *
 *  - Desktop + motion-safe: 200×200 <canvas> redrawn at ~24 fps via
 *    requestAnimationFrame. Each frame fills an ImageData buffer
 *    with a fast PRNG into R/G/B/A, tinted bone-cream. mix-blend-
 *    overlay so it warms whatever is below rather than fleck white.
 *    24 fps not 60 — film grain is a 24 fps phenomenon and the
 *    lower rate is the point.
 *
 *  - Mobile (≤ 768 px) or prefers-reduced-motion: the previously-
 *    shipped static SVG fractal-noise tile. Same opacity, same
 *    blend mode, no per-frame work.
 *
 * Sits fixed-position, z-1000, pointer-events-none. Opacity 0.04.
 */

const STATIC_SVG =
  "data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.91  0 0 0 0 0.85  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";

// Bone-cream tint per channel (matches the static SVG's feColorMatrix).
const TINT_R = 0.95;
const TINT_G = 0.91;
const TINT_B = 0.85;

// Throttle to 24 fps. ~41.67 ms per frame.
const FRAME_MS = 1000 / 24;

const SIZE = 200;

export default function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  // Animated path mounts only after a client-side feature check; SSR
  // renders the static SVG and the canvas appears on hydration if
  // applicable. This avoids a flash on mobile where the canvas path
  // is never going to be used.
  const [animated, setAnimated] = useState(false);
  // Reactivity-pass Fix 14: deep-night lifts grain 0.04 → 0.06.
  const grainOpacity = useBrainStageStore((s) => s.grainOpacity);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isPhone = window.matchMedia("(max-width: 768px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isPhone && !reduce) setAnimated(true);
  }, []);

  useEffect(() => {
    if (!animated) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(SIZE, SIZE);
    const data = imageData.data;

    // Linear-congruential PRNG seed. Each frame walks the seed
    // forward; using a non-Math.random PRNG keeps the noise
    // hash-table-cheap and avoids garbage collection pressure.
    let seed = 1 | 0;
    const tick = (now: number) => {
      // Reactivity-pass Fix 17 + 18: grain freezes under Space-pause
      // and slows under Shift-hold along with the rest of the scene.
      // Sample motionScale via getState() to avoid re-subscribing.
      const motion = useBrainStageStore.getState().motionScale;
      // motion 0 → frame interval = ∞ (freeze); motion 0.4 → 10 fps
      // at the same FRAME_MS; motion 1 → 24 fps.
      const scaledFrameMs = motion === 0 ? Infinity : FRAME_MS / motion;
      if (now - lastTimeRef.current >= scaledFrameMs) {
        lastTimeRef.current = now;
        for (let i = 0; i < SIZE * SIZE; i++) {
          // Park–Miller LCG (cheap & non-zero); take top bits as noise.
          seed = (seed * 16807) % 2147483647;
          const n = (seed & 0xff) / 255;
          const o = i << 2;
          data[o] = (n * TINT_R * 255) | 0;
          data[o + 1] = (n * TINT_G * 255) | 0;
          data[o + 2] = (n * TINT_B * 255) | 0;
          data[o + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [animated]);

  if (!animated) {
    // Mobile or reduced-motion: same static SVG path that's shipped
    // since day one. No per-frame work.
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1000] mix-blend-overlay motion-safe:opacity-[0.04] motion-reduce:opacity-[0.02]"
        style={{
          backgroundImage: `url("${STATIC_SVG}")`,
          backgroundSize: "200px 200px",
        }}
      />
    );
  }

  // 200×200 internal canvas stretched to viewport via CSS. Noise is
  // scale-invariant; bilinear scaling softens the grain slightly,
  // which is what real film grain looks like. ~40 k pixel writes per
  // frame at 24 fps ≈ 960 k writes/sec — negligible.
  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      style={{ opacity: grainOpacity }}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1000] h-screen w-screen mix-blend-overlay"
    />
  );
}
