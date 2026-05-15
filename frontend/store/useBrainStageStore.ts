"use client";

import { create } from "zustand";

export type BrainLightingPreset = "cinematic" | "warm" | "clinical";
export type MeshResolution = "fsaverage5" | "fsaverage6";
/**
 * A11y Fix 8 — the cellular synapse phase machine. Exposed so the
 * `SynapsePhaseAnnouncer` can read it into a screen-reader live
 * region; the visual animation in `Synapse.tsx` stays the
 * authority on the underlying state.
 */
export type SynapsePhase =
  | "idle"
  | "travelling-ap"
  | "ca-influx"
  | "fusing"
  | "crossing"
  | "binding"
  | "afterglow";

export type Vec3 = readonly [number, number, number];

export type RegionActivations = Readonly<Record<string, number>>;

/**
 * PR-A (v1.0 real-fMRI pipeline). Parcel-level activations keyed by
 * HCP-MMP-360 parcel ID as a string (e.g. "44_L", "v23ab_R"). When
 * non-empty, BrainAnatomy renders per-parcel coloring (the new
 * authoritative path); when empty, the renderer falls back to the
 * 20-region `targetActivations` map so pages that haven't yet been
 * wired to load precomputed Neurosynth JSON still display.
 */
export type ParcelActivations = Readonly<Record<string, number>>;

export type BrainStageState = {
  targetPosition: Vec3;
  targetScale: number;
  targetRotation: Vec3;
  lighting: BrainLightingPreset;
  targetActivations: RegionActivations;
  /** PR-A: HCP-MMP-360 parcel-level activations (real Neurosynth data). */
  parcelActivations: ParcelActivations;
  /**
   * Visual-elevation Fix 2: timestamp of the last user interaction
   * (keystroke in Mirror, scrubber drag in Music, pair / language
   * toggle in Cross-Cultural, video timeupdate in Encoder). The
   * idle mesh-scale breathing in BrainAnatomy pauses for 2 s after
   * this value updates so the breath doesn't compete with the
   * reader's active engagement.
   */
  lastInteractionAt: number;
  visible: boolean;
  /**
   * Reactivity-pass Fix 17 + 18: global motion speed multiplier.
   *   1.0 — normal
   *   0.4 — slow-world (Shift held)
   *   0.0 — paused (Space toggle)
   * Every useFrame in the scene multiplies its `delta` by this value
   * before integrating; GSAP timelines tagged `data: "scene"` apply
   * the same scale via `gsap.globalTimeline.timeScale()`.
   */
  motionScale: number;
  /**
   * Reactivity-pass Fix 14: deep-night mode toggled by `D`. Drives
   * the `--deep-night-filter` CSS var, a +20% bloom multiplier, and
   * a slightly louder grain. Session-scoped — not persisted.
   */
  deepNight: boolean;
  /**
   * Reactivity-pass Fix 11: 0 = active, 1 = deep idle (no
   * interaction for 20 s). Drives slower breathing + the 4-group
   * region cycle in BrainAnatomy.
   */
  idleDepth: 0 | 1;
  /**
   * Reactivity-pass Fix 9: cursor proximity to the brain's
   * screen-space centre. `side` is the hemisphere the cursor is
   * closer to (or null when far). `intensity` ramps 0..1 as the
   * cursor crosses the 0.3-viewport-width threshold; activation
   * lift on the near hemisphere is capped at +15%.
   */
  cursorSide: "left" | "right" | null;
  cursorIntensity: number;
  /**
   * Reactivity-pass Fix 21: museum mode (Archetypes-only). Chrome
   * fades, current painting scales 1.4×, prose dims to 0.15.
   */
  museumMode: boolean;
  /**
   * Reactivity-pass Fix 14: FilmGrain reads this so deep-night
   * mode can lift grain 0.04 → 0.06 without re-render gymnastics.
   */
  grainOpacity: number;
  /**
   * A11y Fix 8: current synapse phase, mirrored from Synapse.tsx
   * so a screen-reader-only aria-live announcer can read it.
   * `null` when the Cellular page isn't mounted.
   */
  synapsePhase: SynapsePhase | null;
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
  /** PR-A: push HCP-MMP-360 parcel-level activations. */
  setParcelActivations: (p: ParcelActivations) => void;
  setMeshResolution: (r: MeshResolution) => void;
  setVisible: (v: boolean) => void;
  /**
   * Visual-elevation Fix 2: stamp `lastInteractionAt = Date.now()`.
   * Cheap (single setState); callers should fire on every user
   * input that engages the brain visualization.
   */
  markInteraction: () => void;
  resetIdle: () => void;
  /** Reactivity-pass Fix 17 + 18. */
  setMotionScale: (m: number) => void;
  /** Reactivity-pass Fix 14. */
  toggleDeepNight: () => void;
  setDeepNight: (on: boolean) => void;
  /** Reactivity-pass Fix 11. */
  setIdleDepth: (d: 0 | 1) => void;
  /** Reactivity-pass Fix 9. */
  setCursorProximity: (side: "left" | "right" | null, intensity: number) => void;
  /** Reactivity-pass Fix 21. */
  setMuseumMode: (on: boolean) => void;
  /** A11y Fix 8 — mirrored from Synapse.tsx phase machine. */
  setSynapsePhase: (p: SynapsePhase | null) => void;
};

const idleActivations: RegionActivations = Object.freeze({});
const idleParcels: ParcelActivations = Object.freeze({});

export const useBrainStageStore = create<BrainStageState>((set) => ({
  targetPosition: [0, 0, 0],
  targetScale: 1,
  targetRotation: [0, 0, 0],
  lighting: "cinematic",
  targetActivations: idleActivations,
  parcelActivations: idleParcels,
  lastInteractionAt: 0,
  visible: true,
  meshResolution: "fsaverage5",
  motionScale: 1,
  deepNight: false,
  idleDepth: 0,
  cursorSide: null,
  cursorIntensity: 0,
  museumMode: false,
  grainOpacity: 0.04,
  synapsePhase: null,

  setTransform: ({ position, scale, rotation }) =>
    set((s) => ({
      targetPosition: position ?? s.targetPosition,
      targetScale: scale ?? s.targetScale,
      targetRotation: rotation ?? s.targetRotation,
    })),

  setLighting: (preset) => set({ lighting: preset }),

  setActivations: (a) => set({ targetActivations: a }),

  setParcelActivations: (p) => set({ parcelActivations: p }),

  setMeshResolution: (r) => set({ meshResolution: r }),

  setVisible: (v: boolean) => set({ visible: v }),

  markInteraction: () => set({ lastInteractionAt: Date.now() }),

  resetIdle: () =>
    set({
      targetActivations: idleActivations,
      parcelActivations: idleParcels,
      lastInteractionAt: 0,
    }),

  setMotionScale: (m) => set({ motionScale: Math.max(0, Math.min(2, m)) }),

  toggleDeepNight: () =>
    set((s) => ({
      deepNight: !s.deepNight,
      grainOpacity: !s.deepNight ? 0.06 : 0.04,
    })),

  setDeepNight: (on) =>
    set({ deepNight: on, grainOpacity: on ? 0.06 : 0.04 }),

  setIdleDepth: (d) => set({ idleDepth: d }),

  setCursorProximity: (side, intensity) =>
    set({ cursorSide: side, cursorIntensity: Math.max(0, Math.min(1, intensity)) }),

  setMuseumMode: (on) => set({ museumMode: on }),

  setSynapsePhase: (p) => set({ synapsePhase: p }),
}));
