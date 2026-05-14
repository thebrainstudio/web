"use client";

import { useId } from "react";
import { regions, type RegionId } from "@/lib/regions";
import {
  COLORS,
  activationColor,
  activationBrightness,
} from "@/lib/brain/activation-palette";

type Props = {
  activations: Partial<Record<RegionId, number>>;
  label: string;
  /** Class for an outer wrapper if you want to override sizing. */
  className?: string;
  /** When false, draw a desaturated bone-only palette (the "weakened"
   *  side). The brain envelope still renders so the user can read the
   *  silence as deliberate emptiness rather than a missing visual. */
  vivid?: boolean;
};

/**
 * A top-down anatomical map of the 20 regions, drawn as a printed
 * scientific plate would render it.
 *
 * Design intent
 * =============
 * The earlier version used a cartoonish ellipse + flat dots. This
 * rewrite reads as an editorial illustration: a hand-traced top-down
 * brain silhouette in fine brass line work, landmarks (longitudinal
 * fissure, central sulci, cerebellum) sketched in at progressively
 * lower opacity, and region nodes rendered with radial-gradient
 * halos sharing the activation palette (`lib/brain/activation-
 * palette.ts`) the live WebGL brain uses.
 *
 * The "vivid vs. weakened" distinction (English-side vs. Thai-side)
 * is carried by two channels:
 *   - vivid:  full activation colour ramp on the dots, halos at full
 *             intensity. Reads as "the model has plenty to say."
 *   - !vivid: bone-cream-only dots at very low opacity; halos almost
 *             absent. The brain envelope stays. The visual statement
 *             becomes "the model is looking but cannot speak." Empty
 *             feels intentional, not unfinished.
 *
 * Coordinates
 * ===========
 * `regions[].position` gives 3D coords in [-1, 1]. The map projects
 * (x, y) into a 220×220 SVG viewport (-110 → 110). The z dimension
 * (anterior/posterior depth) modulates radius slightly so the
 * projection feels less flat — front-facing regions sit a touch
 * larger than back-facing ones.
 *
 * SVG ids
 * =======
 * Multiple instances live side-by-side on the Crosscultural page
 * (English and Thai panels). We scope `<defs>` ids per instance
 * with `useId()` so gradient references don't collide across maps.
 */
