/**
 * Impressionistic per-keystroke brain activation predictor.
 *
 * Phase 11 — Move 1. Runs in-process on every keystroke (no debounce
 * beyond 60 ms input coalescing) so the persistent brain visibly shifts
 * *while* the user writes — not just after they pause. The settled
 * predictor (real TRIBE or its proxies) keeps its 400 ms debounce and
 * arrives later with a 1200 ms cubic-bezier(0.16, 1, 0.3, 1) lerp from
 * the impressionistic guess to the high-confidence answer.
 *
 * Pillars:
 *   1. CHEAP — no network call, no large model. A small lexicon scan
 *      plus a few arithmetic combinators. Tens of microseconds per
 *      keystroke.
 *   2. HONEST — the predictor declares `confidence: 0.55` against the
 *      settled predictor's 1.0. The rendering layer scales activation
 *      brightness by confidence, so the brain literally looks dimmer
 *      while impressionistic. This is both an honesty signal and a
 *      visual storytelling beat (rough draft → finished thought).
 *   3. PER-WORD — every token gets a `contributions` record listing
 *      which regions it touched. Move 2 (hover-coupled mirror) and
 *      Move 3 (caption generator) both consume this data.
 *
 * Not a scientific claim — visual approximation only. Same activations
 * map onto the same 20 named regions as the settled predictor, so the
 * lerp from impressionistic → settled looks coherent.
 *
 * Lexicons are intentionally small (~30 entries each). Empirically this
 * is enough to differentiate broad register (concrete vs abstract,
 * emotional vs analytical, social vs solitary) without overfitting on
 * specific words.
 */

import type { RegionId } from "@/lib/regions";

// ─── Lexicons ────────────────────────────────────────────────────────

const LEXICON_EMOTION: ReadonlySet<string> = new Set([
  "love", "loved", "loving", "fear", "feared", "afraid", "grief",
  "grieve", "grieved", "sad", "sadness", "joy", "joyful", "anger",
  "angry", "shame", "ashamed", "pride", "proud", "longing", "ache",
  "tender", "broken", "hurt", "wound", "wounded", "alone", "lonely",
  "warm", "cold", "scared", "terror", "delight", "rage",
]);

const LEXICON_CONCRETE: ReadonlySet<string> = new Set([
  "tree", "trees", "stone", "stones", "water", "fire", "house", "room",
  "rooms", "table", "chair", "window", "kitchen", "garden", "rain",
  "snow", "sun", "moon", "sky", "earth", "ground", "hand", "hands",
  "face", "eye", "eyes", "voice", "skin", "bone", "bread", "smell",
  "taste", "tongue",
]);

const LEXICON_ABSTRACT: ReadonlySet<string> = new Set([
  "truth", "freedom", "meaning", "time", "thought", "idea", "concept",
  "reality", "existence", "consciousness", "self", "identity", "memory",
  "future", "past", "soul", "mind", "knowledge", "wisdom", "ethics",
  "purpose", "absence", "presence", "destiny",
]);

const LEXICON_MUSIC: ReadonlySet<string> = new Set([
  "music", "song", "songs", "rhythm", "melody", "note", "notes",
  "chord", "key", "scale", "sing", "sings", "sang", "sung", "humming",
  "drum", "drums", "harp", "violin", "guitar", "voice", "voices",
  "tune", "harmony", "silence", "sound",
]);

const LEXICON_SOCIAL: ReadonlySet<string> = new Set([
  "she", "he", "they", "we", "us", "her", "him", "them", "their",
  "friend", "friends", "lover", "stranger", "family", "father",
  "mother", "child", "children", "sister", "brother", "grandmother",
  "grandfather", "neighbor",
]);

const LEXICON_SELF: ReadonlySet<string> = new Set([
  "i", "me", "my", "mine", "myself", "we", "us", "our", "ours",
  "ourselves",
]);

const LEXICON_FUNCTION: ReadonlySet<string> = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "at",
  "by", "for", "with", "from", "that", "this", "these", "those", "is",
  "are", "was", "were", "be", "been", "being", "as",
]);

const LEXICONS: Record<string, ReadonlySet<string>> = {
  emotion: LEXICON_EMOTION,
  concrete: LEXICON_CONCRETE,
  abstract: LEXICON_ABSTRACT,
  music: LEXICON_MUSIC,
  social: LEXICON_SOCIAL,
  self: LEXICON_SELF,
  function: LEXICON_FUNCTION,
};

export type LexiconKey = keyof typeof LEXICONS;

// ─── Lexicon → region contribution table ────────────────────────────

/**
 * For each lexicon, the regions it boosts (weight ∈ [0, 1]).
 *
 * Derived from the same neuro-vocabulary the settled predictor's
 * region anchors use (backend/tribe/region_anchors.py). The mappings
 * are deliberately broad — Move 1 is impressionistic, the settled
 * predictor refines.
 */
const LEXICON_TO_REGIONS: Record<LexiconKey, Partial<Record<RegionId, number>>> = {
  // Language structure — left-lateralized.
  function: {
    ifg_left: 0.55,
    pstg_left: 0.45,
    mtg_left: 0.4,
  },
  // Word meaning — bilateral semantic system, left bias.
  concrete: {
    atl_left: 0.65,
    atl_right: 0.4,
    mtg_left: 0.55,
    agl_left: 0.5,
    precuneus: 0.55,  // imagery
    hipp_left: 0.45,
  },
  abstract: {
    atl_left: 0.55,
    agl_left: 0.7,
    agl_right: 0.55,
    dmpfc: 0.5,
    precuneus: 0.45,
  },
  emotion: {
    amyg_left: 0.7,
    amyg_right: 0.7,
    vmpfc: 0.6,
    atl_right: 0.45,
  },
  music: {
    hg_left: 0.65,
    hg_right: 0.7,
    pstg_right: 0.65,
    pstg_left: 0.5,
  },
  social: {
    dmpfc: 0.65,
    atl_right: 0.55,
    mtg_right: 0.5,
    pcc: 0.45,
  },
  // First-person referencing — default-mode + medial PFC.
  self: {
    pcc: 0.7,
    vmpfc: 0.55,
    precuneus: 0.55,
    dmpfc: 0.4,
  },
};

