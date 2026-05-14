/**
 * PR-A — Typed fetch helpers for the precomputed Neurosynth-derived
 * HCP-MMP-360 parcel activation JSONs under `/shared/activations/`.
 *
 * Pages call one of these per-category helpers on mount to load
 * their activation file and push the parcel map into the store via
 * `useBrainStageStore.setParcelActivations`.
 *
 * The frontend is served from `/`, with `/shared/activations/`
 * mirrored to `frontend/public/activations/` at build time (see
 * `next.config.*` for the symlink/copy step). Until that copy step
 * is in place, this module also accepts a `basePath` override so
 * pages can be tested against any served URL.
 */

export type ParcelActivationFile = {
  id: string;
  source: string;
  license: string;
  citation: string;
  parcellation: string;
  methodology: string;
  composition: Array<[string, number]>;
  terms_used: string[];
  notes?: string;
  parcel_activations: Record<string, number>;
  top_regions_20: Array<{ region: string; activation: number }>;
};

const DEFAULT_BASE = "/activations";

/**
 * Generic loader. Pages should prefer the per-category helpers
 * below, which encode the directory shape.
 */
export async function loadActivation(
  category: string,
  id: string,
  basePath: string = DEFAULT_BASE,
): Promise<ParcelActivationFile | null> {
  const url = `${basePath}/${category}/${id}.json`;
  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) {
      if (typeof console !== "undefined") {
        console.warn(`[loadActivation] ${url} → ${res.status}`);
      }
      return null;
    }
    return (await res.json()) as ParcelActivationFile;
  } catch (err) {
    if (typeof console !== "undefined") {
      console.warn(`[loadActivation] ${url} failed`, err);
    }
    return null;
  }
}

export const loadAtlasActivation = (regionId: string) =>
  loadActivation("atlas", regionId);

export const loadPassageActivation = (passageId: string) =>
  loadActivation("passages", passageId);

export const loadMusicActivation = (trackId: string) =>
  loadActivation("music", trackId);

export const loadMandalaActivation = (mandalaId: string) =>
  loadActivation("mandalas", mandalaId);

export const loadCrossCulturalActivation = (
  pairId: string,
  language: "english" | "thai",
) => loadActivation("crosscultural", `${pairId}_${language}`);

export const loadBridgeActivation = (sectionId: string) =>
  loadActivation("bridges", sectionId);

export const loadTourActivation = (tourId: string) =>
  loadActivation("tours", tourId);
