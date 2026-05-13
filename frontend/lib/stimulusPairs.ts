/**
 * Thai ↔ English stimulus pairs for the Cross-Cultural Brain room.
 *
 * The dramatic truth of this room is that TRIBE was trained on English
 * recordings, so when fed Thai it produces an *under-confident, scattered*
 * pattern. We simulate that here: the English prediction runs through our
 * normal fakePredict. The Thai prediction is the same text run through a
 * degraded predictor that attenuates the language regions, scatters small
 * activations across unrelated regions, and overall sits at a lower
 * amplitude. The divergence between the two is the field note.
 *
 * Real TRIBE inference in Phase 10 will replace this with actual model
 * outputs. The English-trained-model failure mode will then be real, not
 * simulated — and probably more interesting.
 */

import type { RegionId } from "./regions";
import { fakePredict } from "./fakePredictor";

export type StimulusPair = {
  id: string;
  english: string;
  thai: string;
  /** English gloss of the Thai term (for the divergence note). */
  thaiGloss: string;
  fieldNote: string;
};

const rawPairs: Omit<StimulusPair, never>[] = [
  {
    id: "loneliness-ngao",
    english:
      "She came home to the empty kitchen and felt a particular loneliness — the kind that sits in your chest like a stone you can't quite warm.",
    thai:
      "เธอกลับมาที่ห้องครัวว่างเปล่า และรู้สึก เหงา — เหงาแบบที่นั่งอยู่ในอกเหมือนหินก้อนหนึ่งที่ไม่ยอมอุ่นขึ้น",
    thaiGloss:
      "Loneliness in English carries lack; เหงา (ngao) carries a quiet ache the body can hold without quite naming.",
    fieldNote:
      "The model lights Broca's region and the ATL on the English passage. On the Thai, the language regions barely respond — but the amygdala still warms. The body still hears something.",
  },
  {
    id: "mother-mae",
    english:
      "She remembered her mother's hands, and the way they smelled of jasmine after she had been in the garden all afternoon.",
    thai:
      "เธอจำมือของแม่ได้ และวิธีที่มือเหล่านั้นมีกลิ่นของดอกมะลิหลังจากที่ท่านอยู่ในสวนตลอดบ่าย",
    thaiGloss:
      "Mother in English names a role; แม่ (mae) carries a weight closer to refuge — the addressee a Thai speaker calls when there's no one else to call.",
    fieldNote:
      "Hippocampus and ATL light on both, but the model's English prediction is clearer. The Thai pattern is more dispersed — it has the heat, but not the location.",
  },
  {
    id: "beautiful-suay",
    english:
      "Walking back along the river, he thought that the city had never looked so beautiful as it did under the cold lamps of late October.",
    thai:
      "ตอนเดินกลับริมแม่น้ำ เขาคิดว่าเมืองนี้ไม่เคยดู สวย เท่าตอนอยู่ใต้แสงไฟเย็นๆ ของปลายเดือนตุลาคมเลย",
    thaiGloss:
      "Beautiful describes a surface; สวย (suay) is closer to right — fitting, in the proportions a body recognizes before the eye does.",
    fieldNote:
      "vmPFC and PCC track the aesthetic reward on the English. On the Thai, the same regions warm faintly — the *idea* is there — but the model can't quite read the line.",
  },
];

/**
 * Attenuate + scatter a prediction to simulate "trained on English, fed Thai".
 * Language regions drop to ~35% of their nominal value, all others get a
 * stable low noise floor, and a small amount of pseudo-random scatter
 * (seeded by length so the result is stable per stimulus) is added.
 */
function degradeForThai(
  base: Partial<Record<RegionId, number>>,
  seedFromText: string,
): Partial<Record<RegionId, number>> {
  // Simple xorshift seeded by string hash for stable scatter per stimulus.
  let h = 2166136261;
  for (let i = 0; i < seedFromText.length; i++) {
    h ^= seedFromText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  function rng() {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  }

  const langRegions = new Set<RegionId>([
    "ifg_left",
    "ifg_right",
    "pstg_left",
    "pstg_right",
    "mtg_left",
    "mtg_right",
    "atl_left",
    "atl_right",
    "agl_left",
    "agl_right",
  ]);

  const out: Partial<Record<RegionId, number>> = {};
  for (const [id, v] of Object.entries(base) as [
    RegionId,
    number | undefined,
  ][]) {
    if (v === undefined) continue;
    const isLang = langRegions.has(id);
    const attenuated = isLang ? v * 0.35 : v * 0.6;
    const noise = (rng() - 0.5) * 0.18;
    out[id] = Math.max(0, Math.min(1, attenuated + noise));
  }
  // Add a baseline floor on a few "noise" regions so the scatter feels real.
  out["agl_right"] = Math.min(1, (out["agl_right"] ?? 0) + 0.05 * rng());
  out["dmpfc"] = Math.min(1, (out["dmpfc"] ?? 0) + 0.05 * rng());
  return out;
}

export type StimulusPairWithPredictions = StimulusPair & {
  englishActivations: Partial<Record<RegionId, number>>;
  thaiActivations: Partial<Record<RegionId, number>>;
  /** L2 distance between the two activation vectors, scaled to [0..1]. */
  divergence: number;
  /** The five regions with the largest absolute difference English vs Thai. */
  divergingRegions: { id: RegionId; delta: number }[];
};

function divergence(
  a: Partial<Record<RegionId, number>>,
  b: Partial<Record<RegionId, number>>,
): number {
  const keys = new Set<RegionId>([
    ...(Object.keys(a) as RegionId[]),
    ...(Object.keys(b) as RegionId[]),
  ]);
  let sq = 0;
  let n = 0;
  for (const k of keys) {
    const dv = (a[k] ?? 0) - (b[k] ?? 0);
    sq += dv * dv;
    n++;
  }
  if (n === 0) return 0;
  return Math.min(1, Math.sqrt(sq / n));
}

function divergingRegions(
  a: Partial<Record<RegionId, number>>,
  b: Partial<Record<RegionId, number>>,
  n: number,
): { id: RegionId; delta: number }[] {
  const keys = new Set<RegionId>([
    ...(Object.keys(a) as RegionId[]),
    ...(Object.keys(b) as RegionId[]),
  ]);
  return Array.from(keys)
    .map((id) => ({
      id,
      delta: Math.abs((a[id] ?? 0) - (b[id] ?? 0)),
    }))
    .sort((x, y) => y.delta - x.delta)
    .slice(0, n);
}

export const stimulusPairs: StimulusPairWithPredictions[] = rawPairs.map(
  (p) => {
    const eng = fakePredict(p.english).activations;
    const tha = degradeForThai(fakePredict(p.thai).activations, p.thai);
    return {
      ...p,
      englishActivations: eng,
      thaiActivations: tha,
      divergence: divergence(eng, tha),
      divergingRegions: divergingRegions(eng, tha, 5),
    };
  },
);
