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

/**
 * Phase 9 — About.
 *
 * Long-form scroll essay using PinnedSequence + ParallaxLayer.
 *   1  Opening line
 *   2  What TRIBE is (pinned three steps)
 *   3  What TRIBE does not do (the honest limitations)
 *   4  The Jung reference, once, in context
 *   5  Citations (pulled from lib/citations.ts)
 *   6  Credits
 *   7  Roadmap
 *   8  Closing line with amber-lamp glow (the existing approved placement)
 */
export default function AboutPage() {
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
            About · Phase 9
          </Caption>
          <Display italic className="mt-10">
            A 21st-century version of an older question.
          </Display>
          <Body className="text-bone-cream/65 mt-10 max-w-[34rem]">
            This site is an experiment in seeing the mind through a
            brain-encoding model. What follows is what the model is,
            what it isn&apos;t, and the people whose work it builds on.
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
                  What TRIBE is · I
                </Caption>
                <Heading className="mt-6">
                  A model that learned the map from stimulus to fMRI.
                </Heading>
                <Body className="text-bone-cream/70 mt-6">
                  Meta&apos;s TRIBE v2 was trained on thousands of hours
                  of recordings in which participants listened to, watched,
                  or read material while inside an MRI scanner. It learns
                  to predict where in the cortex a given stimulus tends
                  to light up — not in any one person, but on average.
                </Body>
              </div>
            </PinnedStep>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <Caption uppercase className="text-brass">
                  What TRIBE is · II
                </Caption>
                <Heading italic className="mt-6">
                  An encoder, not a decoder.
                </Heading>
                <Body className="text-bone-cream/70 mt-6">
                  It maps inputs to brain responses. It does not read your
                  brain. It does not invert the response back into a
                  thought. The arrow points the way it points; this site
                  uses it that way.
                </Body>
              </div>
            </PinnedStep>
            <PinnedStep>
              <div className="max-w-[34rem]">
                <Caption uppercase className="text-brass">
                  What TRIBE is · III
                </Caption>
                <Heading className="mt-6">
                  A weighted echo of the participants.
                </Heading>
                <Body className="text-bone-cream/70 mt-6">
                  The predicted activation is something like the average
                  brain&apos;s response to that input. The gap between
                  that average and yours is part of what this site means
                  to surface, never to hide.
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
            What it does not do
          </Caption>
          <Heading className="mt-6">
            Honest limitations, surfaced unapologetically.
          </Heading>

          <ParallaxLayer speed={0.92}>
            <Body className="text-bone-cream/70 mt-10">
              The model is trained on English. Cross-cultural Brain shows
              what happens when you feed it Thai: the language regions
              respond less, the prediction degrades, and the silence is
              real. A model that can&apos;t carry a language carries
              fewer minds.
            </Body>
          </ParallaxLayer>

          <ParallaxLayer speed={1.05}>
            <Body className="text-bone-cream/70 mt-8">
              fMRI itself is slow. The hemodynamic response trails the
              neural one by roughly five seconds. Anything you see here
              is, by design, a prediction of a measurement that lags
              behind the thought.
            </Body>
          </ParallaxLayer>

          <ParallaxLayer speed={0.96}>
            <Body className="text-bone-cream/70 mt-8">
              Region labels are a working vocabulary, not anatomy. The
              brain is networked; functions are distributed; mapping a
              feeling to a single bright spot is a story we tell because
              the story is useful. The model does not believe in the
              story. Neither should you.
            </Body>
          </ParallaxLayer>

          <ParallaxLayer speed={1.02}>
            <Body italic className="text-bone-cream/55 mt-10">
              The disclaimers above are the architecture. The site only
              works if you keep them in view while you watch.
            </Body>
          </ParallaxLayer>
        </div>
      </ScrollScene>

      {/* 4 — Jung */}
      <section className="relative px-6 py-32 md:px-10 md:py-48">
        <div className="mx-auto max-w-[40rem]">
          <Caption uppercase className="text-brass">
            One older idea
          </Caption>
          <Body className="text-bone-cream/80 mt-10 text-balance text-lg leading-[1.7]">
            In the early 20th century, Carl Jung gave us a vocabulary for
            parts of the mind that don&apos;t speak. A century later,
            brain-encoding models are trying to render those parts
            visible. Different language, related project.
          </Body>
          <p className="mt-10">
            <Hand className="text-cyan-glow">— a footnote, lightly</Hand>
          </p>
        </div>
      </section>

      {/* 5 — Citations */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[920px]">
          <Caption uppercase className="text-brass">
            Citations
          </Caption>
          <Heading className="mt-6">
            Standing on the shoulders of well-cited giants.
          </Heading>
          <Body className="text-bone-cream/65 mt-6 max-w-[36rem]">
            Every strong claim in this site points at one of these papers.
            When you read a line about Broca&apos;s region or the
            default-mode network or the amygdala that doesn&apos;t feel
            confident, this is where the confidence comes from.
          </Body>
          <CitationList />
        </div>
      </section>

      {/* 6 — Credits */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[920px]">
          <Caption uppercase className="text-brass">
            Credits
          </Caption>
          <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-4">
              <Caption uppercase className="text-bone-cream/55">
                Model
              </Caption>
              <Heading as="h3" className="mt-3 font-[200]">
                Meta&nbsp;AI / FAIR
              </Heading>
              <Body className="text-bone-cream/60 mt-3">
                TRIBE v2 brain encoder. The site uses the cached checkpoint
                only; no Meta-specific data leaves the page.
              </Body>
            </div>
            <div className="md:col-span-4">
              <Caption uppercase className="text-bone-cream/55">
                Built with
              </Caption>
              <Heading as="h3" className="mt-3 font-[200]">
                Anthropic Claude
              </Heading>
              <Body className="text-bone-cream/60 mt-3">
                The scaffolding, the typography system, the atmospherics,
                this room — all collaboratively engineered.
              </Body>
            </div>
            <div className="md:col-span-4">
              <Caption uppercase className="text-bone-cream/55">
                Home
              </Caption>
              <Heading as="h3" className="mt-3 font-[200]">
                Chulalongkorn JIPP
              </Heading>
              <Body className="text-bone-cream/60 mt-3">
                Joint International Postgraduate Programme in Cognitive
                Sciences. Bangkok and the Thai stimulus pairs come from
                here.
              </Body>
            </div>
          </div>
        </div>
      </section>

      {/* 7 — Roadmap */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[920px]">
          <Caption uppercase className="text-brass">
            Roadmap
          </Caption>
          <Heading className="mt-6">What still wants building.</Heading>
          <ul className="mt-10 space-y-4">
            {[
              ["10", "Real TRIBE inference wired to a FastAPI backend (currently the predictor runs locally on lexical features)."],
              ["11", "Pair submission form, Phase-11 audio licensing, performance pass."],
              ["12", "Final accessibility audit + a long-form annotation layer over the citations."],
            ].map(([n, body]) => (
              <li key={n} className="flex items-baseline gap-5">
                <Caption uppercase className="text-brass shrink-0">
                  Phase {n}
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
          <Display italic>
            What we&apos;re building is small. The intention is not.
          </Display>
          <p className="mt-12">
            <Hand className="text-bone-cream/55">— more soon</Hand>
          </p>
        </div>
      </ScrollScene>

      <footer className="relative border-t border-bone-cream/10 px-6 py-12 text-center md:px-10">
        <Caption uppercase className="text-bone-cream/40">
          The Brain Studio · 2026
        </Caption>
      </footer>
    </>
  );
}
