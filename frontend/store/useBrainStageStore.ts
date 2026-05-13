"use client";

import { create } from "zustand";

export type BrainLightingPreset = "cinematic" | "warm" | "clinical";
export type MeshResolution = "fsaverage5" | "fsaverage6";

export type Vec3 = readonly [number, number, number];

export type RegionActivations = Readonly<Record<string, number>>;

export type BrainStageState = {
  targetPosition: Vec3;
  targetScale: number;
  targetRotation: Vec3;
  lighting: BrainLightingPreset;
  targetActivations: RegionActivations;
  visible: boolean;
  /**
   * Which fsaverage mesh resolution the BrainAnatomy is currently rendering.
   * 'fsaverage6' (~82k vertices) is used for hero cinematic moments — home
   * and about. 'fsaverage5' (~20k vertices) is the interactive workhorse —
   * Mirror / Music / Cross-Cultural. Pages set this in their ScrollScene
   * effect; the BrainAnatomy lazy-loads the GLB it needs.
   */
  meshResolution: MeshResolution;

  setTransform: (t: {
    position?: Vec3;
    scale?: number;
    rotation?: Vec3;
  }) => void;
  setLighting: (preset: BrainLightingPreset) => void;
  setActivations: (a: RegionActivations) => void;
  setMeshResolution: (r: MeshResolution) => void;
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
  meshResolution: "fsaverage5",

  setTransform: ({ position, scale, rotation }) =>
    set((s) => ({
      targetPosition: position ?? s.targetPosition,
      targetScale: scale ?? s.targetScale,
      targetRotation: rotation ?? s.targetRotation,
    })),

  setLighting: (preset) => set({ lighting: preset }),

  setActivations: (a) => set({ targetActivations: a }),

  setMeshResolution: (r) => set({ meshResolution: r }),

  resetIdle: () => set({ targetActivations: idleActivations }),
}));
