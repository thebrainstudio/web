"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import ScrollScene from "@/components/motion/ScrollScene";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import MirrorInput from "@/components/mirror/MirrorInput";
import MirrorReveal from "@/components/mirror/MirrorReveal";
import MirrorCaption from "@/components/mirror/MirrorCaption";
import MirrorInspector from "@/components/mirror/MirrorInspector";
import BrainViews from "@/components/brain/BrainViews";
import BrainColorLegend from "@/components/brain/BrainColorLegend";
import PinnedPredictionCard, {
  type PinnedPrediction,
} from "@/components/mirror/PinnedPredictionCard";
import ExportPngButton from "@/components/mirror/ExportPngButton";
import SavedExampleCard from "@/components/mirror/SavedExampleCard";
import SaveInsightButton from "@/components/mirror/SaveInsightButton";
import {
  Body,
  Caption,
  Display,
  Heading,
} from "@/components/typography/Typography";
import { signaturePatterns, type RegionId } from "@/lib/regions";
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
  // Move 4 — pinned prediction (session-scoped, no backend).
  const [pinned, setPinned] = useState<PinnedPrediction | null>(null);

  const onPrediction = useCallback((text: string, prediction: Prediction) => {
    setLatest({ text, prediction });
  }, []);

  const top = latest ? topRegions(latest.prediction.activations, 3) : [];
  const topFirst = top[0];
  const hasResult = top.length > 0;

  // Pin the current prediction. The pinned card is session-scoped —
  // never written to localStorage; clears on reload.
  const pinCurrent = useCallback(() => {
    if (!latest) return;
    setPinned({
      text: latest.text,
      activations: latest.prediction.activations,
      topRegions: top,
    });
  }, [latest, top]);
  const clearPin = useCallback(() => setPinned(null), []);

  // Compare-mode "current" snapshot, only used by the card.
  const currentPredictionForCard: PinnedPrediction | null = latest
    ? {
        text: latest.text,
        activations: latest.prediction.activations,
        topRegions: top,
      }
    : null;

  return (
    <>
      {/* Shot 1 — entry: brain upper-third, input rises.
          Y was 0.9 which pushed the brain center above the visible
          viewport and only let a thin slice bleed in below the page
          header — the user couldn't actually see what the brain looks
          like. 0.42 keeps the brain in the upper portion of the page
          (visually framing the editorial title + textarea below) while
          showing the full top of both hemispheres.

          activations: only set to {} (idle) BEFORE the user has typed.
          Once `latest` is non-null, omit it so MirrorInput's settled
          prediction survives scroll-back-up to this section. Before:
          scrolling back to the top wiped the user's TRIBE prediction. */}
      <ScrollScene
        id="mirror-entry"
        brain={{
          position: [0, 0.42, 0],
          scale: 0.78,
          rotation: [0, 0.18, 0],
          ...(latest === null ? { activations: {} } : {}),
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

          {/* Four-angle brain views + color legend. BrainViews
              subscribes to the live brain stage store so it swings in
              lockstep with the main brain (including the hover-driven
              spotlight from MirrorInspector). The legend below
              explains what the activation colour ramp means — same
              ramp the main brain and the four mini-brains all use. */}
          {hasResult && latest && (
            <div className="mt-16 md:mt-20">
              <BrainViews
                activations={
                  latest.prediction.activations as Partial<
                    Record<RegionId, number>
                  >
                }
              />
              <BrainColorLegend className="mt-10 max-w-[34rem]" />
            </div>
          )}

          {/* Move 2 — hover-coupled mirror.
              Hover a word: brain swings toward its top-3 contribution
              regions (impressionistic predictor's accounting).
              Hover a region pill: words that contributed to it
              underline. Both directions use the same per-word
              contribution map. */}
          {hasResult && latest && (
            <MirrorInspector
              text={latest.text}
              settledActivations={
                latest.prediction.activations as Partial<
                  Record<RegionId, number>
                >
              }
            />
          )}

          {hasResult && (
            <>
              <MirrorReveal topRegions={top} />
              <div className="mt-16 flex flex-wrap items-center gap-4 md:mt-20">
                <SaveInsightButton text={latest?.text ?? ""} topRegion={topFirst} />
                {/* Move 4 — Pin this prediction. Session-scoped; clears
                    on reload. When pinned, the next typed prediction
                    auto-enters compare mode against the pin. */}
                <button
                  type="button"
                  onClick={pinCurrent}
                  data-hover
                  className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-4 py-2 font-editorial text-caption uppercase tracking-[0.18em] transition-colors duration-300"
                >
                  {pinned && pinned.text === latest?.text
                    ? "Pinned"
                    : "Pin this prediction"}
                </button>
                {/* Move 5 — Export as 1080×1080 PNG. Posts the user's
                    text + activations + generated caption to a Vercel
                    Edge route that renders the fingerprint composition
                    via ImageResponse and streams back the PNG. */}
                {latest && (
                  <ExportPngButton
                    text={latest.text}
                    activations={
                      latest.prediction.activations as Partial<
                        Record<RegionId, number>
                      >
                    }
                  />
                )}
              </div>
            </>
          )}
        </div>
      </ScrollScene>

      {/* Shot 2 — essay. Was a 300vh pinned 3-step sequence; readers
          reported feeling "stuck" because three short paragraphs
          demanded three full screen-scrolls. Now a stacked vertical
          layout: each step takes its natural height (~half a viewport)
          and scrolls naturally past the camera, while the brain stays
          left-anchored throughout the section. Total scroll length
          for the section drops from ~300vh to ~150vh.

          activations: previously hard-coded to signaturePatterns.mirror
          which OVERWROTE the user's TRIBE prediction every time they
          scrolled into this section — no matter what they typed, the
          essay reset the brain to the same demo pattern. Now we only
          apply the demo pattern BEFORE the user has typed; once they
          have a real prediction (latest !== null), the brain mirrors
          THEIR text through the entire essay section. */}
      <ScrollScene
        id="mirror-essay"
        brain={{
          position: [-0.95, 0, 0],
          scale: 0.7,
          rotation: [0, 0.4, 0],
          ...(latest === null
            ? { activations: signaturePatterns.mirror }
            : {}),
        }}
        lighting="warm"
        className="relative grid grid-cols-1 px-6 py-24 md:grid-cols-12 md:gap-x-10 md:px-10 md:py-32"
      >
        <div aria-hidden className="md:col-span-5" />
        <div className="md:col-span-7">
          <div className="space-y-24 md:space-y-28">
            <article className="max-w-[34rem]">
              <Caption uppercase className="text-brass">
                {t("step1.label")}
              </Caption>
              <Heading className="mt-6">{t("step1.heading")}</Heading>
              <Body className="text-bone-cream/70 mt-6">{t("step1.body")}</Body>
            </article>
            <article className="max-w-[34rem]">
              <Caption uppercase className="text-brass">
                {t("step2.label")}
              </Caption>
              <Heading italic className="mt-6">{t("step2.heading")}</Heading>
              <Body className="text-bone-cream/70 mt-6">{t("step2.body")}</Body>
            </article>
            <article className="max-w-[34rem]">
              <Caption uppercase className="text-brass">
                {t("step3.label")}
              </Caption>
              <Heading className="mt-6">{t("step3.heading")}</Heading>
              <Body italic className="text-bone-cream/70 mt-6">{t("step3.body")}</Body>
            </article>
          </div>
        </div>
      </ScrollScene>

      {/* Shot 3 — curated examples. Padding tightened from py-48 to
          py-24 — the essay above now flows naturally into the examples
          rather than parking the user in dead space between sections.

          activations: same conditional fix — only reset to {} when the
          user hasn't typed yet. After they have a prediction, the
          brain holds their pattern while they browse the examples. */}
      <ScrollScene
        id="mirror-examples"
        brain={{
          position: [0, 0, 0],
          scale: 0.95,
          rotation: [0, 0, 0],
          ...(latest === null ? { activations: {} } : {}),
        }}
        lighting="cinematic"
        className="relative px-6 py-20 md:px-10 md:py-28"
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

      {/* Move 4 — pinned prediction card. Fixed bottom-left when
          present; compares current vs pinned automatically once the
          user keeps typing past the pin point. */}
      {pinned && (
        <PinnedPredictionCard
          pinned={pinned}
          current={currentPredictionForCard}
          onClear={clearPin}
        />
      )}
    </>
  );
}
