import ScrollScene from "@/components/motion/ScrollScene";
import ParallaxLayer from "@/components/motion/ParallaxLayer";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import Mandala from "@/components/decoration/Mandala";
import {
  Body,
  Caption,
  Display,
  Hand,
  Heading,
  Mono,
} from "@/components/typography/Typography";
import { Link } from "@/i18n/navigation";

/**
 * The Threshold — a contemplative essay room between the macro and the
 * cellular. Three movements. Written in full. The persistent brain shrinks
 * to a corner mark while reading. A Fludd mandala rotates very slowly in
 * the bottom-right.
 */
export default function ThresholdPage() {
  return (
    <>
      <Mandala
        src="/mandalas/fludd_microcosm.jpg"
        alt="Robert Fludd, De integra microcosmi harmonia, 1619, Wellcome Collection"
        opacity={0.05}
        rotationSeconds={240}
        position="top-[40%] right-[-12rem]"
        size="w-[44rem]"
      />

      {/* Opening */}
      <ScrollScene
        id="threshold-open"
        brain={{
          position: [1.2, 0.6, 0],
          scale: 0.28,
          rotation: [0, -0.3, 0],
          activations: {},
        }}
        lighting="cinematic"
        className="relative flex min-h-[90vh] items-center px-6 pt-36 md:px-10 md:pt-44"
      >
        <AtmosphericGlow preset="amber-lamp" position="top" intensity="subtle" />
        <div className="mx-auto max-w-[44rem]">
          <Caption uppercase className="text-brass">
            The Threshold
          </Caption>
          <Display italic className="mt-10">
            Two languages name what cannot be fully named in one.
          </Display>
          <Body className="text-bone-cream/65 mt-10 max-w-[34rem]">
            What follows is an essay in three movements about the seam
            between neuroscience and depth psychology — the languages this
            site holds in parallel, and why it holds both.
          </Body>
        </div>
      </ScrollScene>

      {/* Movement 1 — The scale problem */}
      <ScrollScene
        id="threshold-m1"
        brain={{
          position: [1.2, 0.5, 0],
          scale: 0.26,
          rotation: [0, -0.2, 0],
          activations: {},
        }}
        lighting="cinematic"
        className="relative px-6 py-24 md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[40rem]">
          <Heading className="text-brass font-[200]">
            Movement one — the scale problem.
          </Heading>
          <Body className="mt-10">
            A real continuous zoom from the cortical surface to a single
            synapse would cross roughly ten million-fold magnification.
            There is no honest visualization of that descent. Every site
            that pretends otherwise — every animation that swoops from a
            whole brain into a glowing neuron in one continuous take — is
            lying about something specific: that scales connect smoothly,
            and that to look closer is to keep looking at the same thing.
          </Body>
          <Body className="text-bone-cream/85 mt-6">
            What you actually have, when you look closer, is a different
            object. The cortical-surface prediction TRIBE produces and the
            single-cell reconstruction NeuroMorpho holds are not stages of
            one inquiry. They are different inquiries. The interesting
            work happens at the seams, not in the false continuity.
          </Body>
          <Body className="text-bone-cream/85 mt-6">
            The same is true between languages of mind. Neuroscience
            speaks of regions and networks and neurotransmitters and
            timescales of milliseconds. Depth psychology speaks of the
            unconscious, the shadow, individuation, the slow work of
            integrating disowned parts over decades. They do not zoom into
            each other either. The temptation to make them do so is
            understandable: a single explanatory frame is easier to live
            with than two. But the easier frame is not the more honest
            one.
          </Body>
          <ParallaxLayer speed={0.95}>
            <Body italic className="text-bone-cream/60 mt-10">
              Holding two languages is not a failure of synthesis. It is
              the recognition that some questions are bigger than any one
              language for them.
            </Body>
          </ParallaxLayer>
          <Mono variant="label" className="text-bone-cream/35 mt-12 block">
            Movement one · ~290 words · 2 min read
          </Mono>
        </div>
      </ScrollScene>

      <hr className="border-brass/30 mx-auto w-[40%]" />

      {/* Movement 2 — What the unconscious is, in two languages */}
      <ScrollScene
        id="threshold-m2"
        brain={{
          position: [1.2, 0.5, 0],
          scale: 0.26,
          rotation: [0, -0.1, 0],
          activations: {},
        }}
        lighting="warm"
        className="relative px-6 py-24 md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[40rem]">
          <Heading className="text-brass font-[200]">
            Movement two — what the unconscious is, in two languages.
          </Heading>
          <Body className="mt-10">
            In neuroscience, the unconscious is the larger fact about how
            brains work. The conscious window is small. Almost everything
            the brain does — predicting, comparing, deciding, classifying,
            preparing — happens below awareness. The default-mode network
            hums even when no task is asked of it. Implicit memory
            organizes recognition before recall reaches words. Automatic
            affective appraisal flags significance milliseconds before any
            deliberative system catches up. The arithmetic of attention
            and the architecture of perception are mostly invisible to
            the perceiver.
          </Body>
          <Body className="text-bone-cream/85 mt-6">
            In Jung, the unconscious is also the larger fact, but the
            language is different. The unconscious there is not just a
            statistical statement about how much of mind is below
            awareness. It is closer to a territory — with structure, with
            patterns repeating across cultures and across centuries, with
            something like its own intent. Individuation, Jung's term for
            the lifelong work of integrating the disowned, was a process
            with a direction: toward a wholeness that is not the same
            as the ego's idea of itself.
          </Body>
          <Body className="text-bone-cream/85 mt-6">
            Where the two frameworks touch: both agree consciousness is
            the small part. Both agree that something deeper is doing most
            of the work, and that ignoring it produces predictable kinds
            of harm — to the person, to the people around them, to the
            relationships and decisions that get made on the basis of
            self-knowledge that isn't.
          </Body>
          <Body className="text-bone-cream/85 mt-6">
            Where they diverge: Jung's unconscious has direction and
            structure that neuroscience doesn't claim. The Self, the
            archetypes, the symbolic life of the psyche — these are
            phenomenological observations, not neural facts. Neuroscience
            has not endorsed them, and there is no honest move that says
            it has. They live in a register where what matters is the
            felt shape of inner experience, not its mechanism.
          </Body>
          <Body italic className="text-bone-cream/80 mt-8">
            Both languages are true. Neither is sufficient. The
            interesting work, again, happens at the seams.
          </Body>
          <Mono variant="label" className="text-bone-cream/35 mt-12 block">
            Movement two · ~440 words · 3 min read
          </Mono>
        </div>
      </ScrollScene>

      <hr className="border-brass/30 mx-auto w-[40%]" />

      {/* Movement 3 — Why both languages */}
      <ScrollScene
        id="threshold-m3"
        brain={{
          position: [1.2, 0.5, 0],
          scale: 0.3,
          rotation: [0, 0, 0],
          activations: {},
        }}
        lighting="cinematic"
        className="relative px-6 py-24 md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[40rem]">
          <Heading className="text-brass font-[200]">
            Movement three — why both languages.
          </Heading>
          <Body className="mt-10">
            Neuroscience is rigorous about mechanism and weak about
            meaning. It can tell you with extraordinary precision how
            quickly the visual system parses an edge, what cells fire when
            you recognize a face, where in the cortex a sentence is
            assembled. It cannot tell you what the face meant to you, or
            what the sentence was for. The mechanism is exposed; the
            meaning is left to the person living it.
          </Body>
          <Body className="text-bone-cream/85 mt-6">
            Depth psychology is rigorous about meaning and weak about
            mechanism. It has a century of careful phenomenology — careful
            attention to what people actually report about dreams,
            symptoms, transferences, the felt sense of being moved or
            stopped or addressed by something. It does not always know
            what is making any of that happen at the level of cells. It
            does know what it is to live inside it.
          </Body>
          <Body className="text-bone-cream/85 mt-6">
            A site that holds both is doing what neither can do alone. It
            is letting the question of mind be larger than any one
            vocabulary for it. It is refusing to collapse felt experience
            into machinery, and refusing to dissolve machinery into
            metaphor. It is acknowledging that the same person is, at the
            same time, a cortical surface predicting the next word and
            someone wondering, at 3 a.m., why a particular sentence still
            hurts.
          </Body>
          <Body italic className="text-bone-cream/85 mt-8 text-lg leading-[1.6]">
            You are not your brain. You are not your unconscious. You are
            whatever it is that gets to wonder which of those it is.
          </Body>
          <Mono variant="label" className="text-bone-cream/35 mt-12 block">
            Movement three · ~310 words · 2 min read
          </Mono>
        </div>
      </ScrollScene>

      {/* Closing — three quiet doorways */}
      <section className="relative px-6 py-24 text-center md:px-10 md:py-32">
        <div className="mx-auto max-w-[40rem]">
          <p className="mb-8">
            <Hand className="text-cyan-glow">— end of the threshold</Hand>
          </p>
          <div className="space-y-4">
            <div>
              <Link
                href="/"
                className="text-bone-cream/70 hover:text-brass border-bone-cream/15 hover:border-brass border-b transition-colors"
              >
                <Body italic>Return to the surface</Body>
              </Link>
            </div>
            <div>
              <Link
                href="/field-notes"
                className="text-bone-cream/70 hover:text-brass border-bone-cream/15 hover:border-brass border-b transition-colors"
              >
                <Body italic>Read more field notes</Body>
              </Link>
            </div>
            <div>
              <Link
                href="/cellular"
                className="text-bone-cream/70 hover:text-brass border-bone-cream/15 hover:border-brass border-b transition-colors"
              >
                <Body italic>Descend into cellular view</Body>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
