import ScrollScene from "@/components/motion/ScrollScene";
import PinnedSequence, { PinnedStep } from "@/components/motion/PinnedSequence";
import ParallaxLayer from "@/components/motion/ParallaxLayer";
import RoomCard from "@/components/home/RoomCard";
import InsightCard from "@/components/home/InsightCard";
import { homeScrollChoreography, signaturePatterns } from "@/lib/scrollScenes";

/**
 * The home page is a continuous, scroll-driven 5-shot cinema.
 * The persistent brain reads its targets from `homeScrollChoreography`
 * defined in `lib/scrollScenes.ts`.
 */
export default function Home() {
  const [shot1, shot2, shot3, shot4, shot5] = homeScrollChoreography;

  return (
    <>
      {/* Shot 1 — Cold open */}
      <ScrollScene
        {...shot1}
        className="relative flex min-h-[110vh] items-center justify-center px-6"
      >
        <div className="mx-auto max-w-[44rem] text-center">
          <p className="text-brass font-display text-xs uppercase tracking-[0.36em]">
            The Brain Studio
          </p>
          <h1 className="font-display text-bone-cream mt-10 text-balance text-4xl leading-[1.05] md:text-6xl lg:text-7xl">
            There is a model
            <br className="hidden md:inline" /> that predicts
            <br className="hidden md:inline" /> what your brain will do.
          </h1>
          <p className="text-bone-cream/55 mt-12 text-xs uppercase tracking-[0.36em]">
            Scroll to see
          </p>
          <p
            aria-hidden
            className="text-bone-cream/30 mt-3 select-none text-xl"
          >
            ↓
          </p>
        </div>
      </ScrollScene>

      {/* Shot 2 — Brain glides left, warm; PinnedSequence reveals 3-paragraph
          TRIBE explanation on the right */}
      <ScrollScene
        {...shot2}
        className="relative grid min-h-[120vh] grid-cols-1 px-6 md:grid-cols-12 md:px-10"
      >
        <div aria-hidden className="md:col-span-5" />
        <div className="md:col-span-7">
          <PinnedSequence steps={3}>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <p className="text-brass font-display text-xs uppercase tracking-[0.32em]">
                  How it works · I
                </p>
                <h2 className="font-display text-bone-cream mt-6 text-balance text-3xl leading-[1.15] md:text-4xl">
                  TRIBE is a brain-encoding model.
                </h2>
                <p className="text-bone-cream/70 mt-6 max-w-[30rem] text-base leading-[1.7]">
                  Trained on thousands of hours of fMRI recordings, it learns
                  the map from a stimulus — a sentence, a passage, a piece of
                  music — to the brain&apos;s response. Then it predicts.
                </p>
              </div>
            </PinnedStep>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <p className="text-brass font-display text-xs uppercase tracking-[0.32em]">
                  How it works · II
                </p>
                <h2 className="font-display text-bone-cream mt-6 text-balance text-3xl leading-[1.15] md:text-4xl">
                  It is a model of the average brain.
                </h2>
                <p className="text-bone-cream/70 mt-6 max-w-[30rem] text-base leading-[1.7]">
                  Not your brain. Not yet anyone&apos;s. A weighted echo of the
                  participants who lay still in scanners while sentences played.
                  What you see is the model&apos;s best guess about how a brain
                  like theirs would respond.
                </p>
              </div>
            </PinnedStep>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <p className="text-brass font-display text-xs uppercase tracking-[0.32em]">
                  How it works · III
                </p>
                <h2 className="font-display text-bone-cream mt-6 text-balance text-3xl leading-[1.15] md:text-4xl">
                  That gap — between model and you — is part of the show.
                </h2>
                <p className="text-bone-cream/70 mt-6 max-w-[30rem] text-base leading-[1.7]">
                  We&apos;ll surface it. The site keeps the limits of TRIBE
                  visible, in every room, so you can use the predictions as a
                  mirror without mistaking them for a portrait.
                </p>
              </div>
            </PinnedStep>
          </PinnedSequence>
        </div>
      </ScrollScene>

      {/* Shot 3 — Three rooms */}
      <ScrollScene
        {...shot3}
        className="relative flex min-h-[120vh] items-center px-6 md:px-10"
      >
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="md:mx-auto md:max-w-[40rem] md:text-center">
            <p className="text-brass font-display text-xs uppercase tracking-[0.36em]">
              Three rooms
            </p>
            <h2 className="font-display text-bone-cream mt-8 text-balance text-3xl leading-[1.1] md:text-5xl">
              We built three rooms to show you.
            </h2>
            <p className="text-bone-cream/65 mt-6 text-base leading-[1.7]">
              Hover a doorway to see the pattern. Step inside when you&apos;re
              ready.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-14 md:mt-24 md:grid-cols-3 md:gap-10">
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
          </div>
        </div>
      </ScrollScene>

      {/* Shot 4 — Insight cards with parallax */}
      <ScrollScene
        {...shot4}
        className="relative px-6 py-32 md:px-10 md:py-48"
      >
        <div className="mx-auto max-w-[1100px]">
          <p className="text-brass font-display text-xs uppercase tracking-[0.36em]">
            What you&apos;ll learn
          </p>
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
                body="Sigur Rós, Coltrane, and a Thai luk thung lullaby all bring different fingerprints to the auditory cortex — and to the default-mode network, the part of you that&apos;s still you when you stop trying."
              />
            </ParallaxLayer>
            <ParallaxLayer speed={0.92}>
              <InsightCard
                index={2}
                headline="What a model can&apos;t translate is itself a kind of knowledge."
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
          <h2 className="font-display text-bone-cream text-balance text-5xl md:text-7xl">
            Begin.
          </h2>
          <div className="mt-14 flex flex-wrap justify-center gap-3">
            <a
              href="/mirror"
              data-hover
              className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-6 py-3 text-xs uppercase tracking-[0.28em] transition-colors duration-300"
            >
              Brain Mirror
            </a>
            <a
              href="/music"
              data-hover
              className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-6 py-3 text-xs uppercase tracking-[0.28em] transition-colors duration-300"
            >
              NeuroMusic Lab
            </a>
            <a
              href="/crosscultural"
              data-hover
              className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-6 py-3 text-xs uppercase tracking-[0.28em] transition-colors duration-300"
            >
              Cross-Cultural Brain
            </a>
          </div>
        </div>
      </ScrollScene>

      <footer className="relative border-t border-bone-cream/10 px-6 py-12 text-center text-xs uppercase tracking-[0.28em] text-bone-cream/40 md:px-10">
        <span>Built at Chulalongkorn JIPP</span>
        <span className="mx-3" aria-hidden>·</span>
        <span>TRIBE v2 encoder</span>
        <span className="mx-3" aria-hidden>·</span>
        <a
          href="/about"
          className="hover:text-bone-cream/80 transition-colors duration-200"
        >
          About
        </a>
      </footer>
    </>
  );
}
