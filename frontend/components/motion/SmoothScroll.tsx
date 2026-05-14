"use client";

import { useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll plumbing.
 *
 * History (May 2026): we used to mount Lenis at the document level and
 * drive ScrollTrigger from its lerped scroll position. The cinematic
 * feel was nice on the home page hero, but on prose-heavy pages
 * (/archetypes, /threshold, /field-notes, /depth-psychology,
 * /atlas/[regionId]) the lerp made every wheel tick feel like
 * wading. Users reported "stuck scrolling" twice; tuning Lenis
 * (lerp 0.16 / duration 0.85) helped but didn't fully solve it.
 *
 * Decision: drop Lenis entirely. Use native scroll on every page.
 * The browser/OS handles wheel + trackpad inertia natively, which
 * is faster, snappier, and matches every other site the reader
 * uses. GSAP ScrollTrigger continues to work — it polls scroll
 * position from the native event by default — so the home page's
 * PinnedSequence and ScrollScene effects still fire.
 *
 * Reduced motion: ScrollTrigger still gets registered + refreshed,
 * so pinned sections render correctly. No additional change needed.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
    };
  }, []);

  return <>{children}</>;
}
