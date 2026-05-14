/**
 * Shared activation colour ramp.
 *
 * The same five-stop ramp the WebGL canvas uses in
 * `components/brain/BrainAnatomy.tsx`. Exported here so 2D
 * visualisations (e.g. `components/crosscultural/BrainMap2D.tsx`)
 * can paint regions in the same visual language as the live brain.
 *
 *   idle  → cool-gray  (#3d4a66)   surface always legible, never void
 *   cold  → deep blue  (#1e6cff)   BOLD just above baseline
 *   cool  → cyan       (#22d3ee)   rising activation
 *   warm  → yellow     (#fde047)   fMRI peak band
 *   hot   → orange-red (#ff4f1f)   hot
 */

export const COLORS = {
  idle: "#3d4a66",
  cold: "#1e6cff",
  cool: "#22d3ee",
  warm: "#fde047",
  hot: "#ff4f1f",
  brass: "#c9a961",
  cyan: "#5cc8d6",
  amber: "#e8a04a",
  oxblood: "#8b3a3a",
} as const;

function mix(a: string, b: string, t: number): string {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(bl)}`;
}

/**
 * Map a [0, 1] activation value to the same colour stops the WebGL
 * shader produces. Output is a CSS `#rrggbb` string ready to inline
 * into a `fill` attribute.
 */
export function activationColor(a: number): string {
  if (a <= 0.02) return COLORS.idle;
  if (a < 0.33) return mix(COLORS.idle, COLORS.cold, a / 0.33);
  if (a < 0.62) {
    const k = (a - 0.33) / 0.29;
    return mix(
      mix(COLORS.cold, COLORS.cool, k),
      COLORS.warm,
      Math.max(0, k - 0.5) * 2,
    );
  }
  if (a < 0.84) {
    const k = (a - 0.62) / 0.22;
    return mix(COLORS.warm, COLORS.hot, k * 0.6);
  }
  const k = (a - 0.84) / 0.16;
  return mix(COLORS.warm, COLORS.hot, 0.6 + k * 0.4);
}

/**
 * Per-region brightness multiplier. Idle regions are dim so the
 * brain reads as resting; active regions pop. Depth modulates so
 * back-of-head regions read slightly darker (faux-3D).
 *
 * Returns a number in (0, 1] usable as SVG `opacity`.
 */
export function activationBrightness(a: number, depth: number): number {
  const base = 0.4 + a * 0.6;
  const depthMul = 0.75 + depth * 0.25;
  return Math.min(1, base * depthMul);
}
