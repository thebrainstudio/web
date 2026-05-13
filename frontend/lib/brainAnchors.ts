/**
 * Per-room brain anchors. The orchestrator pre-positions the persistent
 * brain to a room's anchor the instant the URL changes, so the brain
 * isn't mid-glide when the new page's first ScrollScene fires.
 *
 * Each anchor matches the first ScrollScene of its room — the values
 * here are intentionally redundant with each page's opening
 * ScrollScene config. When you tune a room's opening shot, tune the
 * anchor in lockstep so the transition lands without a double-glide.
 */

import type { RoomId } from "./rooms";
import type {
  BrainLightingPreset,
  MeshResolution,
  Vec3,
} from "@/store/useBrainStageStore";

export type BrainAnchor = {
  position: Vec3;
  scale: number;
  rotation: Vec3;
  lighting: BrainLightingPreset;
  meshResolution: MeshResolution;
  /**
   * Whether the persistent macro brain should be visible while this
   * room is mounted. Only Cellular hides it; the scale-specific
   * canvases there own the visual field.
   */
  visible: boolean;
};

export const brainAnchors: Record<RoomId, BrainAnchor> = {
  home: {
    position: [0, 0, 0],
    scale: 1.0,
    rotation: [0, 0, 0],
    lighting: "cinematic",
    meshResolution: "fsaverage6",
    visible: true,
  },
  mirror: {
    position: [0, 0.9, 0],
    scale: 0.78,
    rotation: [0, 0.18, 0],
    lighting: "warm",
    meshResolution: "fsaverage5",
    visible: true,
  },
  music: {
    position: [0.8, 0.05, 0],
    scale: 0.82,
    rotation: [0, -0.28, 0],
    lighting: "warm",
    meshResolution: "fsaverage5",
    visible: true,
  },
  crosscultural: {
    position: [0.1, 0.05, 0],
    scale: 0.9,
    rotation: [0, 0.15, 0],
    lighting: "clinical",
    meshResolution: "fsaverage5",
    visible: true,
  },
  threshold: {
    position: [1.2, 0.6, 0],
    scale: 0.28,
    rotation: [0, -0.3, 0],
    lighting: "cinematic",
    meshResolution: "fsaverage5",
    visible: true,
  },
  archetypes: {
    position: [1.05, -0.45, 0],
    scale: 0.32,
    rotation: [0, 0.35, 0],
    lighting: "warm",
    meshResolution: "fsaverage5",
    visible: true,
  },
  cellular: {
    // Brain hides on Cellular — anchor values are still defined for
    // the fraction of a second between exit and visibility flip.
    position: [0, 0, 0],
    scale: 1.0,
    rotation: [0, 0, 0],
    lighting: "cinematic",
    meshResolution: "fsaverage5",
    visible: false,
  },
  about: {
    position: [0, 0.2, 0],
    scale: 0.95,
    rotation: [0, 0.12, 0],
    lighting: "cinematic",
    meshResolution: "fsaverage6",
    visible: true,
  },
  "field-notes": {
    position: [1.15, -0.4, 0],
    scale: 0.3,
    rotation: [0, -0.18, 0],
    lighting: "warm",
    meshResolution: "fsaverage5",
    visible: true,
  },
  atlas: {
    // Atlas pages render dense long-form prose; the persistent brain
    // glides to the upper-right as a small reference rather than the
    // page's centerpiece. Region-specific highlighting is applied
    // by the page itself via setActivations.
    position: [1.15, 0.55, 0],
    scale: 0.32,
    rotation: [0, -0.18, 0],
    lighting: "cinematic",
    meshResolution: "fsaverage5",
    visible: true,
  },
  bridges: {
    // Bridges is a prose-dominant essay; the brain sits small in the
    // upper-right like a reference figure in a printed paper. No
    // activations are applied by the page itself.
    position: [1.2, 0.55, 0],
    scale: 0.28,
    rotation: [0, -0.22, 0],
    lighting: "cinematic",
    meshResolution: "fsaverage5",
    visible: true,
  },
  tours: {
    // Tour player owns the brain. The index page and the player both
    // share this anchor as a starting frame — the player then writes
    // per-scene transforms over the top.
    position: [-0.3, 0, 0],
    scale: 1.0,
    rotation: [0, 0, 0],
    lighting: "cinematic",
    meshResolution: "fsaverage6",
    visible: true,
  },
};

export function anchorFor(room: RoomId): BrainAnchor {
  return brainAnchors[room];
}
