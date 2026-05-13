"use client";

/**
 * Global film grain overlay. ~1KB inline SVG noise tinted bone-cream so it
 * warms navy instead of producing harsh white flecks. mix-blend-overlay
 * makes it interact with whatever is below.
 *
 * Sits above everything (z-1000) but ignores pointer events. The body's
 * vertical wash + the brain canvas + content all render beneath.
 *
 * Reduced-motion users get 2% opacity instead of 4% — same texture, gentler.
 * High-contrast users get the same drop via the prefers-contrast media
 * query in globals.css (background flattens to deep navy; grain stays).
 */
export default function FilmGrain() {
  const svg =
    "data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.91  0 0 0 0 0.85  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1000] motion-safe:opacity-[0.04] motion-reduce:opacity-[0.02] mix-blend-overlay"
      style={{
        backgroundImage: `url("${svg}")`,
        backgroundSize: "200px 200px",
      }}
    />
  );
}

/* Fallback alternative if SVG noise ever flagged on low-end devices:
   replace backgroundImage with a tiled 200×200 PNG checked into
   public/textures/film-grain.png and reference it with url('/textures/film-grain.png'). */