// ─── Public types ────────────────────────────────────────────────────

export type WordContribution = {
  /** The token as it appears in the text, preserving original casing. */
  word: string;
  /** 0-based index within the cleaned word stream. */
  index: number;
  /** Which lexicons matched (may be empty for "stop" words). */
  lexicons: LexiconKey[];
  /** Per-region contribution map. Values are *unnormalized weights*
   *  (raw lexicon weights summed). Normalization happens at the
   *  prediction layer. */
  regions: Partial<Record<RegionId, number>>;
};

export type ImpressionisticPrediction = {
  activations: Partial<Record<RegionId, number>>;
  /** [0, 1] — fixed at 0.55 to communicate "rough draft." */
  confidence: number;
  contributions: WordContribution[];
  /** Raw word count after tokenization. */
  wordCount: number;
  /** Engine identifier for honest attribution. */
  engine: "impressionistic_v1";
};

// ─── Tokenization ────────────────────────────────────────────────────

/**
 * Tokenize into a stream of "words" while preserving original casing
 * for display purposes. Strips punctuation and whitespace.
 *
 * Unicode-aware: keeps Thai/Japanese/Chinese characters intact. Each
 * non-Latin run is treated as a single token for now; per-character
 * coupling can come later if Move 2 needs it for CJK locales.
 */
export function tokenize(text: string): { display: string; lower: string }[] {
  const out: { display: string; lower: string }[] = [];
  // \p{L} = any letter (incl. CJK), \p{N} = any number, apostrophes for
  // contractions. Everything else is a separator.
  const re = /[\p{L}\p{N}'']+/gu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const display = m[0];
    out.push({ display, lower: display.toLocaleLowerCase() });
  }
  return out;
}

// ─── Core predictor ──────────────────────────────────────────────────

const IMPRESSIONISTIC_CONFIDENCE = 0.55;
const MIN_WORDS_FOR_PREDICTION = 1;

/**
 * Single-pass scan: tokenize, score each token against each lexicon,
 * accumulate per-region contributions, then normalize.
 *
 * Returns a fully populated `ImpressionisticPrediction`. Even for
 * pathological input (empty text, single character, only stopwords)
 * the function returns a well-formed object — never throws.
 */
export function impressionisticPredict(text: string): ImpressionisticPrediction {
  const tokens = tokenize(text);
  if (tokens.length < MIN_WORDS_FOR_PREDICTION) {
    return {
      activations: {},
      confidence: IMPRESSIONISTIC_CONFIDENCE,
      contributions: [],
      wordCount: 0,
      engine: "impressionistic_v1",
    };
  }

  const contributions: WordContribution[] = [];
  const regionTotals: Partial<Record<RegionId, number>> = {};

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    const matched: LexiconKey[] = [];
    const wordRegions: Partial<Record<RegionId, number>> = {};

    for (const key of Object.keys(LEXICONS) as LexiconKey[]) {
      if (LEXICONS[key].has(tok.lower)) {
        matched.push(key);
        const regionBoosts = LEXICON_TO_REGIONS[key];
        for (const [region, weight] of Object.entries(regionBoosts)) {
          const r = region as RegionId;
          wordRegions[r] = (wordRegions[r] ?? 0) + (weight ?? 0);
          regionTotals[r] = (regionTotals[r] ?? 0) + (weight ?? 0);
        }
      }
    }

    contributions.push({
      word: tok.display,
      index: i,
      lexicons: matched,
      regions: wordRegions,
    });
  }

  // Normalize: divide each region's total by sqrt(wordCount) so longer
  // texts don't saturate. Then squash to [0, 1] via tanh. The 0.55
  // confidence multiplier is applied at the rendering layer, NOT here,
  // so the contribution table stays in a comparable scale to the
  // settled predictor.
  const denom = Math.sqrt(Math.max(1, tokens.length));
  const activations: Partial<Record<RegionId, number>> = {};
  for (const [region, total] of Object.entries(regionTotals)) {
    const normalized = (total ?? 0) / denom;
    // tanh squash so 0 stays 0 and large totals saturate near 1.
    activations[region as RegionId] = Math.tanh(normalized);
  }

  return {
    activations,
    confidence: IMPRESSIONISTIC_CONFIDENCE,
    contributions,
    wordCount: tokens.length,
    engine: "impressionistic_v1",
  };
}

// ─── Confidence-scaled activation helper ─────────────────────────────

/**
 * Apply a confidence multiplier to an activation map. Used to dim
 * the impressionistic prediction relative to the settled prediction.
 *
 * Move 1.3: confidence ∈ [0, 1] scales activation amplitude linearly.
 * Move 1.4: prefers-reduced-motion uses the same scaling, just without
 * the lerp animation between them.
 */
export function applyConfidence(
  activations: Partial<Record<RegionId, number>>,
  confidence: number,
): Partial<Record<RegionId, number>> {
  const c = Math.max(0, Math.min(1, confidence));
  const out: Partial<Record<RegionId, number>> = {};
  for (const [region, value] of Object.entries(activations)) {
    out[region as RegionId] = (value ?? 0) * c;
  }
  return out;
}
