"use client";

import { useEffect, useState } from "react";

/**
 * Reactivity-pass Fix 12 — returning-visitor tracker.
 *
 * Single localStorage flag `bs_visited`. On the FIRST homepage visit
 * the flag is set after 30 s of intentional presence (visibility-
 * gated). On any subsequent visit the homepage hero gets one quiet
 * acknowledgment — `you came back.` — then crossfades to the normal
 * hero.
 *
 * The 30 s threshold matters: it filters out bounce-traffic where
 * the visitor saw the page for a second and left. A reader who
 * stayed half a minute gets the acknowledgment next time.
 *
 * Session-scoped replay guard: a `sessionStorage` flag prevents the
 * acknowledgment from re-firing on tab navigations within the same
 * session. (Reload the tab or open a new one → it can play once
 * more.)
 *
 * Reduced motion: returns `kind: 'normal'` immediately — the
 * acknowledgment is intrinsically motion-driven (800 ms hold + 1.2 s
 * crossfade) and dropping the animation would leave a flash of
 * surplus prose that reads as an error, not a gesture.
 *
 * Returns:
 *   kind: 'pending'  — SSR / pre-mount; render the hero normally
 *   kind: 'normal'   — first visit, or reduced motion, or guard active
 *   kind: 'opener'   — render the opener prelude, then HeroDisplay
 */

const VISITED_KEY = "bs_visited";
const SESSION_ACK_KEY = "bs_returning_acked";
const DWELL_MS_TO_VISIT = 30_000;

export type ReturningVisitorPhase = "pending" | "normal" | "opener";

export function useReturningVisitor(): ReturningVisitorPhase {
  const [phase, setPhase] = useState<ReturningVisitorPhase>("pending");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let visited = false;
    try {
      visited = localStorage.getItem(VISITED_KEY) === "true";
    } catch {
      // localStorage can throw in private-browsing on some
      // platforms — fall through as a first-time visitor.
    }
    let ackedThisSession = false;
    try {
      ackedThisSession = sessionStorage.getItem(SESSION_ACK_KEY) === "true";
    } catch {
      // ditto
    }

    if (visited && !ackedThisSession && !reduced) {
      setPhase("opener");
      try {
        sessionStorage.setItem(SESSION_ACK_KEY, "true");
      } catch {
        // ignore
      }
    } else {
      setPhase("normal");
    }

    // If not yet visited, start the 30 s dwell timer. The timer
    // pauses while the tab is hidden so a backgrounded tab doesn't
    // get credit for time the reader wasn't actually on the page.
    if (!visited) {
      let dwellMs = 0;
      let lastTick = performance.now();
      let raf: number | null = null;
      let cancelled = false;

      const tick = (now: number) => {
        if (cancelled) return;
        if (document.visibilityState === "visible") {
          dwellMs += now - lastTick;
        }
        lastTick = now;
        if (dwellMs >= DWELL_MS_TO_VISIT) {
          try {
            localStorage.setItem(VISITED_KEY, "true");
          } catch {
            // ignore
          }
          return; // stop ticking
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      return () => {
        cancelled = true;
        if (raf !== null) cancelAnimationFrame(raf);
      };
    }
  }, []);

  return phase;
}
