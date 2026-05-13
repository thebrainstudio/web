"use client";

import { create } from "zustand";

export type BrainLightingPreset = "cinematic" | "warm" | "clinical";

export type Vec3 = readonly [number, number, number];

export type RegionActivations = Readonly<Record<string, number>>;

export type BrainStageState = {
  /** Position in world units. */
  targetPosition: Vec3;
  /** Uniform scale. */
  targetScale: number;
  /** Euler rotation in radians. */
  targetRotation: Vec3;
  /** Lighting preset name. */
  lighting: BrainLightingPreset;
  /** Per-region activation 0..1. Region ids match `lib/regions.ts`. */
  targetActivations: RegionActivations;
  /** Whether to show the brain at all (e.g. fade out during error states). */
  visible: boolean;

  setTransform: (t: {
    position?: Vec3;
    scale?: number;
    rotation?: Vec3;
  }) => void;
  setLighting: (preset: BrainLightingPreset) => void;
  setActivations: (a: RegionActivations) => void;
  resetIdle: () => void;
};

const idleActivations: RegionActivations = Object.freeze({});

export const useBrainStageStore = create<BrainStageState>((set) => ({
  targetPosition: [0, 0, 0],
  targetScale: 1,
  targetRotation: [0, 0, 0],
  lighting: "cinematic",
  targetActivations: idleActivations,
  visible: true,

  setTransform: ({ position, scale, rotation }) =>
    set((s) => ({
      targetPosition: position ?? s.targetPosition,
      targetScale: scale ?? s.targetScale,
      targetRotation: rotation ?? s.targetRotation,
    })),

  setLighting: (preset) => set({ lighting: preset }),

  setActivations: (a) => set({ targetActivations: a }),

  resetIdle: () => set({ targetActivations: idleActivations }),
}));
