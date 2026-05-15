"use client";

import { useEffect } from "react";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import { useKeyboardCommands } from "@/hooks/useKeyboardCommands";
import { usePathname } from "@/i18n/navigation";
import { pathToRoomId } from "@/lib/rooms";

/**
 * Reactivity-pass Fix 21 — `M` toggles museum mode on /en/archetypes.
 *
 * Press M on Archetypes (anywhere outside an input) and:
 *   • SiteHeader + SiteFooter fade to opacity 0 over 600 ms (CSS
 *     rules on `body[data-museum="on"] [data-museum-chrome]`)
 *   • Archetype prose columns fade to opacity 0.15
 *   • The painting itself scales to 1.4× via transform (no layout
 *     reflow — reversibility matters)
 *   • Ken Burns keeps running at its current pace
 *   • Attribution stays at opacity 1 (overrides the dim rule)
 *
 * Press M again (or Esc) to exit. Esc is handled by the existing
 * NavigationCommands handler which guards against museumMode being
 * true — if it is, Esc here flips it off and the route-to-home
 * never fires.
 *
 * Listener is registered with `when: () => pathToRoomId(pathname) ===
 * "archetypes"` so M is a no-op everywhere else. The component
 * mounts only on the Archetypes page, but the predicate is the
 * safety belt — if a parent layout were to mount this elsewhere it
 * would still refuse.
 */
export default function MuseumMode() {
  const pathname = usePathname();
  const museumMode = useBrainStageStore((s) => s.museumMode);
  const setMuseumMode = useBrainStageStore((s) => s.setMuseumMode);

  // Body data-attribute sync. CSS rules read `body[data-museum]`.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.dataset.museum = museumMode ? "on" : "off";
    return () => {
      // On unmount (navigating away), drop museum mode so the next
      // page doesn't carry dimmed chrome.
      document.body.dataset.museum = "off";
      setMuseumMode(false);
    };
  }, [museumMode, setMuseumMode]);

  useKeyboardCommands([
    {
      id: "museum:toggle",
      key: "m",
      when: () => pathToRoomId(pathname) === "archetypes",
      onPress: () => setMuseumMode(!museumMode),
    },
    {
      // Esc exits museum mode first; NavigationCommands' Esc has
      // its own `when: !museumMode` guard so the route-to-home
      // never fires when museum mode is on.
      id: "museum:exit",
      key: "Escape",
      when: () =>
        pathToRoomId(pathname) === "archetypes" && museumMode,
      onPress: () => setMuseumMode(false),
    },
  ]);

  return null;
}
