"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Mounts Lenis at the document level and syncs GSAP's ScrollTrigger
 * to its scroll position. Honors `prefers-reduced-motion`: when reduced,
 * skips Lenis entirely and lets the browser handle native scroll.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
    });

    // Drive ScrollTrigger from Lenis instead of native scroll.
    lenis.on("scroll", ScrollTrigger.update);

    // Hand the rAF loop to GSAP's ticker so timelines and Lenis share a clock.
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener("resize", refresh);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