export default function BrainMap2D({
  activations,
  label,
  className = "",
  vivid = true,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const haloId = `dot-halo-${uid}`;
  const plateBgId = `plate-bg-${uid}`;
  const innerHighlightId = `dot-inner-${uid}`;

  // Top-down anatomical silhouette — two hemispheres as one closed
  // path. Asymmetric oval, slightly wider in the parietal middle,
  // narrower at the frontal pole, rounded occipital pole at the
  // back. Hand-tuned cubic Beziers; not derived from a real mesh
  // because the projection at this size needs to read as an
  // illustration rather than a topographically accurate trace.
  const BRAIN_OUTLINE =
    "M 0 -95 " +
    "C 26 -97, 55 -86, 74 -55 " +
    "C 88 -22, 92 22, 80 58 " +
    "C 64 86, 30 96, 0 96 " +
    "C -30 96, -64 86, -80 58 " +
    "C -92 22, -88 -22, -74 -55 " +
    "C -55 -86, -26 -97, 0 -95 Z";

  // Hemispheric (longitudinal) fissure — a near-straight ink line
  // with two subtle dorsal undulations so it doesn't read as a CAD
  // bisector.
  const LONGITUDINAL_FISSURE =
    "M 0 -92 C 2 -55, -2 -25, 0 0 C 2 25, -2 55, 0 92";

  // Central sulci — one per hemisphere, the diagonal furrow that
  // separates frontal lobe (motor) from parietal lobe (sensory).
  // The user won't read these as "central sulcus" but they make the
  // map feel like a textbook plate rather than a clipart oval.
  const CENTRAL_SULCUS_L = "M -8 -48 C -22 -36, -42 -22, -58 -8";
  const CENTRAL_SULCUS_R = "M 8 -48 C 22 -36, 42 -22, 58 -8";

  // Cerebellum hint — visible at the inferior-posterior pole when
  // viewed top-down. Drawn as a soft second curve outside the main
  // outline.
  const CEREBELLUM_ARC = "M -30 92 Q 0 110, 30 92";

  return (
    <figure className={className}>
      <svg
        viewBox="-115 -115 230 230"
        width="100%"
        height="100%"
        aria-label={`${label} predicted activation`}
        role="img"
      >
        <defs>
          {/* Plate background — a barely-there warm tint giving the
              map the feel of a printed leaf rather than a screen
              widget. Keeps the brass + bone vocabulary. */}
          <radialGradient id={plateBgId} cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#1a2444" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#0f1a30" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0a1428" stopOpacity="0" />
          </radialGradient>

          {/* Dot halo — soft radial fall-off. Each dot's <g> sets
              `color` via inline style, and the gradient uses
              `currentColor` so a single gradient definition recolours
              for every region. */}
          <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.65" />
            <stop offset="35%" stopColor="currentColor" stopOpacity="0.32" />
            <stop offset="70%" stopColor="currentColor" stopOpacity="0.1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>

          {/* Inner highlight — a small bright core at the dot's
              upper-left, giving each node a sense of dimensional
              "lit from above" surface rather than flat disc. */}
          <radialGradient id={innerHighlightId} cx="35%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Plate body — a faint inner card so the brain sits on
            something, like a museum specimen on its substrate. */}
        <rect
          x="-110"
          y="-110"
          width="220"
          height="220"
          rx="2"
          fill={`url(#${plateBgId})`}
        />

        {/* Cerebellum first (behind) so it reads as tucked under. */}
        <path
          d={CEREBELLUM_ARC}
          fill="none"
          stroke={COLORS.brass}
          strokeOpacity={vivid ? 0.18 : 0.1}
          strokeWidth={0.7}
          strokeLinecap="round"
        />

        {/* Brain envelope — fine brass ink line. */}
        <path
          d={BRAIN_OUTLINE}
          fill="none"
          stroke={COLORS.brass}
          strokeOpacity={vivid ? 0.32 : 0.18}
          strokeWidth={0.85}
          strokeLinejoin="round"
        />

        {/* Longitudinal fissure — slightly more visible than the
            sulci because it's the dominant midline. */}
        <path
          d={LONGITUDINAL_FISSURE}
          fill="none"
          stroke={COLORS.brass}
          strokeOpacity={vivid ? 0.22 : 0.12}
          strokeWidth={0.5}
        />

        {/* Central sulci — both hemispheres. Anatomical landmark for
            free; reads as "this is a real brain map" texture. */}
        <path
          d={CENTRAL_SULCUS_L}
          fill="none"
          stroke={COLORS.brass}
          strokeOpacity={vivid ? 0.14 : 0.08}
          strokeWidth={0.45}
        />
        <path
          d={CENTRAL_SULCUS_R}
          fill="none"
          stroke={COLORS.brass}
          strokeOpacity={vivid ? 0.14 : 0.08}
          strokeWidth={0.45}
        />

        {/* Region nodes — depth-sorted so closer ones paint over.
            We sort a shallow copy so the original regions module
            isn't mutated across re-renders. */}
        {[...regions]
          .sort((a, b) => a.position[2] - b.position[2])
          .map((r) => {
            const a = activations[r.id] ?? 0;
            const cx = r.position[0] * 78;
            // Invert y for SVG and lift slightly so the brain sits
            // visually centred in the viewBox.
            const cy = -r.position[1] * 62 + 4;
            const depth = (r.position[2] + 1) / 2;
            // Dot radius grows with activation; halo grows more
            // aggressively so active regions get a visible glow.
            const dotR = 2.4 + a * 3.4 + depth * 1.4;
            const haloR = 8 + a * 14 + depth * 2;

            const tint = vivid
              ? activationColor(a)
              : `rgba(212, 196, 168, ${0.35 + a * 0.4})`;
            const dotOpacity = vivid
              ? activationBrightness(a, depth)
              : 0.4 + a * 0.45;
            const haloOpacity = vivid ? Math.min(1, 0.5 + a * 0.55) : 0.18 + a * 0.25;

            return (
              <g key={r.id} style={{ color: tint }}>
                {/* Halo */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={haloR}
                  fill={`url(#${haloId})`}
                  opacity={haloOpacity}
                />
                {/* Solid dot */}
                <circle cx={cx} cy={cy} r={dotR} fill={tint} opacity={dotOpacity} />
                {/* Inner highlight — only on vivid side; the
                    weakened side reads more honestly without the
                    glossy "lit from above" affordance. */}
                {vivid && a > 0.15 && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={dotR}
                    fill={`url(#${innerHighlightId})`}
                  />
                )}
              </g>
            );
          })}
      </svg>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
