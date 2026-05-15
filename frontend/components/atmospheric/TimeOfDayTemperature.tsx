"use client";

import { useEffect } from "react";

/**
 * Reactivity-pass Fix 10 — time-of-day temperature filter.
 *
 * Reads the system clock on mount and once per hour after, writes a
 * CSS custom property `--time-temperature` on `<html>` that the
 * locale layout composes into the `<main>` filter stack alongside
 * the per-room `--temperature-filter`. The reader at 2 a.m. gets a
 * candlelit version of every room.
 *
 * Bands (from the brief):
 *   06–11 morning   brightness(1.02)
 *   11–17 daylight  none
 *   17–21 evening   sepia(0.04) brightness(0.99)
 *   21–06 night     sepia(0.10) brightness(0.94) saturate(0.95)
 *
 * Naive hour bands — geolocation/sunrise-sunset is deferred to the
 * backlog (TODO.md item 7) because it requires lat/long permission.
 *
 * Compounds with:
 *   --temperature-filter   (Fix 4, per-room)
 *   --deep-night-filter    (Fix 14, D toggle)
 *   --threshold-warm       (Fix 13, scroll on /threshold)
 *
 * Composition lives on `<main>` in `app/[locale]/layout.tsx`.
 */

const NIGHT = "sepia(0.10) brightness(0.94) saturate(0.95)";
const EVENING = "sepia(0.04) brightness(0.99)";
const MORNING = "brightness(1.02)";
// `brightness(1)` instead of `none` — the keyword `none` inside a
// multi-function filter chain on <main> invalidates the entire
// property, so each slot must always be a valid filter function.
const DAYLIGHT = "brightness(1)";

function bandForHour(hour: number): string {
  if (hour >= 6 && hour < 11) return MORNING;
  if (hour >= 11 && hour < 17) return DAYLIGHT;
  if (hour >= 17 && hour < 21) return EVENING;
  return NIGHT; // 21–24 and 0–6
}

export default function TimeOfDayTemperature() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const apply = () => {
      const hour = new Date().getHours();
      document.documentElement.style.setProperty(
        "--time-temperature",
        bandForHour(hour),
      );
    };
    apply();
    // Re-read once per hour. Cheap enough we don't need to align to
    // the top of the hour — the band changes every few hours and the
    // visual delta is small.
    const id = window.setInterval(apply, 60 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  return null;
}
