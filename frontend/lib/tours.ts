/**
 * Guided Tours — the cinematic 2-3 minute experiences in which the
 * persistent brain animates through a sequence of region activations
 * while narration scrolls beside it.
 *
 * A tour is a sequence of scenes. Each scene specifies which regions
 * are active and at what intensity, where the camera should be
 * looking, and what narration text accompanies the scene. The tour
 * player smoothly interpolates between scenes by writing the new
 * brain state into `useBrainStageStore` and letting the standard
 * `useFrame` lerping carry the visual transition.
 *
 * The first shipped tour is "the-act-of-remembering" (Bridges § 4 +
 * Atlas hippocampus). Future tours follow the same data shape.
 *
 * Authoring discipline:
 *   - Average reading speed in this contemplative register is
 *     ≈ 130-150 wpm. A 10-second scene therefore carries ≈ 22-25
 *     words of narration. Stay close to this.
 *   - Never "imagine if…" or "did you know…". Description and
 *     observation, in the site's voice.
 *   - Brain regions mentioned by name in narration should appear in
 *     the same scene's `activeRegions` so the image matches the text.
 */

import type { RegionId } from "./regions";
import type { BrainLightingPreset, Vec3 } from "@/store/useBrainStageStore";

/**
 * A single moment in the tour. The player linearly interpolates
 * between successive scenes; the duration is how long this scene is
 * the *current* scene before the next one becomes the target.
 */
export type TourScene = {
  /** Stable id within the tour — used for keyed React rendering. */
  id: string;
  /** Duration of this scene, in seconds (at 1× playback). */
  duration: number;
  /** Narration text. ≤ 30 words is a sane upper bound for any single scene. */
  narration: string;
  /**
   * Active regions for this scene. The brain store's setActivations
   * receives this object; absent regions go to 0.
   */
  activeRegions: Partial<Record<RegionId, number>>;
  /**
   * Brain transform for this scene. The persistent brain glides to
   * these values via the standard lerp loop in BrainAnatomy.
   */
  brainTransform: {
    position: Vec3;
    scale: number;
    rotation: Vec3;
  };
  lighting?: BrainLightingPreset;
};

export type Tour = {
  id: string;
  /** Headline shown on the index card and in the player. */
  title: string;
  /** One-line subtitle for the index card. */
  subtitle: string;
  /** Brief paragraph for the index card; not shown in the player. */
  blurb: string;
  /** Estimated total duration in seconds. Sum of scene durations. */
  estimatedDuration: number;
  /**
   * Path users continue to when the tour ends. Usually an Atlas page
   * or a Bridges section the tour expands.
   */
  continueHref?: string;
  continueLabel?: string;
  scenes: TourScene[];
};

/**
 * Compute the total tour duration from its scene list. Used by the
 * player progress bar and by the index card's duration display.
 */
export function tourDuration(tour: Tour): number {
  return tour.scenes.reduce((sum, s) => sum + s.duration, 0);
}

/**
 * For a tour and an elapsed time, return the active scene index and
 * the progress fraction (0..1) within that scene. Used by the player
 * to drive both the brain interpolation target and the progress bar.
 */
export function sceneAtTime(
  tour: Tour,
  elapsed: number,
): { sceneIndex: number; progressInScene: number; tourProgress: number } {
  let acc = 0;
  const total = tourDuration(tour);
  for (let i = 0; i < tour.scenes.length; i++) {
    const s = tour.scenes[i];
    if (elapsed < acc + s.duration) {
      return {
        sceneIndex: i,
        progressInScene: (elapsed - acc) / s.duration,
        tourProgress: Math.min(1, elapsed / total),
      };
    }
    acc += s.duration;
  }
  return {
    sceneIndex: tour.scenes.length - 1,
    progressInScene: 1,
    tourProgress: 1,
  };
}
