"use client";

import ScrollScene from "@/components/motion/ScrollScene";
import PinnedSequence, {
  PinnedStep,
} from "@/components/motion/PinnedSequence";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import StimulusComparison from "@/components/crosscultural/StimulusComparison";
import FieldNote from "@/components/crosscultural/FieldNote";
import {
  Body,
  Caption,
  Display,
  Hand,
  Heading,
} from "@/components/typography/Typography";
import { signaturePatterns } from "@/lib/regions";

/**
 * Phase 7 — Cross-Cultural Brain.
 *
 * Structure
 *   Shot 1   pinned entry: "This model was trained on English." → "What
 *            it cannot translate is the most honest finding." → "Begin."
 *   Shot 2   the interactive comparison surface (dual brain maps)
 *   Shot 3   field notes (one per pair) revealed pinned
 *   Shot 4   Jungian closing: the anima of a language
 *
 * Atmospherics: the room keeps its oxblood-ember glow at entry. No new
 * placements — the count stays at 6.
 */
export default function CrossCulturalPage() {
  return (
    <>
      {/* Shot 1 — pinned entry */}
      <ScrollScene
        id="cc-entry"
        brain={{
          position: [0.1, 0.05, 0],
          scale: 0.9,
          rotation: [0, 0.15, 0],
          activations: signaturePatterns.crosscultural,
        }}
        lighting="clinical"
        className="relative"
      >
        <AtmosphericGlow
          preset="oxblood-ember"
          position="center"
          intensity="medium"
        />
        <PinnedSequence steps={3}>
          <PinnedStep>
            <div className="mx-auto max-w-[36rem] text-center">
              <Caption uppercase className="text-brass">
                Cross-Cultural Brain · Phase 7
              </Caption>
              <Display italic className="mt-8">
                This model was trained on English.
              </Display>
            </div>
          </PinnedStep>
          <PinnedStep>
            <div className="mx-auto max-w-[36rem] text-center">
              <Caption uppercase className="text-brass">
                The honest finding
              </Caption>
              <Display italic className="mt-8">
                What it cannot translate is the most honest finding.
              </Display>
            </div>
          </PinnedStep>
          <PinnedStep>
            <div className="mx-auto max-w-[28rem] text-center">
              <Display italic>Begin.</Display>
            </div>
          </PinnedStep>
        </PinnedSequence>
      </ScrollScene>

      {/* Shot 2 — stimulus comparison surface */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[44rem]">
            <Caption uppercase className="text-brass">
              Pair selector
            </Caption>
            <Heading className="mt-6">
              Three pairs the model carries unevenly.
            </Heading>
            <Body className="text-bone-cream/65 mt-6 max-w-[34rem]">
              Each pair shows an English sentence and a Thai sentence that
              circle the same feeling. The English prediction is plausible;
              the Thai prediction is the model trying to find a foothold
              outside its training distribution.
            </Body>
          </div>
          <div className="mt-16">
            <StimulusComparison />
          </div>
        </div>
      </section>

      {/* Shot 3 — pinned field notes */}
      <ScrollScene
        id="cc-field-notes"
        brain={{
          position: [-0.2, 0, 0],
          scale: 0.92,
          rotation: [0, 0.1, 0],
          activations: {},
        }}
        lighting="clinical"
        className="relative"
      >
        <PinnedSequence steps={3}>
          <PinnedStep>
            <FieldNote index={0} pairId="loneliness-ngao" side="thai" />
          </PinnedStep>
          <PinnedStep>
            <FieldNote index={1} pairId="mother-mae" side="thai" />
          </PinnedStep>
          <PinnedStep>
            <FieldNote index={2} pairId="beautiful-suay" side="thai" />
          </PinnedStep>
        </PinnedSequence>
      </ScrollScene>

      {/* Shot 4 — closing Jungian section */}
      <section className="relative px-6 py-32 md:px-10 md:py-48">
        <div className="mx-auto max-w-[40rem]">
          <Caption uppercase className="text-brass">
            Closing
          </Caption>
          <Display italic className="mt-8">
            What stays untranslated is the anima of a language.
          </Display>
          <Body className="text-bone-cream/70 mt-10">
            The layer below grammar that knows things in its own way. The
            model&apos;s silence is also a kind of knowledge — what it
            cannot say is itself a measurement.
          </Body>
          <p className="mt-10">
            <Hand className="text-cyan-glow">
              (send us a pair the model should hear — soon)
            </Hand>
          </p>
          <Caption uppercase className="text-bone-cream/45 mt-10 block">
            Pair submission form · Phase 11
          </Caption>
        </div>
      </section>

      <footer className="relative border-t border-bone-cream/10 px-6 py-12 text-center md:px-10">
        <Caption uppercase className="text-bone-cream/40">
          Cross-Cultural Brain · predictions simulated locally
        </Caption>
      </footer>
    </>
  );
}
