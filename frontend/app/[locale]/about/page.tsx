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

      {/* 4b — On holding two languages */}
      <section className="relative px-6 py-32 md:px-10 md:py-48">
        <div className="mx-auto max-w-[40rem]">
          <Caption uppercase className="text-brass">
            On holding two languages
          </Caption>
          <Heading className="mt-6 font-[200]">
            Neuroscience and depth psychology, held in parallel.
          </Heading>
          <div className="mt-12 space-y-6">
            <Body className="text-bone-cream/85">
              Carl Jung built a phenomenology of inner experience — a
              vocabulary for patterns he observed in dreams, art, myth,
              and clinical work. He was not doing neuroscience. He was
              naming the felt structure of the psyche, with the rigor
              that careful observation allows when mechanism is out of
              reach.
            </Body>
            <Body className="text-bone-cream/85">
              This site does not claim that brain regions <em>are</em>
              {" "}Jungian concepts. It does not claim that neurotransmitters
              correspond to archetypes. It does not claim that
              synchronicity, the collective unconscious as literal
              storehouse, or active imagination have direct neuroscience
              grounding. Some of what Jung saw was right in different
              language; some was wrong; much lives in a register where
              neither side can fully claim the territory. Holding the
              tension honestly is the work.
            </Body>
            <Body className="text-bone-cream/85">
              A small number of contemporary thinkers do this bridge work
              with care. Mark Solms&apos; <em>The Hidden Spring</em> argues
              for an affective basis of consciousness that touches both
              neuropsychoanalysis and Damasio&apos;s somatic-marker
              framework. Iain McGilchrist&apos;s <em>The Master and His
              Emissary</em>, despite a pop appropriation that has been
              worse than the book itself, is rigorous about hemispheric
              specialization without overclaiming. Oliver Sacks&apos;
              clinical neurology is what it looks like to take both
              mechanism and meaning seriously. These are the company this
              site keeps.
            </Body>
            <Body className="text-bone-cream/85">
              The temptation to mystify is real. Energy, frequencies,
              vibration, manifestation — words that have done damage to
              both neuroscience and to Jung&apos;s actual project. The
              discipline of refusing them is part of the site.
            </Body>
            <Body className="text-bone-cream/85">
              The opposite temptation — to reduce — is also real.
              &ldquo;The brain&rdquo; as the only legitimate explanation,
              with everything that can&apos;t be reduced to mechanism
              treated as illusion or as not-yet-mechanism. The discipline
              of refusing this is also part of the site. Some questions
              are larger than any one vocabulary for them.
            </Body>
            <Body italic className="text-bone-cream/80 mt-2">
              You are not your brain. You are not your unconscious. You
              are whatever it is that gets to wonder which of those it is.
            </Body>
          </div>
        </div>
      </section>

      {/* 4b-2 — Where Jung was right, where he was wrong */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[40rem]">
          <Caption uppercase className="text-brass">
            Where Jung was right, where he was wrong
          </Caption>
          <Heading className="mt-6 font-[200]">
            He was a person, working with what was in reach.
          </Heading>
          <Body className="text-bone-cream/85 mt-10">
            This site holds Jung&apos;s work seriously without treating
            him as an oracle. He was a person — brilliant, prolific,
            wrong about specific things, right about other specific
            things, the way people who try hard for a long time generally
            are. Honoring his work means being honest about both columns.
          </Body>

          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10">
            <div>
              <Caption uppercase className="text-brass">
                Where he was right
              </Caption>
              <ul className="mt-6 space-y-5">
                <li>
                  <Body className="text-bone-cream/85">
                    That consciousness is the small part of mind, and
                    most of what produces thought, feeling, and action
                    happens outside it. Predictive processing,
                    default-mode work, implicit memory, and automatic
                    appraisal have made the scale visible.
                  </Body>
                </li>
                <li>
                  <Body className="text-bone-cream/85">
                    That memory is reconstruction, not retrieval, and
                    that the past is continuously rewritten in service
                    of present meaning. Reconsolidation research has
                    given this a mechanism.
                  </Body>
                </li>
                <li>
                  <Body className="text-bone-cream/85">
                    That disowned content does not vanish — it gets
                    projected onto others, often with strange intensity,
                    and the cost of not seeing it grows. Inhibition and
                    suppression research describes the mechanism for
                    holding it out; the cost is convergent.
                  </Body>
                </li>
                <li>
                  <Body className="text-bone-cream/85">
                    That symbolic and figural cognition is not a
                    primitive layer beneath rational thought but a
                    parallel mode of meaning-making with its own
                    legitimacy. Right-hemisphere narrative + figural
                    work is real.
                  </Body>
                </li>
                <li>
                  <Body className="text-bone-cream/85">
                    That recurring images across cultures — circle,
                    quaternity, hero, shadow, mother — point at
                    structural features of how minds organize themselves,
                    not at coincidence.
                  </Body>
                </li>
              </ul>
            </div>

            <div>
              <Caption uppercase className="text-brass">
                Where he was wrong, or overreached
              </Caption>
              <ul className="mt-6 space-y-5">
                <li>
                  <Body className="text-bone-cream/85">
                    The collective unconscious as a literal inherited
                    storehouse of ancestral content. Contemporary
                    biology does not support inherited memory in this
                    sense. The convergence of imagery across cultures
                    is better explained by shared cognitive primitives
                    than by a transgenerational reservoir.
                  </Body>
                </li>
                <li>
                  <Body className="text-bone-cream/85">
                    Synchronicity as a meaningful acausal connecting
                    principle, on a par with causation. The phenomenology
                    of meaningful coincidence is real — people do
                    experience it — but the metaphysical claim he made
                    around it has no scientific foothold.
                  </Body>
                </li>
                <li>
                  <Body className="text-bone-cream/85">
                    The strict male/female binary that organized his
                    anima/animus theory. The underlying observation
                    about a contrasexual interior figure survives in
                    weaker form; the binary that framed it has aged
                    poorly, and contemporary depth-psychological work
                    has corrected the vocabulary.
                  </Body>
                </li>
                <li>
                  <Body className="text-bone-cream/85">
                    Some of his readings of non-Western traditions —
                    Eastern thought especially — were more about Jung
                    than about the traditions. He acknowledged this in
                    parts of his work and missed it in others. His
                    cultural reach was real but not unlimited.
                  </Body>
                </li>
                <li>
                  <Body className="text-bone-cream/85">
                    Specific archetypal figures (wise old man, anima,
                    animus, trickster) as universal psychological
                    constants. The figures recur, but the strength of
                    cross-cultural specificity he claimed is not what
                    contemporary anthropology actually supports.
                  </Body>
                </li>
              </ul>
            </div>
          </div>

          <Body italic className="text-bone-cream/80 mt-12 text-lg leading-[1.6]">
            Both columns are part of what makes him still worth reading.
            A theorist who was right about everything would not have
            been close enough to the actual texture of mind to be useful.
            Jung was close. He was sometimes too close to see
            clearly. He was, in this respect, a person.
          </Body>
        </div>
      </section>

      {/* 4c — Further reading */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[40rem]">
          <Caption uppercase className="text-brass">
            Further reading
          </Caption>
          <Heading className="mt-6 font-[200]">
            Eight books that informed this site.
          </Heading>

          <div className="mt-12">
            <Caption uppercase className="text-bone-cream/55">
              Neuroscience that takes phenomenology seriously
            </Caption>
            <ul className="mt-4 space-y-4">
              <li>
                <Body className="text-bone-cream/85">
                  Solms, M. <em>The Hidden Spring.</em> 2021.
                  <Body italic className="text-bone-cream/55 mt-1">
                    The affective basis of consciousness, from neuropsychoanalysis.
                  </Body>
                </Body>
              </li>
              <li>
                <Body className="text-bone-cream/85">
                  Damasio, A. <em>The Feeling of What Happens.</em> 1999.
                  <Body italic className="text-bone-cream/55 mt-1">
                    Somatic markers, the felt self, the body in the brain.
                  </Body>
                </Body>
              </li>
              <li>
                <Body className="text-bone-cream/85">
                  Sacks, O. <em>The Man Who Mistook His Wife for a Hat.</em> 1985.
                  <Body italic className="text-bone-cream/55 mt-1">
                    Clinical neurology written in a humane voice.
                  </Body>
                </Body>
              </li>
              <li>
                <Body className="text-bone-cream/85">
                  Kandel, E. R. <em>In Search of Memory.</em> 2006.
                  <Body italic className="text-bone-cream/55 mt-1">
                    The molecular basis of memory as reconstruction.
                  </Body>
                </Body>
              </li>
            </ul>
          </div>

          <div className="mt-12">
            <Caption uppercase className="text-bone-cream/55">
              Jung primary sources
            </Caption>
            <ul className="mt-4 space-y-4">
              <li>
                <Body className="text-bone-cream/85">
                  Jung, C. G. <em>Memories, Dreams, Reflections.</em> 1963.
                  <Body italic className="text-bone-cream/55 mt-1">
                    Recorded by Aniela Jaffé. The clearest entry to his thought.
                  </Body>
                </Body>
              </li>
              <li>
                <Body className="text-bone-cream/85">
                  Jung, C. G. <em>The Archetypes and the Collective Unconscious.</em> CW 9i. 1959.
                  <Body italic className="text-bone-cream/55 mt-1">
                    The technical statement of the archetypes.
                  </Body>
                </Body>
              </li>
            </ul>
          </div>

          <div className="mt-12">
            <Caption uppercase className="text-bone-cream/55">
              Contemporary thinkers at the seam
            </Caption>
            <ul className="mt-4 space-y-4">
              <li>
                <Body className="text-bone-cream/85">
                  McGilchrist, I. <em>The Master and His Emissary.</em> 2009.
                  <Body italic className="text-bone-cream/55 mt-1">
                    Hemispheric perspectives. Better than its pop reception suggests.
                  </Body>
                </Body>
              </li>
              <li>
                <Body className="text-bone-cream/85">
                  Seth, A. <em>Being You.</em> 2021.
                  <Body italic className="text-bone-cream/55 mt-1">
                    Predictive processing and the controlled hallucination of being a self.
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
