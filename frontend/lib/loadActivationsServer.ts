/**
 * PR-A — Server-side loader for the precomputed Neurosynth-derived
 * parcel-activation JSONs. Reads from `frontend/public/activations/`
 * via filesystem at SSR/build time so the activation payload is
 * inlined in the page's RSC stream instead of triggering an extra
 * client-side fetch.
 *
 * For routes that need runtime fetching (e.g. when activations vary
 * by user input), use the client-side helpers in `loadActivations.ts`
 * instead.
 */

import fs from "node:fs";
import path from "node:path";
import type { ParcelActivationFile } from "./loadActivations";

const PUBLIC_ROOT = path.join(process.cwd(), "public", "activations");

export function loadActivationFromDisk(
  category: string,
  id: string,
): ParcelActivationFile | null {
  const fp = path.join(PUBLIC_ROOT, category, `${id}.json`);
  try {
    const raw = fs.readFileSync(fp, "utf-8");
    return JSON.parse(raw) as ParcelActivationFile;
  } catch {
    return null;
  }
}

export const loadAtlasActivationServer = (regionId: string) =>
  loadActivationFromDisk("atlas", regionId);

export const loadPassageActivationServer = (passageId: string) =>
  loadActivationFromDisk("passages", passageId);

export const loadMusicActivationServer = (trackId: string) =>
  loadActivationFromDisk("music", trackId);

export const loadMandalaActivationServer = (mandalaId: string) =>
  loadActivationFromDisk("mandalas", mandalaId);

export const loadCrossCulturalActivationServer = (
  pairId: string,
  language: "english" | "thai",
) => loadActivationFromDisk("crosscultural", `${pairId}_${language}`);

export const loadBridgeActivationServer = (sectionId: string) =>
  loadActivationFromDisk("bridges", sectionId);

export const loadTourActivationServer = (tourId: string) =>
  loadActivationFromDisk("tours", tourId);
