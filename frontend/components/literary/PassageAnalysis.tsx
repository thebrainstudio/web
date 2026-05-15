import type { ReactNode } from "react";
import { Body, Caption, Mono } from "@/components/typography/Typography";
import BrainPrediction from "./BrainPrediction";
import type { RegionId } from "@/lib/regions";

/**
 * One literary passage, rendered in the Brain Studio's full
 * triangulation: original + translation + analysis + region-
 * prediction sidebar (original vs. translation). The DIVERGENCE
 * between the two predictions is the room's load-bearing finding —
 * the same phenomenon Cross-Cultural Brain surfaces for Thai/English,
 * applied here to early modern German or medieval Italian.
 *
 * Children of `original` and `translation` are React nodes so the
 * caller can pass prosodic markup (line breaks, italicized stress
 * marks, colour-coded rhyme schemes for terza rima) without this
 * component caring what they are.
 */
export default function PassageAnalysis({
  index,
  citation,
  originalLabel,
  original,
  translationLabel,
  translation,
  translationAttribution,
  analysisParagraphs,
  originalActivations,
  translationActivations,
  predictionDisclaimer,
  originalPredictionLabel,
  translationPredictionLabel,
}: {
  /** 1-based passage number ("Passage I", "Passage II"…). */
  index: string;
  /** Source citation under the original, e.g. "Faust, Part I, lines 1699–1706". */
  citation: string;
  /** Heading above the original, localized. */
  originalLabel: string;
  original: ReactNode;
  /** Heading above the translation, localized. */
  translationLabel: string;
  translation: ReactNode;
  /** Attribution + license under the translation. */
  translationAttribution: string;
  /** Analysis paragraphs — the two-paragraph "what stays untranslated"
   *  block this site has held since Cross-Cultural Brain. */
  analysisParagraphs: string[];
  originalActivations: Partial<Record<RegionId, number>>;
  translationActivations: Partial<Record<RegionId, number>>;
  predictionDisclaimer: string;
  originalPredictionLabel: string;
  translationPredictionLabel: string;
}) {
  return (
    <article className="border-bone-cream/10 mt-16 border-t pt-16 md:mt-20 md:pt-20">
      <Caption uppercase className="text-brass tracking-[0.28em] block">
        {index}
      </Caption>
      <Mono variant="label" className="text-bone-cream/75 mt-3 block tracking-[0.14em]">
        {citation}
      </Mono>

      {/* Original + translation side-by-side on desktop, stacked on mobile */}
      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
        <div>
          <Caption uppercase className="text-bone-cream/75 tracking-[0.18em]">
            {originalLabel}
          </Caption>
          <div className="mt-5 font-editorial text-[1.08rem] leading-[1.8]">
            {original}
          </div>
        </div>
        <div>
          <Caption uppercase className="text-bone-cream/75 tracking-[0.18em]">
            {translationLabel}
          </Caption>
          <div className="text-bone-cream/85 mt-5 font-editorial text-[1.04rem] leading-[1.8] italic">
            {translation}
          </div>
          <Mono
            variant="label"
            className="text-bone-cream/40 mt-4 block text-[0.7rem] tracking-[0.14em]"
          >
            {translationAttribution}
          </Mono>
        </div>
      </div>

      {/* Analysis */}
      <div className="mx-auto mt-12 max-w-[40rem] space-y-6">
        {analysisParagraphs.map((p, i) => (
          <Body key={i} className="text-bone-cream/80">
            {p}
          </Body>
        ))}
      </div>

      {/* Region predictions — original vs. translation */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <BrainPrediction
          label={originalPredictionLabel}
          activations={originalActivations}
          disclaimer={predictionDisclaimer}
        />
        <BrainPrediction
          label={translationPredictionLabel}
          activations={translationActivations}
          disclaimer={predictionDisclaimer}
        />
      </div>
    </article>
  );
}
