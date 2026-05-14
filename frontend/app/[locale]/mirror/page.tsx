"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import ScrollScene from "@/components/motion/ScrollScene";
import PinnedSequence, {
  PinnedStep,
} from "@/components/motion/PinnedSequence";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import MirrorInput from "@/components/mirror/MirrorInput";
import MirrorReveal from "@/components/mirror/MirrorReveal";
import MirrorCaption from "@/components/mirror/MirrorCaption";
import SavedExampleCard from "@/components/mirror/SavedExampleCard";
import SaveInsightButton from "@/components/mirror/SaveInsightButton";
import {
  Body,
  Caption,
  Display,
  Heading,
} from "@/components/typography/Typography";
import { signaturePatterns } from "@/lib/regions";
import { topRegions, type Prediction } from "@/lib/fakePredictor";
import { savedExamples } from "@/lib/savedExamples";

/**
 * Phase 5 — Brain Mirror.
 *
 * Layout:
 *   Shot 1  brain glides upper-third, input rises from below
 *   Shot 2  top-3 region reveal (appears when text settles)
 *   Shot 3  pinned 3-step essay ("the brain doesn't read words…")
 *   Shot 4  three curated examples
 *
 * Background atmospherics: amber-lamp glow at top, intensity steps from
 * subtle → pronounced when a real prediction arrives (the room "warms"
 * with the user). Reduced-motion users get a static medium glow.
 */
export default function MirrorPage() {
  const t = useTranslations("mirror");
  const [seedText, setSeedText] = useState<string>("");
  const [latest, setLatest] = useState<{
    text: string;
    prediction: Prediction;
  } | null>(null);

  const onPrediction = useCallback((text: string, prediction: Prediction) => {
    setLatest({ text, prediction });
  }, []);

  const top = latest ? topRegions(latest.prediction.activations, 3) : [];
  const topFirst = top[0];
  const hasResult = top.length > 0;

  return (
    <>
      {/* Shot 1 — entry: brain upper-third, input rises.
          Y was 0.9 which pushed the brain center above the visible
          viewport and only let a thin slice bleed in below the page
          header — the user couldn't actually see what the brain looks
          like. 0.42 keeps the brain in the upper portion of the page
          (visually framing the editorial title + textarea below) while
          showing the full top of both hemispheres. */}
      <ScrollScene
        id="mirror-entry"
        brain={{
          position: [0, 0.42, 0],
          scale: 0.78,
          rotation: [0, 0.18, 0],
          activations: {},
        }}
        lighting="warm"
        className="relative min-h-screen px-6 pb-24 pt-36 md:px-10 md:pt-44"
      >
        <AtmosphericGlow
          preset="amber-lamp"
          position="top"
          intensity={hasResult ? "pronounced" : "subtle"}
        />

        <div className="mx-auto max-w-[44rem]">
          <Caption uppercase className="text-brass">
            {t("label")}
          </Caption>
          <Display italic className="mt-8">
            {t("title")}
          </Display>
          <Body className="text-bone-cream/65 mt-8 max-w-[34rem]">
            {t("intro")}
          </Body>

          <div className="mt-12">
            <MirrorInput initial={seedText} onPrediction={onPrediction} />
          </div>

          {/* Move 3 — the "what just happened" caption.
              Names the top-3 regions + their functional summary in
              editorial voice, plus the honest disclaimer. Appears
              when the settled prediction lands; hides otherwise. */}
          {hasResult && latest && (
            <div className="mt-12 md:mt-16">
              <MirrorCaption
                activations={latest.prediction.activations}
              />
            </div>
          )}

          {hasResult && (
            <>
              <MirrorReveal topRegions={top} />
              <div className="mt-16 flex flex-wrap items-center gap-4 md:mt-20">
                <SaveInsightButton text={latest?.text ?? ""} topRegion={topFirst} />
                <Caption uppercase className="text-bone-cream/45">
                  {t("exportLabel")}
                </Caption>
              </div>
            </>
          )}
        </div>
      </ScrollScene>

      {/* Shot 2 — pinned essay */}
      <ScrollScene
        id="mirror-essay"
        brain={{
          position: [-0.95, 0, 0],
          scale: 0.7,
          rotation: [0, 0.4, 0],
          activations: signaturePatterns.mirror,
        }}
        lighting="warm"
        className="relative grid min-h-[120vh] grid-cols-1 px-6 md:grid-cols-12 md:px-10"
      >
        <div aria-hidden className="md:col-span-5" />
        <div className="md:col-span-7">
          <PinnedSequence steps={3}>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <Caption uppercase className="text-brass">
                  {t("step1.label")}
                </Caption>
                <Heading className="mt-6">{t("step1.heading")}</Heading>
                <Body className="text-bone-cream/70 mt-6">{t("step1.body")}</Body>
              </div>
            </PinnedStep>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <Caption uppercase className="text-brass">
                  {t("step2.label")}
                </Caption>
                <Heading italic className="mt-6">{t("step2.heading")}</Heading>
                <Body className="text-bone-cream/70 mt-6">{t("step2.body")}</Body>
              </div>
            </PinnedStep>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <Caption uppercase className="text-brass">
                  {t("step3.label")}
                </Caption>
                <Heading className="mt-6">{t("step3.heading")}</Heading>
                <Body italic className="text-bone-cream/70 mt-6">{t("step3.body")}</Body>
              </div>
            </PinnedStep>
          </PinnedSequence>
        </div>
      </ScrollScene>

      {/* Shot 3 — curated examples */}
      <ScrollScene
        id="mirror-examples"
        brain={{
          position: [0, 0, 0],
          scale: 0.95,
          rotation: [0, 0, 0],
          activations: {},
        }}
        lighting="cinematic"
        className="relative px-6 py-32 md:px-10 md:py-48"
      >
        <div className="mx-auto max-w-[1080px]">
          <Caption uppercase className="text-brass">
            {t("examplesHeading")}
          </Caption>
          <div className="mt-12 grid grid-cols-1 gap-16 md:gap-20">
            {savedExamples.map((ex, i) => (
              <SavedExampleCard
                key={ex.id}
                example={ex}
                index={i}
                onApply={(text) => {
                  setSeedText(text);
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              />
            ))}
          </div>
        </div>
      </ScrollScene>

      <footer className="relative border-t border-bone-cream/10 px-6 py-12 text-center md:px-10">
        <Caption uppercase className="text-bone-cream/65">
          {t("footerStudio")}
        </Caption>
        <Caption uppercase aria-hidden className="text-bone-cream/40 mx-3">
          ·
        </Caption>
        <Caption uppercase className="text-bone-cream/65">
          {t("footerNote")}
        </Caption>
      </footer>
    </>
  );
}
