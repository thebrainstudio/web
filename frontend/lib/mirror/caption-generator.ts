/**
 * Caption generator for the Brain Mirror — Move 3.
 *
 * Pure function. Takes an activation map + the active locale and
 * returns a short editorial sentence describing what just lit up.
 *
 * Voice: restrained, editorial, in the same register as the rest of
 * the prose on the site. Template-driven but tuned so the output
 * doesn't *feel* templated. Always two short sentences plus an
 * optional comparison line if the user's pattern matches one of the
 * curated examples in `lib/savedExamples.ts` strongly enough.
 *
 * Example outputs (English):
 *   "The model recruited Broca's region, the angular gyrus, and the
 *    posterior cingulate. Language assembly meeting abstract reading
 *    meeting default-mode core."
 *
 *   "Auditory cortex dominates here. Heschl's gyrus carries the sound
 *    before the language regions catch up. The pattern resembles
 *    the Thai lullaby line more than the others."
 *
 * Localization: the function reads from the i18n bundle so Thai users
 * get Thai prose, Japanese users Japanese, etc. The English template
 * is the source of truth; translators fill in the others.
 */

import {
  regions,
  regionById,
  type RegionId,
} from "@/lib/regions";

// ─── Function-summary phrases ────────────────────────────────────────

/**
 * Short evocative function phrases per region. Used to compose the
 * second sentence of the caption. Kept tight so concatenating two or
 * three doesn't overflow the editorial register.
 *
 * Translations live in `messages/*.json` under
 * `mirror.captionFunction.<regionId>` — falls back to English if the
 * key is missing.
 */
export const FUNCTION_PHRASES: Record<RegionId, string> = {
  ifg_left: "language assembly",
  ifg_right: "tone and figurative ear",
  pstg_left: "word recognition",
  pstg_right: "the affective shape of sound",
  mtg_left: "lexical semantics",
  mtg_right: "metaphor and narrative",
  atl_left: "the semantic hub",
  atl_right: "person knowledge",
  agl_left: "abstract reading",
  agl_right: "the body's coordinates",
  hg_left: "primary hearing",
  hg_right: "fine spectral detail",
  vmpfc: "value and self-reference",
  dmpfc: "mentalizing",
  pcc: "default-mode core",
  precuneus: "autobiographical imagery",
  amyg_left: "emotional salience",
  amyg_right: "the body's rapid verdict",
  hipp_left: "memory binding",
  hipp_right: "imagined futures",
};

// ─── Public types ────────────────────────────────────────────────────

export type CaptionInput = {
  activations: Partial<Record<RegionId, number>>;
  /** Optional: the curated examples to compare against. */
  examples?: { id: string; label: string; activations: Partial<Record<RegionId, number>> }[];
  /** Optional minimum cosine-similarity to surface the example
   *  comparison sentence. 0.92 by default — only mention an example
   *  when the match is strong. */
  exampleMatchThreshold?: number;
  /** Optional minimum top-1 activation to even attempt a caption.
   *  Below this we surface a "warming" placeholder instead. */
  signalThreshold?: number;
};

export type CaptionResult = {
  /** Plain-text caption — 1-3 sentences. */
  text: string;
  /** Top-3 region ids in display order. */
  topRegions: RegionId[];
  /** When a strong example match exists, its id (else null). */
  matchedExampleId: string | null;
  /** When `text` is the fallback "still warming" placeholder. */
  belowSignalThreshold: boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────

function pickTopN(
  activations: Partial<Record<RegionId, number>>,
  n: number,
): { id: RegionId; value: number }[] {
  return Object.entries(activations)
    .map(([id, value]) => ({ id: id as RegionId, value: (value ?? 0) }))
    .filter((e) => e.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, n);
}

/** Cosine similarity between two activation maps. */
function cosineSimilarity(
  a: Partial<Record<RegionId, number>>,
  b: Partial<Record<RegionId, number>>,
): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const r of regions) {
    const av = a[r.id] ?? 0;
    const bv = b[r.id] ?? 0;
    dot += av * bv;
    normA += av * av;
    normB += bv * bv;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  return dot / denom;
}

