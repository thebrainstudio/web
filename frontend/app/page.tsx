import ScrollScene from "@/components/motion/ScrollScene";
import PinnedSequence, { PinnedStep } from "@/components/motion/PinnedSequence";
import ParallaxLayer from "@/components/motion/ParallaxLayer";
import RoomCard from "@/components/home/RoomCard";
import InsightCard from "@/components/home/InsightCard";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import {
  Display,
  Heading,
  Body,
  Caption,
} from "@/components/typography/Typography";
import HeroDisplay from "@/components/home/HeroDisplay";
import { homeScrollChoreography, signaturePatterns } from "@/lib/scrollScenes";

/**
 * Home page — continuous 5-shot scroll cinema. Persistent brain reads its
 * targets from `homeScrollChoreography`. Atmospherics: vertical wash (body)
 * + film grain (layout) + two surgical glows here (Shot 1 amber-lamp,
 * Shot 3 cool-cathedral).
 */
export default function Home() {
  const [shot1, shot2, shot3, shot4, shot5] = homeScrollChoreography;

  return (
    <>
      {/* Shot 1 — Cold open. Amber lamp glow + animated. */}
      <ScrollScene
        {...shot1}
        className="relative flex min-h-[110vh] items-center justify-center px-6"
      >
        <AtmosphericGlow
          preset="amber-lamp"
          position="top"
          intensity="medium"
          animate
        />
        <div className="mx-auto max-w-[44rem] text-center">
          <Caption uppercase as="p" className="text-brass">
            The Brain Studio
          </Caption>
          <HeroDisplay
            line1="There is a model"
            line2="that predicts"
            line3="what your brain will do."
            className="mt-10"
          />
          <Caption uppercase as="p" className="text-bone-cream/55 mt-12">
            Scroll to see
          </Caption>
          <p
            aria-hidden
            className="text-bone-cream/30 mt-3 select-none text-xl"
          >
            ↓
          </p>
        </div>
      </ScrollScene>

      {/* Shot 2 — Brain glides left. Pinned 3-step TRIBE explanation. */}
      <ScrollScene
        {...shot2}
        className="relative grid min-h-[120vh] grid-cols-1 px-6 md:grid-cols-12 md:px-10"
      >
        <div aria-hidden className="md:col-span-5" />
        <div className="md:col-span-7">
          <PinnedSequence steps={3}>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <Caption uppercase as="p" className="text-brass">
                  How it works · I
                </Caption>
                <Heading className="mt-6">
                  TRIBE is a brain-encoding model.
                </Heading>
                <Body className="text-bone-cream/70 mt-6 max-w-[30rem]">
                  Trained on thousands of hours of fMRI recordings, it learns
                  the map from a stimulus — a sentence, a passage, a piece of
                  music — to the brain&apos;s response. Then it predicts.
                </Body>
              </div>
            </PinnedStep>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <Caption uppercase as="p" className="text-brass">
                  How it works · II
                </Caption>
                <Heading italic className="mt-6">
                  It is a model of the average brain.
                </Heading>
                <Body className="text-bone-cream/70 mt-6 max-w-[30rem]">
                  Not your brain. Not yet anyone&apos;s. A weighted echo of the
                  participants who lay still in scanners while sentences played.
                  What you see is the model&apos;s best guess about how a brain
                  like theirs would respond.
                </Body>
              </div>
            </PinnedStep>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <Caption uppercase as="p" className="text-brass">
                  How it works · III
                </Caption>
                <Heading className="mt-6">
                  That gap — between model and you — is part of the show.
                </Heading>
                <Body italic className="text-bone-cream/70 mt-6 max-w-[30rem]">
                  We&apos;ll surface it. The site keeps the limits of TRIBE
                  visible, in every room, so you can use the predictions as a
                  mirror without mistaking them for a portrait.
                </Body>
              </div>
            </PinnedStep>
          </PinnedSequence>
        </div>
      </ScrollScene>

      {/* Shot 3 — Three rooms. Cool-cathedral glow (subtle, no position). */}
      <ScrollScene
        {...shot3}
        className="relative flex min-h-[120vh] items-center px-6 md:px-10"
      >
        <AtmosphericGlow preset="cool-cathedral" intensity="subtle" />
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="md:mx-auto md:max-w-[40rem] md:text-center">
            <Caption uppercase as="p" className="text-brass">
              Three rooms
            </Caption>
            <Heading className="mt-8 md:text-display md:font-[200]">
              We built three rooms to show you.
            </Heading>
            <Body className="text-bone-cream/65 mt-6">
              Hover a doorway to see the pattern. Step inside when you&apos;re
              ready.
            </Body>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-14 md:mt-24 md:grid-cols-2 md:gap-10 lg:grid-cols-4">
            <RoomCard
              index={0}
              title="Brain Mirror"
              description="Paste any text. Watch what your writing looks like underneath."
              href="/mirror"
              pattern={signaturePatterns.mirror}
            />
            <RoomCard
              index={1}
              title="NeuroMusic Lab"
              description="Hear how sound moves the same regions that move you."
              href="/music"
              pattern={signaturePatterns.music}
            />
            <RoomCard
              index={2}
              title="Cross-Cultural Brain"
              description="Where the model breaks down across languages — and what the silence reveals."
              href="/crosscultural"
              pattern={signaturePatterns.crosscultural}
            />
            <RoomCard
              index={3}
              title="Cellular View"
              description="Descend into real neuron reconstructions and watch a synapse fire."
              href="/cellular"
              pattern={signaturePatterns.mirror}
            />
          </div>
        </div>
      </ScrollScene>

      {/* Shot 4 — Insight cards with parallax */}
      <ScrollScene
        {...shot4}
        className="relative px-6 py-32 md:px-10 md:py-48"
      >
        <div className="mx-auto max-w-[1100px]">
          <Caption uppercase as="p" className="text-brass">
            What you&apos;ll learn
          </Caption>
          <div className="mt-16 space-y-32 md:space-y-48">
            <ParallaxLayer speed={0.95}>
              <InsightCard
                index={0}
                headline="Language is a brain event before it is a sentence."
                body="Watch the inferior frontal gyrus warm before a word is found. The model lets us see meaning under construction — the half-second when a thought is still gathering itself."
              />
            </ParallaxLayer>
            <ParallaxLayer speed={1.05}>
              <InsightCard
                index={1}
                headline="Music moves the same regions that move you."
                body="Sigur Rós, Coltrane, and a Thai luk thung lullaby all bring different fingerprints to the auditory cortex — and to the default-mode network, the part of you that's still you when you stop trying."
              />
            </ParallaxLayer>
            <ParallaxLayer speed={0.92}>
              <InsightCard
                index={2}
                headline="What a model can&rsquo;t translate is itself a kind of knowledge."
                body="TRIBE was trained on English. The Thai prompts are not just a different input — they reveal the shape of what the model never learned. The silence is part of the finding."
              />
            </ParallaxLayer>
          </div>
        </div>
      </ScrollScene>

      {/* Shot 5 — Begin */}
      <ScrollScene
        {...shot5}
        className="relative flex min-h-[100vh] items-center justify-center px-6"
      >
        <div className="mx-auto max-w-[36rem] text-center">
          <Display italic as="h2" className="text-bone-cream">
            Begin.
          </Display>
          <div className="mt-14 flex flex-wrap justify-center gap-3">
            <a
              href="/mirror"
              data-hover
              className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-6 py-3 transition-colors duration-300 font-editorial text-caption uppercase tracking-[0.28em]"
            >
              Brain Mirror
            </a>
            <a
              href="/music"
              data-hover
              className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-6 py-3 transition-colors duration-300 font-editorial text-caption uppercase tracking-[0.28em]"
            >
              NeuroMusic Lab
            </a>
            <a
              href="/crosscultural"
              data-hover
              className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-6 py-3 transition-colors duration-300 font-editorial text-caption uppercase tracking-[0.28em]"
            >
              Cross-Cultural Brain
            </a>
          </div>
        </div>
      </ScrollScene>

      <footer className="relative border-t border-bone-cream/10 px-6 py-12 text-center md:px-10">
        <Caption uppercase className="text-bone-cream/40">
          Built at Chulalongkorn JIPP
        </Caption>
        <Caption uppercase className="text-bone-cream/40 mx-3" aria-hidden>
          ·
        </Caption>
        <Caption uppercase className="text-bone-cream/40">
          TRIBE v2 encoder
        </Caption>
        <Caption uppercase className="text-bone-cream/40 mx-3" aria-hidden>
          ·
        </Caption>
        <a
          href="/about"
          className="hover:text-bone-cream/80 transition-colors duration-200"
        >
          <Caption uppercase className="text-bone-cream/40">
            About
          </Caption>
        </a>
      </footer>
    </>
  );
}
