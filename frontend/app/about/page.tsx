import ScrollScene from "@/components/motion/ScrollScene";

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
      <div className="mx-auto max-w-[44rem]">
        <p className="text-brass font-display text-xs uppercase tracking-[0.36em]">
          About · Phase 9
        </p>
        <h1 className="font-display text-bone-cream mt-8 text-balance text-4xl leading-[1.1] md:text-6xl">
          A 21st-century version of an older question.
        </h1>
        <p className="text-bone-cream/70 mt-10 text-base leading-[1.7]">
          In the early 20th century, Carl Jung gave us a vocabulary for parts
          of the mind that don&apos;t speak. A century later, brain-encoding
          models are trying to render those parts visible. Different language,
          related project.
        </p>
        <p className="text-bone-cream/55 mt-8 text-base leading-[1.7]">
          A full About page is coming — what TRIBE is, what it doesn&apos;t do,
          the honest limitations, the citations, and credits. This stub is a
          stake in the ground.
        </p>
        <p className="text-bone-cream/45 mt-12 text-xs uppercase tracking-[0.28em]">
          Coming in a later session.
        </p>
      </div>
    </ScrollScene>
  );
}
