/**
 * Curated track library for the NeuroMusic Lab.
 *
 * Each track ships with a *timeline* — a sequence of timestamped 20-region
 * activation snapshots. The scrubber interpolates between adjacent samples
 * so the brain breathes continuously as the user moves through a track.
 *
 * Actual audio files are TODO_CONTENT: rights to commercial recordings have
 * to come from the user. For Phase 6 the playback is silent — the room is
 * the brain–music coupling visualization, not music distribution. When
 * audio lands, drop the files at `public/audio/` and uncomment the `src`
 * field on each track.
 */

import type { RegionId } from "./regions";

export type ActivationFrame = {
  /** Seconds into the track. */
  t: number;
  /** 20-region activation snapshot. Missing regions default to 0. */
  a: Partial<Record<RegionId, number>>;
};

export type MusicTrack = {
  id: string;
  title: string;
  attribution: string;
  /** Style descriptor for the library card. */
  era: string;
  /** Two-line description that becomes a Body italic gloss. */
  framing: string;
  /** Total duration in seconds. */
  duration: number;
  /** Optional audio src under public/. When undefined, playback is silent. */
  src?: string;
  /** Region timeline. Must be sorted by `t`. */
  timeline: ActivationFrame[];
};

// Helper: linearly interpolate between two activation frames.
export function sampleTimeline(
  timeline: ActivationFrame[],
  t: number,
): Partial<Record<RegionId, number>> {
  if (timeline.length === 0) return {};
  if (t <= timeline[0].t) return timeline[0].a;
  if (t >= timeline[timeline.length - 1].t) {
    return timeline[timeline.length - 1].a;
  }
  let lo = 0;
  for (let i = 1; i < timeline.length; i++) {
    if (timeline[i].t >= t) {
      lo = i - 1;
      break;
    }
  }
  const hi = lo + 1;
  const a = timeline[lo];
  const b = timeline[hi];
  const k = (t - a.t) / (b.t - a.t);
  const out: Partial<Record<RegionId, number>> = {};
  const keys = new Set<RegionId>([
    ...(Object.keys(a.a) as RegionId[]),
    ...(Object.keys(b.a) as RegionId[]),
  ]);
  for (const id of keys) {
    const av = a.a[id] ?? 0;
    const bv = b.a[id] ?? 0;
    out[id] = av + (bv - av) * k;
  }
  return out;
}

