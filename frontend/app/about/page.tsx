import ScrollScene from "@/components/motion/ScrollScene";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import { Display, Body, Caption, Hand } from "@/components/typography/Typography";

export default function AboutPage() {
  return (
    <ScrollScene
      id="about-stub"
      brain={{
        position: [1.2, 0.55, 0],
        scale: 0.32,
        rotation: [0, -0.3, 0],
        activations: {},
      }}
      lighting="cinematic"
      className="relative min-h-screen px-6 pb-32 pt-40 md:px-10 md:pb-48 md:pt-48"
    >
      {/* Amber-lamp closing warmth — subtle + animated. */}
      <AtmosphericGlow
        preset="amber-lamp"
        position="bottom"
        intensity="subtle"
        animate
      />
      <div className="mx-auto max-w-[44rem]">
        <Caption uppercase as="p" className="text-brass">
          About · Phase 9
        </Caption>
        <Display className="mt-8">
          A 21st-century version of an older question.
        </Display>
        <Body className="text-bone-cream/70 mt-10">
          In the early 20th century, Carl Jung gave us a vocabulary for parts
          of the mind that don&apos;t speak. A century later, brain-encoding
          models are trying to render those parts visible. Different language,
          related project.
        </Body>
        <Body className="text-bone-cream/55 mt-8">
          A full About page is coming — what TRIBE is, what it doesn&apos;t do,
          the honest limitations, the citations, and credits. This stub is a
          stake in the ground.
        </Body>
        <p className="mt-12">
          <Hand className="text-bone-cream/55">— more soon</Hand>
        </p>
        <Caption uppercase as="p" className="text-bone-cream/45 mt-6">
          Coming in a later session.
        </Caption>
      </div>
    </ScrollScene>
  );
}
