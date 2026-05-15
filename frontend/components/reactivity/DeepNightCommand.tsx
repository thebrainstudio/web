"use client";

import { useEffect } from "react";
import { useKeyboardCommands } from "@/hooks/useKeyboardCommands";
import { useBrainStageStore } from "@/store/useBrainStageStore";

/**
 * Reactivity-pass Fix 14 — `D` = deep night mode.
 *
 * The one keyboard shortcut admitted in the About page. Press `D`
 * (anywhere outside an input) to toggle a deeper candlelight state
 * for the rest of the session:
 *
 *   - --deep-night-filter on <html>:
 *       sepia(0.22) brightness(0.85) saturate(0.9)
 *   - FilmGrain opacity 0.04 → 0.06 (driven by store.grainOpacity)
 *   - Bloom intensity + radius bump by 20% (BrainStageClient reads
 *     store.deepNight and multiplies in JSX)
 *
 * Press `D` again to exit. Persists only for the session — no
 * localStorage write — because the brief calls it a felt mood, not
 * a saved preference.
 *
 * Implementation note: this component is the only place that knows
 * the deep-night filter string. The store holds only the boolean +
 * derived grain opacity; the filter live-string is composed here
 * and written to documentElement.
 */
const DEEP_NIGHT_FILTER = "sepia(0.22) brightness(0.85) saturate(0.9)";

export default function DeepNightCommand() {
  const deepNight = useBrainStageStore((s) => s.deepNight);
  const toggleDeepNight = useBrainStageStore((s) => s.toggleDeepNight);

  // Sync --deep-night-filter on <html> whenever the flag flips.
  // `brightness(1)` (not `none`) when off — keeps the multi-slot
  // filter chain on <main> valid.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty(
      "--deep-night-filter",
      deepNight ? DEEP_NIGHT_FILTER : "brightness(1)",
    );
  }, [deepNight]);

  useKeyboardCommands([
    {
      id: "deep-night",
      key: "d",
      onPress: () => toggleDeepNight(),
    },
  ]);

  return null;
}
