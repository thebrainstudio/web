import ScrollScene from "@/components/motion/ScrollScene";
import PinnedSequence, {
  PinnedStep,
} from "@/components/motion/PinnedSequence";
import ParallaxLayer from "@/components/motion/ParallaxLayer";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import CitationList from "@/components/about/CitationList";
import {
  Body,
  Caption,
  Display,
  Hand,
  Heading,
} from "@/components/typography/Typography";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { generateRoomMetadata } from "@/lib/seo";

// audit-fix: Task 4. Per-page og:url + canonical + alternates. About
// isn't in home.rooms, so we pass an English fallback that's still
// canonical for the en page; non-English locales get the same OG since
// the SEO title is brand-level rather than per-locale here.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateRoomMetadata({
    locale,
    slug: "about",
    fallback: {
      title: "About · The Brain Studio",
      description:
        "Who built this, what TRIBE is and isn't, citations, and the editorial decisions that shape the rooms.",
    },
  });
}

/**
 * Phase 9 — About.
 *
 * Long-form scroll essay using PinnedSequence + ParallaxLayer.
 *   1  Opening line
 *   2  What TRIBE is (pinned three steps)
 *   3  What TRIBE does not do (the honest limitations)
 *   4  The Jung reference, once, in context
 *   4b On holding two languages
 *   4b-2 Where Jung was right, where he was wrong
 *   4c Further reading
 *   5  Citations (pulled from lib/citations.ts)
 *   6  Credits
 *   7  Roadmap
 *   8  Closing line with amber-lamp glow
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <>
      {/* 1 — Opening */}
      <ScrollScene
        id="about-open"
        brain={{
          position: [0, 0.2, 0],
          scale: 0.95,
          rotation: [0, 0.12, 0],
          activations: {},
        }}
        lighting="cinematic"
        meshResolution="fsaverage6"
        className="relative flex min-h-[90vh] items-center px-6 pt-36 md:px-10 md:pt-44"
      >
        <div className="mx-auto max-w-[44rem]">
          <Caption uppercase className="text-brass">
            {t("opening.label")}
          </Caption>
          <Display italic className="mt-10">
            {t("opening.heading")}
          </Display>
          <Body className="text-bone-cream/65 mt-10 max-w-[34rem]">
            {t("opening.body")}
          </Body>
        </div>
      </ScrollScene>

      {/* 2 — What TRIBE is (pinned three steps) */}
      <ScrollScene
        id="about-what"
        brain={{
          position: [-0.95, 0, 0],
          scale: 0.72,
          rotation: [0, 0.32, 0],
          activations: {},
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
                  {t("what.step1.label")}
                </Caption>
                <Heading className="mt-6">
                  {t("what.step1.heading")}
                </Heading>
                <Body className="text-bone-cream/70 mt-6">
                  {t("what.step1.body")}
                </Body>
              </div>
            </PinnedStep>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <Caption uppercase className="text-brass">
                  {t("what.step2.label")}
                </Caption>
                <Heading italic className="mt-6">
                  {t("what.step2.heading")}
                </Heading>
                <Body className="text-bone-cream/70 mt-6">
                  {t("what.step2.body")}
                </Body>
              </div>
            </PinnedStep>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <Caption uppercase className="text-brass">
                  {t("what.step3.label")}
                </Caption>
                <Heading className="mt-6">
                  {t("what.step3.heading")}
                </Heading>
                <Body className="text-bone-cream/70 mt-6">
                  {t("what.step3.body")}
                </Body>
              </div>
            </PinnedStep>
          </PinnedSequence>
        </div>
      </ScrollScene>

      {/* 3 — What it doesn't do */}
      <ScrollScene
        id="about-isnt"
        brain={{
          position: [0.85, -0.05, 0],
          scale: 0.55,
          rotation: [0, -0.4, 0],
          activations: {},
        }}
        lighting="clinical"
        className="relative px-6 py-24 md:px-10 md:py-40"
      >
        <div className="mx-auto max-w-[44rem]">
          <Caption uppercase className="text-brass">
            {t("isnt.label")}
          </Caption>
          <Heading className="mt-6">
            {t("isnt.heading")}
          </Heading>

          <ParallaxLayer speed={0.92}>
            <Body className="text-bone-cream/70 mt-10">
              {t("isnt.body1")}
            </Body>
          </ParallaxLayer>

          <ParallaxLayer speed={1.05}>
            <Body className="text-bone-cream/70 mt-8">
              {t("isnt.body2")}
            </Body>
          </ParallaxLayer>

          <ParallaxLayer speed={0.96}>
            <Body className="text-bone-cream/70 mt-8">
              {t("isnt.body3")}
            </Body>
          </ParallaxLayer>

          <ParallaxLayer speed={1.02}>
            <Body italic className="text-bone-cream/70 mt-10">
              {t("isnt.body4")}
            </Body>
          </ParallaxLayer>
        </div>
      </ScrollScene>

      {/* 4 — Jung */}
      <section className="relative px-6 py-32 md:px-10 md:py-48">
        <div className="mx-auto max-w-[40rem]">
          <Caption uppercase className="text-brass">
            {t("jung.label")}
          </Caption>
          <Body className="text-bone-cream/80 mt-10 text-balance text-lg leading-[1.7]">
            {t("jung.body")}
          </Body>
          <p className="mt-10">
            <Hand className="text-cyan-glow">{t("jung.footnote")}</Hand>
          </p>
        </div>
      </section>

      {/* 4b — On holding two languages */}
      <section className="relative px-6 py-32 md:px-10 md:py-48">
        <div className="mx-auto max-w-[40rem]">
          <Caption uppercase className="text-brass">
            {t("twoLanguages.label")}
          </Caption>
          <Heading className="mt-6 font-[200]">
            {t("twoLanguages.heading")}
          </Heading>
          <div className="mt-12 space-y-6">
            <Body className="text-bone-cream/85">{t("twoLanguages.body1")}</Body>
            <Body className="text-bone-cream/85">{t("twoLanguages.body2")}</Body>
            <Body className="text-bone-cream/85">{t("twoLanguages.body3")}</Body>
            <Body className="text-bone-cream/85">{t("twoLanguages.body4")}</Body>
            <Body className="text-bone-cream/85">{t("twoLanguages.body5")}</Body>
            <Body italic className="text-bone-cream/80 mt-2">
              {t("twoLanguages.body6")}
            </Body>
          </div>
        </div>
      </section>

      {/* 4b-2 — Where Jung was right, where he was wrong */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[40rem]">
          <Caption uppercase className="text-brass">
            {t("balance.label")}
          </Caption>
          <Heading className="mt-6 font-[200]">
            {t("balance.heading")}
          </Heading>
          <Body className="text-bone-cream/85 mt-10">
            {t("balance.intro")}
          </Body>

          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10">
            <div>
              <Caption uppercase className="text-brass">
                {t("balance.rightLabel")}
              </Caption>
              <ul className="mt-6 space-y-5">
                {(["right1", "right2", "right3", "right4", "right5"] as const).map(
                  (key) => (
                    <li key={key}>
                      <Body className="text-bone-cream/85">
                        {t(`balance.${key}`)}
                      </Body>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <Caption uppercase className="text-brass">
                {t("balance.wrongLabel")}
              </Caption>
              <ul className="mt-6 space-y-5">
                {(["wrong1", "wrong2", "wrong3", "wrong4", "wrong5"] as const).map(
                  (key) => (
                    <li key={key}>
                      <Body className="text-bone-cream/85">
                        {t(`balance.${key}`)}
                      </Body>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <Body italic className="text-bone-cream/80 mt-12 text-lg leading-[1.6]">
            {t("balance.closing")}
          </Body>
        </div>
      </section>

      {/* 4c — Further reading */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[40rem]">
          <Caption uppercase className="text-brass">
            {t("reading.label")}
          </Caption>
          <Heading className="mt-6 font-[200]">
            {t("reading.heading")}
          </Heading>

          <div className="mt-12">
            <Caption uppercase className="text-bone-cream/70">
              {t("reading.neuroLabel")}
            </Caption>
            <ul className="mt-4 space-y-4">
              <li>
                <Body className="text-bone-cream/85">
                  Solms, M. <em>The Hidden Spring.</em> 2021.
                  <Body italic className="text-bone-cream/70 mt-1">
                    {t("reading.solmsDesc")}
                  </Body>
                </Body>
              </li>
              <li>
                <Body className="text-bone-cream/85">
                  Damasio, A. <em>The Feeling of What Happens.</em> 1999.
                  <Body italic className="text-bone-cream/70 mt-1">
                    {t("reading.damasioDesc")}
                  </Body>
                </Body>
              </li>
              <li>
                <Body className="text-bone-cream/85">
                  Sacks, O. <em>The Man Who Mistook His Wife for a Hat.</em> 1985.
                  <Body italic className="text-bone-cream/70 mt-1">
                    {t("reading.sacksDesc")}
                  </Body>
                </Body>
              </li>
              <li>
                <Body className="text-bone-cream/85">
                  Kandel, E. R. <em>In Search of Memory.</em> 2006.
                  <Body italic className="text-bone-cream/70 mt-1">
                    {t("reading.kandelDesc")}
                  </Body>
                </Body>
              </li>
            </ul>
          </div>

          <div className="mt-12">
            <Caption uppercase className="text-bone-cream/70">
              {t("reading.jungLabel")}
            </Caption>
            <ul className="mt-4 space-y-4">
              <li>
                <Body className="text-bone-cream/85">
                  Jung, C. G. <em>Memories, Dreams, Reflections.</em> 1963.
                  <Body italic className="text-bone-cream/70 mt-1">
                    {t("reading.mdrDesc")}
                  </Body>
                </Body>
              </li>
              <li>
                <Body className="text-bone-cream/85">
                  Jung, C. G. <em>The Archetypes and the Collective Unconscious.</em> CW 9i. 1959.
                  <Body italic className="text-bone-cream/70 mt-1">
                    {t("reading.cw9Desc")}
                  </Body>
                </Body>
              </li>
            </ul>
          </div>

          <div className="mt-12">
            <Caption uppercase className="text-bone-cream/70">
              {t("reading.contemporaryLabel")}
            </Caption>
            <ul className="mt-4 space-y-4">
              <li>
                <Body className="text-bone-cream/85">
                  McGilchrist, I. <em>The Master and His Emissary.</em> 2009.
                  <Body italic className="text-bone-cream/70 mt-1">
                    {t("reading.mcgilchristDesc")}
                  </Body>
                </Body>
              </li>
              <li>
                <Body className="text-bone-cream/85">
                  Seth, A. <em>Being You.</em> 2021.
                  <Body italic className="text-bone-cream/70 mt-1">
                    {t("reading.sethDesc")}
                  </Body>
                </Body>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5 — Citations */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[920px]">
          <Caption uppercase className="text-brass">
            {t("citations.label")}
          </Caption>
          <Heading className="mt-6">
            {t("citations.heading")}
          </Heading>
          <Body className="text-bone-cream/65 mt-6 max-w-[36rem]">
            {t("citations.body")}
          </Body>
          <CitationList />
        </div>
      </section>

      {/* 6 — Credits */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[920px]">
          <Caption uppercase className="text-brass">
            {t("credits.label")}
          </Caption>
          <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-4">
              <Caption uppercase className="text-bone-cream/70">
                {t("credits.modelLabel")}
              </Caption>
              <Heading as="h3" className="mt-3 font-[200]">
                {t("credits.modelTitle")}
              </Heading>
              <Body className="text-bone-cream/60 mt-3">
                {t("credits.modelBody")}
              </Body>
            </div>
            <div className="md:col-span-4">
              <Caption uppercase className="text-bone-cream/70">
                {t("credits.builtLabel")}
              </Caption>
              <Heading as="h3" className="mt-3 font-[200]">
                {t("credits.builtTitle")}
              </Heading>
              <Body className="text-bone-cream/60 mt-3">
                {t("credits.builtBody")}
              </Body>
            </div>
            <div className="md:col-span-4">
              <Caption uppercase className="text-bone-cream/70">
                {t("credits.homeLabel")}
              </Caption>
              <Heading as="h3" className="mt-3 font-[200]">
                {t("credits.homeTitle")}
              </Heading>
              <Body className="text-bone-cream/60 mt-3">
                {t("credits.homeBody")}
              </Body>
            </div>
          </div>
        </div>
      </section>

      {/* 6b — How to use this brain (added with the connectome + bridges build) */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[920px]">
          <Caption uppercase className="text-brass">
            {t("howToUse.label")}
          </Caption>
          <Heading className="mt-6 font-[200]">
            {t("howToUse.heading")}
          </Heading>
          <Body italic className="text-bone-cream/65 mt-6 max-w-[36rem]">
            {t("howToUse.intro")}
          </Body>

          <ul className="mt-12 space-y-8">
            {(
              [
                "search",
                "atlas",
                "bridges",
                "connectome",
                "cellular",
                "tours",
                "depthPsychology",
              ] as const
            ).map((key) => (
              <li
                key={key}
                className="grid grid-cols-1 gap-2 md:grid-cols-12 md:gap-6"
              >
                <Caption
                  uppercase
                  className="text-brass tracking-[0.22em] md:col-span-3"
                >
                  {t(`howToUse.${key}.label`)}
                </Caption>
                <div className="md:col-span-9">
                  <Body className="text-bone-cream/85">
                    {t(`howToUse.${key}.body`)}
                  </Body>
                </div>
              </li>
            ))}
          </ul>

          <Body italic className="text-bone-cream/70 mt-12 max-w-[36rem]">
            {t("howToUse.closing")}
          </Body>
        </div>
      </section>

      {/* 7 — Roadmap */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[920px]">
          <Caption uppercase className="text-brass">
            {t("roadmap.label")}
          </Caption>
          <Heading className="mt-6">{t("roadmap.heading")}</Heading>
          <ul className="mt-10 space-y-4">
            {(
              [
                ["10", t("roadmap.phase10")],
                ["11", t("roadmap.phase11")],
                ["12", t("roadmap.phase12")],
              ] as const
            ).map(([n, body]) => (
              <li key={n} className="flex items-baseline gap-5">
                <Caption uppercase className="text-brass shrink-0">
                  {t("roadmap.phaseLabel")} {n}
                </Caption>
                <Body className="text-bone-cream/70">{body}</Body>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8 — Closing line with amber-lamp glow (approved placement) */}
      <ScrollScene
        id="about-close"
        brain={{
          position: [0, 0.45, 0],
          scale: 0.6,
          rotation: [0, 0, 0],
          activations: {},
        }}
        lighting="warm"
        meshResolution="fsaverage6"
        className="relative flex min-h-[80vh] items-center px-6 pb-24 md:px-10"
      >
        <AtmosphericGlow
          preset="amber-lamp"
          position="bottom"
          intensity="subtle"
          animate
        />
        <div className="mx-auto max-w-[40rem] text-center">
          <Display italic>{t("closing.display")}</Display>
          <p className="mt-12">
            <Hand className="text-bone-cream/70">{t("closing.hand")}</Hand>
          </p>
        </div>
      </ScrollScene>

      <footer className="relative border-t border-bone-cream/10 px-6 py-12 text-center md:px-10">
        <Caption uppercase className="text-bone-cream/65">
          {t("footer.line")}
        </Caption>
      </footer>
    </>
  );
}
