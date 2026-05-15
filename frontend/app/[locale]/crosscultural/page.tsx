"use client";

import { useTranslations } from "next-intl";
import ScrollScene from "@/components/motion/ScrollScene";
import PinnedSequence, {
  PinnedStep,
} from "@/components/motion/PinnedSequence";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import StimulusComparison from "@/components/crosscultural/StimulusComparison";
import FieldNote from "@/components/crosscultural/FieldNote";
import ProvenanceBadge from "@/components/brain/ProvenanceBadge";
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
  const t = useTranslations("crosscultural");
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
                {t("label")}
              </Caption>
              <Display italic className="mt-8">
                {t("entry1")}
              </Display>
              {/* Integrity-pass: badge sits beneath the entry
                  display, adjacent to the persistent brain on
                  this scene. */}
              <div className="mt-8 inline-flex">
                <ProvenanceBadge state="neurosynth" />
              </div>
            </div>
          </PinnedStep>
          <PinnedStep>
            <div className="mx-auto max-w-[36rem] text-center">
              <Caption uppercase className="text-brass">
                {t("label2")}
              </Caption>
              <Display italic className="mt-8">
                {t("entry2")}
              </Display>
            </div>
          </PinnedStep>
          <PinnedStep>
            <div className="mx-auto max-w-[28rem] text-center">
              <Display italic>{t("entry3")}</Display>
            </div>
          </PinnedStep>
        </PinnedSequence>
      </ScrollScene>

      {/* Shot 2 — stimulus comparison surface */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[44rem]">
            <Caption uppercase className="text-brass">
              {t("pairLabel")}
            </Caption>
            <Heading className="mt-6">{t("pairHeading")}</Heading>
            <Body className="text-bone-cream/65 mt-6 max-w-[34rem]">
              {t("pairBody")}
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
            {t("closingLabel")}
          </Caption>
          <Display italic className="mt-8">
            {t("closingDisplay")}
          </Display>
          <Body className="text-bone-cream/70 mt-10">
            {t("closingBody")}
          </Body>
          <p className="mt-10">
            <Hand className="text-cyan-glow">{t("closingHand")}</Hand>
          </p>
          <Caption uppercase className="text-bone-cream/45 mt-10 block">
            {t("submissionForm")}
          </Caption>
        </div>
      </section>

      <footer className="relative border-t border-bone-cream/10 px-6 py-12 text-center md:px-10">
        <Caption uppercase className="text-bone-cream/65">
          {t("footerNote")}
        </Caption>
      </footer>
    </>
  );
}
