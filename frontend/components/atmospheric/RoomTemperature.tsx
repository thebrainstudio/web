"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { pathToRoomId, type RoomId } from "@/lib/rooms";

/**
 * Per-room colour temperature.
 *
 * Writes a CSS custom property `--temperature-filter` on the
 * <html> element. The layout wraps <main> with
 * `style={{ filter: 'var(--temperature-filter, none)' }}`, so any
 * change here updates the whole room on route change without a
 * rebuild.
 *
 * The values are subtle — the reader shouldn't consciously notice;
 * they should feel they've entered a different room. Four rooms
 * carry intentional shifts; the rest stay neutral.
 */

// hue-rotate + brightness + sepia tweaks per the brief. No hue shift
// outside the existing palette — we're nudging the light, not
// recoloring.
const ROOM_FILTERS: Partial<Record<RoomId, string>> = {
  mirror: "hue-rotate(-2deg) brightness(1.02)",
  music: "sepia(0.05) brightness(1.0)",
  threshold: "sepia(0.12) brightness(0.96)",
  cellular: "hue-rotate(2deg) brightness(1.04) saturate(0.95)",
};

export default function RoomTemperature() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const room = pathToRoomId(pathname);
    // Reactivity-pass note: when the room has no filter (home,
    // bridges, etc.) write `brightness(1)` rather than `none` —
    // the keyword `none` inside a multi-function filter chain
    // invalidates the entire property. brightness(1) is a no-op.
    const filter = ROOM_FILTERS[room] ?? "brightness(1)";
    document.documentElement.style.setProperty(
      "--temperature-filter",
      filter,
    );
    // No cleanup — the next route change overwrites the value,
    // and unmounting the provider would leave a stale filter,
    // which is worse than over-applying briefly on transition.
  }, [pathname]);

  return null;
}
