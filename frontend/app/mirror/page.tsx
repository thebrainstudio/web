import ScrollScene from "@/components/motion/ScrollScene";
import { signaturePatterns } from "@/lib/regions";

export default function MirrorPage() {
  return (
    <ScrollScene
      id="mirror-stub"
      brain={{
        position: [-0.8, 0, 0],
        scale: 0.85,
        rotation: [0, 0.25, 0],
        activations: signaturePatterns.mirror,
      }}
      lighting="warm"
      className="relative flex min-h-screen items-center px-6 pt-32 md:px-10"
    >
      <div className="mx-auto max-w-[40rem]">
        <p className="text-brass font-display text-xs uppercase tracking-[0.36em]">
          Brain Mirror · Phase 5
        </p>
        <h1 className="font-display text-bone-cream mt-8 text-balance text-4xl leading-[1.1] md:text-6xl">
          Type something. Anything.
        </h1>
        <p className="text-bone-cream/65 mt-8 text-base leading-[1.7]">
          The Brain Mirror is the next room to ship. You&apos;ll paste text,
          and the persistent brain on this screen will warm in the language
          regions the writing recruits — the inferior frontal gyrus, the
          posterior superior temporal gyrus, the anterior temporal lobe.
        </p>
        <p className="text-bone-cream/45 mt-10 text-xs uppercase tracking-[0.28em]">
          Coming in the next session.
        </p>
      </div>
    </ScrollScene>
  );
}
