/**
 * Choreography for scroll-driven brain camera moves.
 *
 * Each scene describes brain transform + lighting + activation targets.
 * The home page composes these into a 5-shot cinema. Single source of
 * truth — the visual timeline is tunable without touching JSX.
 */

import type { RegionId } from "./regions";
import type {
  BrainLightingPreset,
  MeshResolution,
  Vec3,
} from "@/store/useBrainStageStore";
import { signaturePatterns } from "./regions";

export type ScrollSceneConfig = {
  id: string;
  brain: {
    position?: Vec3;
    scale?: number;
    rotation?: Vec3;
    activations?: Partial<Record<RegionId, number>>;
  };
  lighting?: BrainLightingPreset;
  /**
   * Which fsaverage resolution the brain should render at while this scene
   * is in view. Default is the interactive workhorse `fsaverage5`.
   * Hero cinematic moments (home Shot 1, about closing) request
   * `fsaverage6` for the higher polygon density.
   */
  meshResolution?: MeshResolution;
};

/**
 * Home page — 5 cinematic shots.
 * x: negative = left, positive = right.
 * y: negative = down, positive = up.
 * z: negative = away from camera, positive = toward.
 */
export const homeScrollChoreography: ScrollSceneConfig[] = [
  // Shot 1 — Cold open. Brain at center, large, materializing.
  // Hero shot → fsaverage6 (denser mesh, more cinematic shadow detail).
  {
    id: "shot-cold-open",
    brain: {
      position: [0, 0, 0],
      scale: 1.0,
      rotation: [0, 0, 0],
      activations: {},
    },
    lighting: "cinematic",
    meshResolution: "fsaverage6",
  },
  // Shot 2 — Brain glides to the left third, scales down. Warm lighting.
  {
    id: "shot-brain-left",
    brain: {
      position: [-1.05, 0, 0],
      scale: 0.7,
      rotation: [0, 0.35, 0],
      activations: {},
    },
    lighting: "warm",
  },
  // Shot 3 — Brain re-centers. Idle activation. Cinematic lighting returns.
  // Hover on room cards layers their signature patterns on top.
  {
    id: "shot-three-rooms",
    brain: {
      position: [0, 0, 0],
      scale: 1.0,
      rotation: [0, 0, 0],
      activations: {},
    },
    lighting: "cinematic",
  },
  // Shot 4 — Brain shrinks to top-right corner logomark.
  {
    id: "shot-insight-cards",
    brain: {
      position: [1.15, 0.55, 0],
      scale: 0.32,
      rotation: [0, -0.3, 0],
      activations: {},
    },
    lighting: "cinematic",
  },
  // Shot 5 — Re-center, large, "Begin." Hero again → fsaverage6.
  {
    id: "shot-begin",
    brain: {
      position: [0, 0, 0],
      scale: 1.08,
      rotation: [0, 0, 0],
      activations: {},
    },
    lighting: "cinematic",
    meshResolution: "fsaverage6",
  },
];

// Re-export for convenience.
export { signaturePatterns };
