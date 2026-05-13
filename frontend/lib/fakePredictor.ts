/**
 * Local *placeholder* predictor for the Brain Mirror room.
 *
 * Phase 5 ships interactive UX before backend inference is wired. This
 * function takes raw text and produces a plausible-looking 20-region
 * activation map by scoring a few coarse lexical features (function-word
 * density, emotional vocabulary, concrete vs abstract, questions, music
 * vocabulary). The result is **honest about itself**: the UI labels every
 * preview reading with a "simulated locally" disclaimer.
 *
 * When Phase 10 lands, this file is replaced by an API call to FastAPI's
 * `/api/infer/text` which loads the TRIBE v2 checkpoint and returns a real
 * activation prediction.
 */

import type { RegionId } from "./regions";

const FUNCTION_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "at",
  "by", "for", "with", "from", "that", "this", "these", "those", "is",
  "are", "was", "were", "be", "been", "being", "as",
]);

const EMOTION_WORDS = new Set([
  "love", "loved", "loving", "fear", "feared", "afraid", "grief",
  "grieve", "sad", "sadness", "joy", "joyful", "anger", "angry", "shame",
  "ashamed", "pride", "proud", "longing", "ache", "tender", "broken",
  "hurt", "wound", "wounded", "alone", "lonely", "afraid", "warm", "cold",
]);

const CONCRETE_WORDS = new Set([
  "tree", "trees", "stone", "stones", "water", "fire", "house", "room",
  "rooms", "table", "chair", "window", "kitchen", "garden", "rain",
  "snow", "sun", "moon", "sky", "earth", "ground", "hand", "hands",
  "face", "eye", "eyes", "voice", "skin", "bone", "mother", "father",
  "child", "children",
]);

const ABSTRACT_WORDS = new Set([
  "truth", "freedom", "meaning", "time", "thought", "idea", "concept",
  "reality", "existence", "consciousness", "self", "identity", "memory",
  "future", "past", "soul", "mind", "knowledge", "wisdom", "ethics",
]);

const MUSIC_WORDS = new Set([
  "music", "song", "songs", "rhythm", "melody", "note", "notes", "chord",
  "key", "scale", "voice", "voices", "sing", "sings", "sang", "sung",
  "humming", "humming", "drum", "drums", "harp", "violin", "guitar",
]);

const SOCIAL_WORDS = new Set([
  "she", "he", "they", "we", "us", "her", "him", "them", "their",
  "friend", "friends", "lover", "stranger", "family", "father", "mother",
  "child", "children", "you", "your", "me", "my", "I",
]);

function clamp(v: number, lo = 0, hi = 1): number {
  return Math.max(lo, Math.min(hi, v));
}

export type Prediction = {
  activations: Partial<Record<RegionId, number>>;
  /** Features for debug / "what the model saw" UI affordances. */
  features: {
    wordCount: number;
    sentenceCount: number;
    fLang: number;
    fEmotion: number;
    fConcrete: number;
    fAbstract: number;
    fMusic: number;
    fSocial: number;
    fQuestion: number;
  };
};

export function fakePredict(text: string): Prediction {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  const words = lower.match(/\b[\w']+\b/g) ?? [];
  const sentences = trimmed.match(/[.!?]+/g)?.length ?? 0;
  const n = words.length;

  // Below a threshold, return idle so the brain doesn't twitch on every keystroke.
  if (n < 3) {
    return {
      activations: {},
      features: {
        wordCount: n,
        sentenceCount: sentences,
        fLang: 0,
        fEmotion: 0,
        fConcrete: 0,
        fAbstract: 0,
        fMusic: 0,
        fSocial: 0,
        fQuestion: 0,
      },
    };
  }

  const fLang = words.filter((w) => FUNCTION_WORDS.has(w)).length / n;
  const fEmotion = words.filter((w) => EMOTION_WORDS.has(w)).length / n;
  const fConcrete = words.filter((w) => CONCRETE_WORDS.has(w)).length / n;
  const fAbstract = words.filter((w) => ABSTRACT_WORDS.has(w)).length / n;
  const fMusic = words.filter((w) => MUSIC_WORDS.has(w)).length / n;
  const fSocial = words.filter((w) => SOCIAL_WORDS.has(w)).length / n;
  const fQuestion = (text.match(/\?/g)?.length ?? 0) / Math.max(1, sentences);

  // Baseline language activation scales with length up to a soft cap.
  const lengthBoost = clamp(Math.log(n + 1) / 5);

  // Language regions: rise with function-word density + length.
  const langBase = 0.42 + 0.4 * fLang + 0.18 * lengthBoost;
  // Auditory regions: rise with music vocabulary.
  const auditoryBase = 0.18 + 1.4 * fMusic;
  // Emotional salience: amygdala scales with emotional vocabulary.
  const emoBase = 0.12 + 1.6 * fEmotion;
  // Memory regions: scale with concrete vocabulary (autobiographical detail).
  const memoryBase = 0.18 + 1.3 * fConcrete + 0.4 * fSocial;
  // Default-mode: rises with abstract vocabulary and questions.
  const dmnBase = 0.2 + 1.2 * fAbstract + 0.6 * fQuestion;
  // Social cognition: rises with social vocabulary.
  const socialBase = 0.15 + 1.2 * fSocial;

  // Slight left-bias for language (Latin script + most lateralized for lang).
  const activations: Partial<Record<RegionId, number>> = {
    ifg_left: clamp(langBase + 0.08),
    ifg_right: clamp(langBase * 0.5 + 0.18 * fQuestion),
    pstg_left: clamp(langBase * 0.9 + 0.05 * fSocial),
    pstg_right: clamp(auditoryBase + 0.18 * fEmotion),
    mtg_left: clamp(langBase * 0.85 + 0.1 * fConcrete),
    mtg_right: clamp(langBase * 0.45 + 0.3 * fAbstract),
    atl_left: clamp(0.32 + 0.9 * fAbstract + 0.4 * fConcrete),
    atl_right: clamp(0.28 + 0.6 * socialBase),
    agl_left: clamp(0.2 + 0.7 * fAbstract + 0.3 * lengthBoost),
    agl_right: clamp(0.2 + 0.7 * dmnBase),
    hg_left: clamp(auditoryBase + 0.04 * fLang),
    hg_right: clamp(auditoryBase + 0.06 * fLang),
    vmpfc: clamp(0.2 + 0.9 * emoBase),
    dmpfc: clamp(0.2 + socialBase + 0.4 * fQuestion),
    pcc: clamp(0.2 + 0.8 * dmnBase),
    precuneus: clamp(0.22 + 0.9 * fAbstract + 0.4 * fConcrete),
    amyg_left: clamp(0.15 + emoBase),
    amyg_right: clamp(0.15 + emoBase * 0.95),
    hipp_left: clamp(memoryBase),
    hipp_right: clamp(memoryBase * 0.9 + 0.18 * fAbstract),
  };

  return {
    activations,
    features: {
      wordCount: n,
      sentenceCount: sentences,
      fLang,
      fEmotion,
      fConcrete,
      fAbstract,
      fMusic,
      fSocial,
      fQuestion,
    },
  };
}

/**
 * Pick the top N regions from a prediction, sorted by activation.
 */
export function topRegions(
  activations: Partial<Record<RegionId, number>>,
  n = 3,
): { id: RegionId; activation: number }[] {
  return Object.entries(activations)
    .map(([id, activation]) => ({
      id: id as RegionId,
      activation: activation ?? 0,
    }))
    .filter((e) => e.activation > 0)
    .sort((a, b) => b.activation - a.activation)
    .slice(0, n);
}
