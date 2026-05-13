"use client";

import { regions, type RegionId } from "@/lib/regions";

type Props = {
  activations: Partial<Record<RegionId, number>>;
  label: string;
  /** Class for an outer wrapper if you want to override sizing. */
  className?: string;
  /** When false, draw a desaturated brass-only palette (the "weakened" side). */
  vivid?: boolean;
};

/**
 * 2D stylized brain map. Renders the 20 region nodes as dots in a soft
 * brass-traced outline. Color and radius scale with activation. Designed
 * to be readable at small sizes for side-by-side comparison.
 *
 * Coordinates: regions.position gives (x, y, z) in [-1, 1]. We project to
 * 2D by taking (x, y) and scaling into the viewbox. Front-of-brain (z>0)
 * gets a small radius bump so the projection feels less flat.
 */
export default function BrainMap2D({
  activations,
  label,
  className = "",
  vivid = true,
}: Props) {
  const VB = 220;

  function color(a: number) {
    if (!vivid) return `rgba(201, 169, 97, ${0.3 + a * 0.7})`;
    if (a <= 0.01) return "#1a2444";
    if (a < 0.5) {
      const k = a / 0.5;
      // cyan → amber
      return rgbMix("#5cc8d6", "#e8a04a", k);
    }
    const k = (a - 0.5) / 0.5;
    return rgbMix("#e8a04a", "#8b3a3a", k);
  }

  return (
    <figure className={className}>
      <svg
        viewBox={`-${VB / 2} -${VB / 2} ${VB} ${VB}`}
        width="100%"
        height="100%"
        aria-label={`${label} predicted activation`}
        role="img"
      >
        {/* Brass outline: a soft squashed ellipse standing in for the brain. */}
        <ellipse
          cx={0}
          cy={-2}
          rx={92}
          ry={70}
          fill="none"
          stroke="#c9a961"
          strokeOpacity={0.18}
          strokeWidth={0.6}
        />
        <ellipse
          cx={0}
          cy={28}
          rx={28}
          ry={20}
          fill="none"
          stroke="#c9a961"
          strokeOpacity={0.18}
          strokeWidth={0.6}
        />
        {/* Hemispheric midline */}
        <line
          x1={0}
          y1={-65}
          x2={0}
          y2={48}
          stroke="#c9a961"
          strokeOpacity={0.12}
          strokeWidth={0.4}
          strokeDasharray="2 3"
        />

        {regions.map((r) => {
          const a = activations[r.id] ?? 0;
          const cx = r.position[0] * 80;
          const cy = -r.position[1] * 60 + 2; // invert y for SVG; lift slightly
          const front = r.position[2];
          const baseR = 2.6 + a * 4.4 + Math.max(0, front) * 0.8;
          return (
            <g key={r.id}>
              <circle cx={cx} cy={cy} r={baseR + 4} fill={color(a)} opacity={0.18 + a * 0.3} />
              <circle cx={cx} cy={cy} r={baseR} fill={color(a)} />
            </g>
          );
        })}
      </svg>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}

function rgbMix(a: string, b: string, k: number) {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);
  const r = Math.round(ar + (br - ar) * k);
  const g = Math.round(ag + (bg - ag) * k);
  const bl = Math.round(ab + (bb - ab) * k);
  return `rgb(${r}, ${g}, ${bl})`;
}
