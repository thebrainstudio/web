/**
 * Integrity-pass — qualitative band labels for brain-region
 * activation readouts.
 *
 * The Neurosynth-aggregate path produces parcel activation values
 * in [0, 1] after sigmoid-squashing, but those values aren't
 * meaningfully precise to two decimal places: the upstream pipeline
 * is a meta-analytic z-map projected to a 360-parcel surface, then
 * compressed through a calibrated sigmoid. Rendering "78 %" next to
 * a region implies precision the source data doesn't support.
 *
 * The bands here are the honest readout. Five thresholds, four
 * named bands, one helper. Pages call `bandFor(value)` to get the
 * key, then read the locale-aware label via the `activation.bands.*`
 * i18n namespace.
 *
 * The same cuts apply to divergence magnitudes (English vs. Thai
 * stimulus pairs); only the words change.
 */

export type ActivationBand =
  | "strongest"
  | "moderate"
  | "minimal"
  | "near-silence";

/**
 * Threshold scheme matches the brief:
 *   ≥ 0.70   → strongest
 *   0.40–0.69 → moderate
 *   0.15–0.39 → minimal
 *   < 0.15   → near silence
 *
 * Both the brain-readout band and the divergence-magnitude band
 * use the same cut points. Words are different (`bandLabel` vs.
 * `divergenceLabel`); the math is identical.
 */
export function bandFor(value: number): ActivationBand {
  if (!Number.isFinite(value)) return "near-silence";
  const v = Math.max(0, Math.min(1, value));
  if (v >= 0.7) return "strongest";
  if (v >= 0.4) return "moderate";
  if (v >= 0.15) return "minimal";
  return "near-silence";
}

/**
 * Convenience: map a raw 0–1 value to a translation key under
 * `activation.bands.*`. Pages should call:
 *
 *   const t = useTranslations("activation");
 *   t(`bands.${bandFor(value)}`)
 *
 * which renders e.g. "strongest response" / "moderate" / "minimal" /
 * "near silence" depending on locale.
 */
export function activationBandKey(value: number): string {
  return `bands.${bandFor(value)}`;
}

/**
 * Same idea for delta magnitudes between paired stimuli. The
 * underlying band cut is identical; only the i18n namespace
 * differs (`activation.divergence.*`).
 */
export function divergenceBandKey(value: number): string {
  return `divergence.${bandFor(Math.abs(value))}`;
}
