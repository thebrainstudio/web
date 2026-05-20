import ScrollScene from "@/components/motion/ScrollScene";
import PinnedSequence, { PinnedStep } from "@/components/motion/PinnedSequence";
import ParallaxLayer from "@/components/motion/ParallaxLayer";
import RoomCard from "@/components/home/RoomCard";
import InsightCard from "@/components/home/InsightCard";
import MirrorCueOnScroll from "@/components/home/MirrorCueOnScroll";
import KeystrokeSequenceHandler from "@/components/home/KeystrokeSequenceHandler";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import {
  Display,
  Heading,
  Body,
  Caption,
} from "@/components/typography/Typography";
import HeroDisplay from "@/components/home/HeroDisplay";
import { homeScrollChoreography, signaturePatterns } from "@/lib/scrollScenes";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

/**
 * Home page — continuous 5-shot scroll cinema. Persistent brain reads its
 * targets from `homeScrollChoreography`. Atmospherics: vertical wash (body)
 * + film grain (layout) + two surgical glows here (Shot 1 amber-lamp,
 * Shot 3 cool-cathedral). All copy is locale-aware via the `home` namespace
 * in messages/<locale>.json.
 */
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const [shot1, shot2, shot3, shot4, shot5] = homeScrollChoreography;

  return (
    <>
      <KeystrokeSequenceHandler />
      {/* Shot 1 — Cold open. Amber lamp glow + animated. */}
      <ScrollScene
        {...shot1}
        className="relative flex min-h-[90vh] items-center justify-center px-6"
      >
        <AtmosphericGlow
          preset="amber-lamp"
          position="top"
          intensity="medium"
          animate
        />
        <div className="mx-auto max-w-[44rem] text-center">
          {/* "THE BRAIN STUDIO" opening caption removed — the site
              header already carries that branding at the top of every
              page, and on /en the caption was sitting behind the
              persistent brain canvas, where the cortex obscured it.
              Hero display now opens cold, which is the brief's
              "cold open" intent for Shot 1 anyway. */}
          <HeroDisplay
            line1={t("hero.line1")}
            line2={t("hero.line2")}
            line3={t("hero.line3")}
          />
          <Caption uppercase as="p" className="text-bone-cream/85 mt-12">
            {t("scrollPrompt")}
          </Caption>
          <p
            aria-hidden
            className="text-bone-cream/30 mt-3 select-none text-xl"
          >
            ↓
          </p>
          {/* Phase D.1: a small editorial pointer telling first-time
              visitors that the Mirror is where they can actually do
              something. Lives below the scroll prompt; sits at /55
              opacity so it doesn't compete with the hero. */}
          <div className="mt-16 flex justify-center">
            <Link
              href="/mirror"
              data-hover
              className="text-bone-cream/75 hover:text-brass group inline-flex items-center gap-2 transition-colors duration-300"
            >
              <Caption uppercase className="tracking-[0.18em]">
                Or skip ahead — type into the Mirror
              </Caption>
              <span
                aria-hidden
                className="text-brass transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </ScrollScene>

      {/* Shot 2 — Brain glides left. Pinned 3-step TRIBE explanation. */}
      <ScrollScene
        {...shot2}
        className="relative grid min-h-[100vh] grid-cols-1 px-6 md:grid-cols-12 md:px-10"
      >
        <div aria-hidden className="md:col-span-5" />
        <div className="md:col-span-7">
          <PinnedSequence steps={3}>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <Caption uppercase as="p" className="text-brass">
                  {t("howItWorks.step1.label")}
                </Caption>
                <Heading className="mt-6">
                  {t("howItWorks.step1.heading")}
                </Heading>
                <Body className="text-bone-cream/85 mt-6 max-w-[30rem]">
                  {t("howItWorks.step1.body")}
                </Body>
              </div>
            </PinnedStep>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <Caption uppercase as="p" className="text-brass">
                  {t("howItWorks.step2.label")}
                </Caption>
                <Heading italic className="mt-6">
                  {t("howItWorks.step2.heading")}
                </Heading>
                <Body className="text-bone-cream/85 mt-6 max-w-[30rem]">
                  {t("howItWorks.step2.body")}
                </Body>
              </div>
            </PinnedStep>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <Caption uppercase as="p" className="text-brass">
                  {t("howItWorks.step3.label")}
                </Caption>
                <Heading className="mt-6">
                  {t("howItWorks.step3.heading")}
                </Heading>
                <Body italic className="text-bone-cream/85 mt-6 max-w-[30rem]">
                  {t("howItWorks.step3.body")}
                </Body>
              </div>
            </PinnedStep>
          </PinnedSequence>
        </div>
      </ScrollScene>

      {/* Shot 3 — Eight rooms grid. Cool-cathedral glow (subtle, no position). */}
      <ScrollScene
        {...shot3}
        className="relative flex min-h-[95vh] items-center px-6 md:px-10"
      >
        <AtmosphericGlow preset="cool-cathedral" intensity="subtle" />
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="md:mx-auto md:max-w-[40rem] md:text-center">
            <Caption uppercase as="p" className="text-brass">
              {t("rooms.section")}
            </Caption>
            <Heading className="mt-8 md:text-display md:font-[200]">
              {t("rooms.heading")}
            </Heading>
            <Body className="text-bone-cream/80 mt-6">
              {t("rooms.body")}
            </Body>
          </div>

          {/* TRIBE-driven rooms — the primary row */}
          <div className="mt-20 grid grid-cols-1 gap-14 md:mt-24 md:grid-cols-3 md:gap-10">
            <RoomCard
              index={0}
              title={t("rooms.mirror.title")}
              description={t("rooms.mirror.description")}
              href="/mirror"
              pattern={signaturePatterns.mirror}
            />
            <RoomCard
              index={1}
              title={t("rooms.music.title")}
              description={t("rooms.music.description")}
              href="/music"
              pattern={signaturePatterns.music}
            />
            <RoomCard
              index={2}
              title={t("rooms.crosscultural.title")}
              description={t("rooms.crosscultural.description")}
              href="/crosscultural"
              pattern={signaturePatterns.crosscultural}
            />
          </div>

          {/* Depth-psychology rooms — middle row (Threshold, Archetypes) */}
          <div className="mt-20 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-2 md:gap-10">
            <RoomCard
              index={3}
              title={t("rooms.threshold.title")}
              description={t("rooms.threshold.description")}
              href="/threshold"
              pattern={signaturePatterns.mirror}
            />
            <RoomCard
              index={4}
              title={t("rooms.archetypes.title")}
              description={t("rooms.archetypes.description")}
              href="/archetypes"
              pattern={signaturePatterns.crosscultural}
            />
          </div>

          {/* Literary rooms — Faust and Dante, the third language.
              Sit on the same horizontal as Threshold/Archetypes, in
              their own row, to mark them as the contemplative
              tier's literary extension rather than a sub-grouping. */}
          <div className="mt-20 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-2 md:gap-10">
            <RoomCard
              index={5}
              title={t("rooms.faust.title")}
              description={t("rooms.faust.description")}
              href="/faust"
              pattern={signaturePatterns.mirror}
            />
            <RoomCard
              index={6}
              title={t("rooms.dante.title")}
              description={t("rooms.dante.description")}
              href="/dante"
              pattern={signaturePatterns.crosscultural}
            />
          </div>

          {/* Deepest descent — Cellular alone */}
          <div className="mt-20 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-12">
            <div aria-hidden className="hidden md:col-span-4 md:block" />
            <div className="md:col-span-4">
              <RoomCard
                index={7}
                title={t("rooms.cellular.title")}
                description={t("rooms.cellular.description")}
                href="/cellular"
                pattern={signaturePatterns.mirror}
              />
            </div>
            <div aria-hidden className="hidden md:col-span-4 md:block" />
          </div>
        </div>
      </ScrollScene>

      {/* PR 3 — The Instrument. Atlas, Bridges, Tours.
          Sits between the room grid (Shot 3) and the insight
          cards (Shot 4) as a quieter, more reference-y register.
          No ScrollScene wrapper on purpose — these sections
          shouldn't compete with the room grid's choreography. */}
      <section className="relative px-6 pt-32 pb-12 md:px-10 md:pt-40 md:pb-16">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="md:mx-auto md:max-w-[40rem] md:text-center">
            <Caption uppercase as="p" className="text-brass">
              {t("instrument.section")}
            </Caption>
            <Heading className="mt-8 md:text-display md:font-[200]">
              {t("instrument.heading")}
            </Heading>
            <Body className="text-bone-cream/80 mt-6">
              {t("instrument.body")}
            </Body>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-2 md:gap-10 lg:grid-cols-4">
            <RoomCard
              index={0}
              title={t("rooms.atlas.title")}
              description={t("rooms.atlas.description")}
              href="/atlas"
              pattern={signaturePatterns.atlas}
            />
            <RoomCard
              index={1}
              title={t("rooms.bridges.title")}
              description={t("rooms.bridges.description")}
              href="/bridges"
              pattern={signaturePatterns.bridges}
            />
            <RoomCard
              index={2}
              title={t("rooms.tours.title")}
              description={t("rooms.tours.description")}
              href="/tours"
              pattern={signaturePatterns.tours}
            />
            {/* PR 7: site-map card joins the Instrument row. */}
            <RoomCard
              index={3}
              title={t("rooms.map.title")}
              description={t("rooms.map.description")}
              href="/map"
              pattern={signaturePatterns.map}
            />
          </div>
        </div>
      </section>

      {/* PR 3 — The Long Form. Depth Psychology + Field Notes.
          Two-card row, same quieter register. */}
      <section className="relative px-6 pt-20 pb-32 md:px-10 md:pt-24 md:pb-40">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="md:mx-auto md:max-w-[40rem] md:text-center">
            <Caption uppercase as="p" className="text-brass">
              {t("longform.section")}
            </Caption>
            <Heading className="mt-8 md:text-display md:font-[200]">
              {t("longform.heading")}
            </Heading>
            <Body className="text-bone-cream/80 mt-6">
              {t("longform.body")}
            </Body>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-2 md:gap-10">
            <RoomCard
              index={0}
              title={t("rooms.depthPsychology.title")}
              description={t("rooms.depthPsychology.description")}
              href="/depth-psychology"
              pattern={signaturePatterns.depthPsychology}
            />
            <RoomCard
              index={1}
              title={t("rooms.fieldNotes.title")}
              description={t("rooms.fieldNotes.description")}
              href="/field-notes"
              pattern={signaturePatterns.fieldNotes}
            />
          </div>
        </div>
      </section>

      {/* Shot 4 — Insight cards with parallax */}
      <ScrollScene
        {...shot4}
        className="relative px-6 py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto max-w-[1100px]">
          <Caption uppercase as="p" className="text-brass">
            {t("insights.section")}
          </Caption>
          <div className="mt-12 space-y-20 md:space-y-28">
            <ParallaxLayer speed={0.95}>
              {/* Visual-elevation Fix 5: as the "language is a brain
                  event" card enters the viewport, the inferior
                  frontal gyrus glows in via a transient parcel
                  activation override. Holds while card1 is on
                  screen; resets on leave. Pinning is delegated to
                  the existing ScrollScene; this just fires the
                  brain cue, so no scroll-trigger conflict. */}
              <MirrorCueOnScroll>
                <InsightCard
                  index={0}
                  headline={t("insights.card1.headline")}
                  body={t("insights.card1.body")}
                />
              </MirrorCueOnScroll>
            </ParallaxLayer>
            <ParallaxLayer speed={1.05}>
              <InsightCard
                index={1}
                headline={t("insights.card2.headline")}
                body={t("insights.card2.body")}
              />
            </ParallaxLayer>
            <ParallaxLayer speed={0.92}>
              <InsightCard
                index={2}
                headline={t("insights.card3.headline")}
                body={t("insights.card3.body")}
              />
            </ParallaxLayer>
          </div>
        </div>
      </ScrollScene>

      {/* Shot 5 — Begin */}
      <ScrollScene
        {...shot5}
        className="relative flex min-h-[80vh] items-center justify-center px-6"
      >
        <div className="mx-auto max-w-[36rem] text-center">
          <Display italic as="h2" className="text-bone-cream">
            {t("begin.heading")}
          </Display>
          <div className="mt-14 flex flex-wrap justify-center gap-3">
            <Link
              href="/mirror"
              data-hover
              className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-6 py-3 transition-colors duration-300 font-editorial text-caption uppercase tracking-[0.28em]"
            >
              {t("begin.mirror")}
            </Link>
            <Link
              href="/music"
              data-hover
              className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-6 py-3 transition-colors duration-300 font-editorial text-caption uppercase tracking-[0.28em]"
            >
              {t("begin.music")}
            </Link>
            <Link
              href="/crosscultural"
              data-hover
              className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-6 py-3 transition-colors duration-300 font-editorial text-caption uppercase tracking-[0.28em]"
            >
              {t("begin.crosscultural")}
            </Link>
          </div>
        </div>
      </ScrollScene>

      {/* PR 9: inline home footer removed — the shared <SiteFooter>
          now lives in app/[locale]/layout.tsx and renders on every
          page including this one. */}
    </>
  );
}
