"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { pathToRoomId, transitionStyle, type RoomId } from "@/lib/rooms";
import { anchorFor } from "@/lib/brainAnchors";
import { useTransitionState } from "@/lib/transitionState";
import { useBrainStageStore } from "@/store/useBrainStageStore";

/**
 * The orchestrator is mounted exactly once at the root layout. It owns
 * the room-to-room transition timeline:
 *
 *   1. Watch pathname changes (raw next/navigation pathname; the locale
 *      prefix is stripped inside `pathToRoomId`). We deliberately avoid
 *      next-intl's hook here because this component lives outside the
 *      NextIntlClientProvider so it can survive locale switches.
 *   2. On change, snapshot the previous room as `fromRoom` and the new
 *      one as `toRoom`, then set phase = "entering" so ScrollScene
 *      blocks back off while the brain glides.
 *   3. Apply the destination anchor to the brain store. The brain
 *      itself lerps in its own useFrame loop, so motion stays smooth.
 *   4. After the budget elapses (~800ms standard, longer for the
 *      deep-descent into Cellular and the return-to-surface), release
 *      to idle — ScrollScene blocks on the new page then take over.
 *
 * Reduced motion (`prefers-reduced-motion: reduce`) snaps the budget
 * to ~80ms so the brain still ends up in the right place without
 * choreographing motion the user has explicitly asked us to skip.
 */

const STANDARD_BUDGET_MS = 800;
const DEEP_BUDGET_MS = 1200;
const REDUCED_MOTION_BUDGET_MS = 80;

function durationFor(
  style: ReturnType<typeof transitionStyle>,
  reducedMotion: boolean,
): number {
  if (reducedMotion) return REDUCED_MOTION_BUDGET_MS;
  if (style === "deep-descent" || style === "return-to-surface") {
    return DEEP_BUDGET_MS;
  }
  return STANDARD_BUDGET_MS;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function TransitionOrchestrator() {
  const pathname = usePathname();
  const setSnap = useTransitionState((s) => s.set);
  const resetToIdle = useTransitionState((s) => s.resetToIdle);

  const setTransform = useBrainStageStore((s) => s.setTransform);
  const setLighting = useBrainStageStore((s) => s.setLighting);
  const setMeshResolution = useBrainStageStore((s) => s.setMeshResolution);
  const setVisible = useBrainStageStore((s) => s.setVisible);

  const previousRoom = useRef<RoomId | null>(null);
  const initialised = useRef(false);
  // Separate handles: anchorTimer is the per-style pre-anchor delay,
  // releaseTimer is the budget that returns the machine to idle.
  const anchorTimer = useRef<number | null>(null);
  const releaseTimer = useRef<number | null>(null);

  useEffect(() => {
    const room = pathToRoomId(pathname);

    // First mount — wire the initial room without animating.
    if (!initialised.current) {
      initialised.current = true;
      previousRoom.current = room;
      const a = anchorFor(room);
      setTransform({ position: a.position, scale: a.scale, rotation: a.rotation });
      setLighting(a.lighting);
      setMeshResolution(a.meshResolution);
      setVisible(a.visible);
      resetToIdle(room);
      return;
    }

    // Same room (e.g. /mirror#hash → /mirror) — nothing to choreograph.
    if (previousRoom.current === room) return;

    const fromRoom = previousRoom.current ?? room;
    previousRoom.current = room;

    const style = transitionStyle(fromRoom, room);
    const reduced = prefersReducedMotion();
    const budget = durationFor(style, reduced);

    // Cancel any in-flight timers from a rapid earlier navigation —
    // we always want the most recent destination to win.
    if (anchorTimer.current !== null) {
      window.clearTimeout(anchorTimer.current);
      anchorTimer.current = null;
    }
    if (releaseTimer.current !== null) {
      window.clearTimeout(releaseTimer.current);
      releaseTimer.current = null;
    }

    setSnap({
      phase: "entering",
      fromRoom,
      toRoom: room,
      startedAt: Date.now(),
    });

    const applyAnchor = () => {
      const a = anchorFor(room);
      setTransform({ position: a.position, scale: a.scale, rotation: a.rotation });
      setLighting(a.lighting);
      setMeshResolution(a.meshResolution);
      setVisible(a.visible);
      anchorTimer.current = null;
    };

    if (style === "deep-descent" && !reduced) {
      // Hold the previous anchor briefly so the door's brain pulse
      // reads before we glide into Cellular's hidden state.
      anchorTimer.current = window.setTimeout(applyAnchor, 200);
    } else if (style === "return-to-surface" && !reduced) {
      // Coming back from Cellular: flip visibility on immediately so
      // the surface anchor has somewhere to glide into.
      setVisible(true);
      anchorTimer.current = window.setTimeout(applyAnchor, 16);
    } else {
      applyAnchor();
    }

    releaseTimer.current = window.setTimeout(() => {
      resetToIdle(room);
      releaseTimer.current = null;
    }, budget);

    return () => {
      if (anchorTimer.current !== null) {
        window.clearTimeout(anchorTimer.current);
        anchorTimer.current = null;
      }
      if (releaseTimer.current !== null) {
        window.clearTimeout(releaseTimer.current);
        releaseTimer.current = null;
      }
    };
  }, [
    pathname,
    setSnap,
    resetToIdle,
    setTransform,
    setLighting,
    setMeshResolution,
    setVisible,
  ]);

  return null;
}