export const musicTracks: MusicTrack[] = [
  {
    id: "sigur-ros-meditation",
    title: "Sigur Rós · Ágætis byrjun (excerpt)",
    attribution: "Sigur Rós, 1999",
    era: "Post-rock · ambient",
    framing:
      "A slow drone in falsetto. The default-mode network warms the way it does in meditation — not because there's a 'meditation circuit,' but because the listener stops trying to follow.",
    duration: 60,
    timeline: [
      { t: 0,  a: { hg_left: 0.32, hg_right: 0.34 } },
      { t: 6,  a: { hg_left: 0.55, hg_right: 0.6, pstg_right: 0.4 } },
      { t: 14, a: { hg_left: 0.66, hg_right: 0.72, pstg_right: 0.6, pcc: 0.5 } },
      { t: 22, a: { hg_left: 0.7, hg_right: 0.78, pstg_right: 0.68, pcc: 0.68, precuneus: 0.62, vmpfc: 0.5 } },
      { t: 32, a: { hg_left: 0.74, hg_right: 0.82, pstg_right: 0.72, pcc: 0.78, precuneus: 0.74, vmpfc: 0.62, dmpfc: 0.58 } },
      { t: 42, a: { hg_left: 0.72, hg_right: 0.8, pstg_right: 0.7, pcc: 0.82, precuneus: 0.8, vmpfc: 0.66, dmpfc: 0.64, agl_right: 0.55 } },
      { t: 52, a: { hg_left: 0.68, hg_right: 0.76, pstg_right: 0.66, pcc: 0.78, precuneus: 0.74, vmpfc: 0.6, dmpfc: 0.58, agl_right: 0.5 } },
      { t: 60, a: { hg_left: 0.6, hg_right: 0.7, pstg_right: 0.6, pcc: 0.7, precuneus: 0.66 } },
    ],
  },
  {
    id: "coltrane-naima",
    title: "John Coltrane · Naima (excerpt)",
    attribution: "John Coltrane, 1960",
    era: "Modal jazz",
    framing:
      "Built on a love letter. Auditory cortex tracks the melody; the amygdala and orbitofrontal regions weight the warmth — feeling and form arriving on the same beat.",
    duration: 60,
    timeline: [
      { t: 0,  a: { hg_left: 0.38, hg_right: 0.4 } },
      { t: 6,  a: { hg_left: 0.66, hg_right: 0.68, pstg_left: 0.55, pstg_right: 0.6 } },
      { t: 14, a: { hg_left: 0.74, hg_right: 0.78, pstg_left: 0.65, pstg_right: 0.7, vmpfc: 0.55, amyg_right: 0.5 } },
      { t: 22, a: { hg_left: 0.78, hg_right: 0.82, pstg_left: 0.72, pstg_right: 0.78, vmpfc: 0.68, amyg_right: 0.62, amyg_left: 0.55 } },
      { t: 32, a: { hg_left: 0.82, hg_right: 0.86, pstg_left: 0.78, pstg_right: 0.84, vmpfc: 0.78, amyg_right: 0.7, amyg_left: 0.66, atl_right: 0.55 } },
      { t: 42, a: { hg_left: 0.78, hg_right: 0.84, pstg_left: 0.74, pstg_right: 0.82, vmpfc: 0.72, amyg_right: 0.68, amyg_left: 0.62, atl_right: 0.58 } },
      { t: 52, a: { hg_left: 0.7, hg_right: 0.76, pstg_left: 0.66, pstg_right: 0.72, vmpfc: 0.62, amyg_right: 0.55 } },
      { t: 60, a: { hg_left: 0.6, hg_right: 0.66, pstg_right: 0.58 } },
    ],
  },
  {
    id: "thai-lullaby",
    title: "บทกล่อมเด็ก · A Thai lullaby (excerpt)",
    attribution: "traditional, arr. anonymous",
    era: "Thai folk · pentatonic",
    framing:
      "Pentatonic, low-tempo, sung close to the ear. The hippocampus carries the scene before the language regions arrive at the lyrics — the body remembers the song first.",
    duration: 60,
    timeline: [
      { t: 0,  a: { hg_left: 0.35, hg_right: 0.36 } },
      { t: 6,  a: { hg_left: 0.6, hg_right: 0.62, pstg_right: 0.5, hipp_left: 0.45, hipp_right: 0.46 } },
      { t: 14, a: { hg_left: 0.68, hg_right: 0.7, pstg_right: 0.62, hipp_left: 0.6, hipp_right: 0.6, vmpfc: 0.5 } },
      { t: 22, a: { hg_left: 0.72, hg_right: 0.74, pstg_right: 0.68, hipp_left: 0.7, hipp_right: 0.7, vmpfc: 0.58, atl_right: 0.5 } },
      { t: 32, a: { hg_left: 0.74, hg_right: 0.76, pstg_right: 0.72, hipp_left: 0.74, hipp_right: 0.74, vmpfc: 0.62, atl_right: 0.55, mtg_right: 0.5 } },
      { t: 42, a: { hg_left: 0.7, hg_right: 0.72, pstg_right: 0.68, hipp_left: 0.7, hipp_right: 0.7, vmpfc: 0.58, atl_right: 0.5 } },
      { t: 52, a: { hg_left: 0.62, hg_right: 0.66, pstg_right: 0.6, hipp_left: 0.6, hipp_right: 0.6 } },
      { t: 60, a: { hg_left: 0.5, hg_right: 0.55, hipp_left: 0.45 } },
    ],
  },
];

export const trackById = Object.fromEntries(
  musicTracks.map((t) => [t.id, t] as const),
) as Record<string, MusicTrack>;