/**
 * English Oxford-comma list of strings.
 * ["a"]            → "a"
 * ["a", "b"]       → "a and b"
 * ["a", "b", "c"]  → "a, b, and c"
 *
 * For non-English locales the conjunction comes from i18n; the caller
 * is responsible for substituting the localized form.
 */
function englishList(items: string[], conjunction = "and"): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, ${conjunction} ${items[items.length - 1]}`;
}

/**
 * Short, grammatically clean anatomy reference. We use the existing
 * `regionById[id].anatomyName` but trim parenthetical hemisphere
 * annotations off — the second sentence already implies hemispheric
 * specificity via the function phrase.
 *
 *   "Inferior frontal gyrus, BA 44/45 (left)" → "Broca's region"
 *   "Posterior superior temporal gyrus (left)" → "the posterior STG"
 */
function shortAnatomy(id: RegionId): string {
  const r = regionById[id];
  // Region display names are already curated for editorial use
  // (e.g. "Broca's region (L)", "Posterior STG (L)"). Strip the
  // hemisphere suffix and lower-case proper-noun-free strings.
  let name = r.displayName.replace(/\s*\([LR]\)\s*$/i, "").trim();
  // The two STG entries read better as "the posterior STG" than
  // capital-leading "Posterior STG" mid-sentence.
  if (/^Posterior STG/i.test(name)) name = `the posterior STG`;
  if (/^Middle Temporal/i.test(name)) name = `the middle temporal gyrus`;
  if (/^Anterior Temporal/i.test(name)) name = `the anterior temporal lobe`;
  if (/^Angular Gyrus/i.test(name)) name = `the angular gyrus`;
  if (/^Heschl/i.test(name)) name = name.replace("Heschl's Gyrus", "Heschl's gyrus");
  return name;
}

// ─── Caption generator ───────────────────────────────────────────────

/**
 * Produce a caption from an activation map.
 *
 * The result text is in English. For other locales, pass the same
 * input through and substitute strings via i18n at the caller (or
 * call a translated variant of this function in a future patch).
 */
export function generateCaption(input: CaptionInput): CaptionResult {
  const signalThreshold = input.signalThreshold ?? 0.35;
  const exampleMatchThreshold = input.exampleMatchThreshold ?? 0.92;

  const top = pickTopN(input.activations, 3);
  const topRegions = top.map((t) => t.id);

  if (top.length === 0 || top[0].value < signalThreshold) {
    return {
      text:
        "The signal is still warming. Type a sentence or paragraph and the model will settle on a pattern.",
      topRegions,
      matchedExampleId: null,
      belowSignalThreshold: true,
    };
  }

  // Sentence 1 — what lit up
  const names = top.map((t) => shortAnatomy(t.id));
  const sentence1 = `The model recruited ${englishList(names)}.`;

  // Sentence 2 — what those regions do (composed phrase)
  const phrases = top.map((t) => FUNCTION_PHRASES[t.id]);
  const sentence2 = `${capitalize(phrases.join(" meeting "))}.`;

  // Sentence 3 — example match (optional, only when similarity is high)
  let matchedExampleId: string | null = null;
  let sentence3 = "";
  if (input.examples && input.examples.length > 0) {
    const sims = input.examples
      .map((ex) => ({
        id: ex.id,
        label: ex.label,
        sim: cosineSimilarity(input.activations, ex.activations),
      }))
      .sort((a, b) => b.sim - a.sim);
    if (sims[0].sim >= exampleMatchThreshold) {
      const best = sims[0];
      const others = sims.slice(1).filter((s) => s.sim > 0.5);
      matchedExampleId = best.id;
      if (others.length > 0) {
        sentence3 = ` The pattern resembles ${best.label} more than ${others[0].label}.`;
      } else {
        sentence3 = ` The pattern resembles ${best.label}.`;
      }
    }
  }

  return {
    text: `${sentence1} ${sentence2}${sentence3}`,
    topRegions,
    matchedExampleId,
    belowSignalThreshold: false,
  };
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}
