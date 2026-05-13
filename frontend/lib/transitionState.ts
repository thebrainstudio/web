"use client";

import { create } from "zustand";
import type { RoomId } from "./rooms";

/**
 * Phase machine for cinematic room transitions.
 *
 *   idle      → no transition in flight
 *   exiting   → user clicked a door; outgoing content is fading out,
 *               the brain is pulsing toward the destination anchor,
 *               but the route hasn't actually changed yet
 *   entering  → URL has flipped; the new page is mounting and the
 *               brain is gliding into the destination anchor
 *
 * The orchestrator (components/motion/TransitionOrchestrator.tsx) owns
 * the timeline. Pages and ScrollScene blocks check `phase !== "idle"`
 * before overriding the brain transform.
 *
 * Total budget per transition: ≈800ms (standard) / ≈1200ms (deep-descent
 * or return-to-surface). Reduced motion collapses both to <100ms.
 */

export type TransitionPhase = "idle" | "exiting" | "entering";

export type TransitionSnapshot = {
  phase: TransitionPhase;
  fromRoom: RoomId | null;
  toRoom: RoomId | null;
  startedAt: number;
};

export type TransitionState = TransitionSnapshot & {
  /** Move the machine forward. Touch only the fields you mean to set. */
  set: (next: Partial<TransitionSnapshot>) => void;
  /** Reset to idle without changing fromRoom (so atmospherics keep history). */
  resetToIdle: (currentRoom: RoomId) => void;
};

export const useTransitionState = create<TransitionState>((set) => ({
  phase: "idle",
  fromRoom: null,
  toRoom: null,
  startedAt: 0,
  set: (next) =>
    set((s) => ({
      phase: next.phase ?? s.phase,
      fromRoom: next.fromRoom !== undefined ? next.fromRoom : s.fromRoom,
      toRoom: next.toRoom !== undefined ? next.toRoom : s.toRoom,
      startedAt: next.startedAt ?? s.startedAt,
    })),
  resetToIdle: (currentRoom) =>
    set(() => ({
      phase: "idle",
      fromRoom: currentRoom,
      toRoom: currentRoom,
      startedAt: 0,
    })),
}));

/**
 * Non-hook getter. Use inside event handlers and useFrame loops where
 * Zustand selector subscriptions would cause unnecessary re-renders.
 */
export function getTransitionPhase(): TransitionPhase {
  return useTransitionState.getState().phase;
}
