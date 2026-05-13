"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export type GlowPreset = "amber-lamp" | "cool-cathedral" | "oxblood-ember";
export type GlowPosition =
  | "top"
  | "top-left"
  | "top-right"
  | "center"
  | "bottom"
  | "bottom-left"
  | "bottom-right";
export type GlowIntensity = "subtle" | "medium" | "pronounced";

interface AtmosphericGlowProps {
  preset: GlowPreset;
  position?: GlowPosition;
  intensity?: GlowIntensity;
  animate?: boolean;
  className?: string;
}

const positionMap: Record<GlowPosition, { x: string; y: string }> = {
  top: { x: "50%", y: "-10%" },
  "top-left": { x: "20%", y: "10%" },
  "top-right": { x: "80%", y: "10%" },
  center: { x: "50%", y: "50%" },
  bottom: { x: "50%", y: "110%" },
  "bottom-left": { x: "20%", y: "90%" },
  "bottom-right": { x: "80%", y: "90%" },
};

const intensityMultiplier: Record<GlowIntensity, number> = {
  subtle: 0.6,
  medium: 1.0,
  pronounced: 1.4,
};

const presetDefaults: Record<GlowPreset, { o1: number; o2: number }> = {
  "amber-lamp": { o1: 0.15, o2: 0.05 },
  "cool-cathedral": { o1: 0.1, o2: 0.06 },
  "oxblood-ember": { o1: 0.12, o2: 0.04 },
};

/**
 * AtmosphericGlow — localized radial light pool.
 *
 * Three presets only:
 *   - `amber-lamp`     warm light from above; the "1920s research lab" anchor.
 *   - `cool-cathedral` dual-source cyan + oxblood; ambitious and cinematic.
 *                       (Ignores `position` — positions are fixed by design.)
 *   - `oxblood-ember`  single warm/dark accent for serious moments only.
 *
 * Reduced motion: `animate` is ignored and intensity drops one step.
 * Animate is hard soft-capped at 2 instances per page (dev console warning).
 */

let animatedInstanceCount = 0;
let warnedThisPage = false;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    animatedInstanceCount = 0;
    warnedThisPage = false;
  });
}

function step(intensity: GlowIntensity): GlowIntensity {
  if (intensity === "pronounced") return "medium";
  if (intensity === "medium") return "subtle";
  return "subtle";
}

export default function AtmosphericGlow({
  preset,
  position = "center",
  intensity = "medium",
  animate = false,
  className = "",
}: AtmosphericGlowProps) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const effectiveIntensity = prefersReduced ? step(intensity) : intensity;
  const effectiveAnimate = animate && !prefersReduced;

  useEffect(() => {
    if (!effectiveAnimate) return;
    if (process.env.NODE_ENV === "production") return;
    animatedInstanceCount += 1;
    if (animatedInstanceCount > 2 && !warnedThisPage) {
      warnedThisPage = true;
      console.warn(
        `[AtmosphericGlow] Detected ${animatedInstanceCount} animated glows on this page. ` +
          `The system spec caps animated glows at 2 per page. Static glows are unlimited.`,
      );
    }
    return () => {
      animatedInstanceCount = Math.max(0, animatedInstanceCount - 1);
    };
  }, [effectiveAnimate]);

  const m = intensityMultiplier[effectiveIntensity];
  const { o1: o1d, o2: o2d } = presetDefaults[preset];
  const o1 = +(o1d * m).toFixed(3);
  const o2 = +(o2d * m).toFixed(3);

  const { x: gx, y: gy } = positionMap[position];

  let background = "";
  if (preset === "amber-lamp") {
    background = `radial-gradient(ellipse 1200px 800px at ${gx} ${gy}, rgba(232, 160, 74, ${o1}) 0%, rgba(201, 169, 97, ${o2}) 40%, transparent 70%)`;
  } else if (preset === "cool-cathedral") {
    background = `radial-gradient(ellipse 1400px 900px at 30% 20%, rgba(92, 200, 214, ${o1}) 0%, transparent 60%), radial-gradient(ellipse 1000px 700px at 80% 90%, rgba(139, 58, 58, ${o2}) 0%, transparent 60%)`;
  } else {
    background = `radial-gradient(ellipse 900px 600px at ${gx} ${gy}, rgba(139, 58, 58, ${o1}) 0%, rgba(139, 58, 58, ${o2}) 40%, transparent 70%)`;
  }

  const inner = (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-[1] ${className}`}
      style={{ background }}
    />
  );

  if (!effectiveAnimate) return inner;

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-[1] ${className}`}
      animate={{ opacity: [0.85, 1.0, 0.85] }}
      transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
      style={{ background }}
    />
  );
}
