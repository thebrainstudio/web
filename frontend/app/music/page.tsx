import ScrollScene from "@/components/motion/ScrollScene";
import { signaturePatterns } from "@/lib/regions";

export default function MusicPage() {
  return (
    <ScrollScene
      id="music-stub"
      brain={{
        position: [0.7, -0.05, 0],
        scale: 0.85,
        rotation: [0, -0.25, 0],
        activations: signaturePatterns.music,
      }}
      lighting="warm"
      className="relative flex min-h-screen items-center px-6 pt-32 md:px-10"
    >
      <div className="mx-auto max-w-[40rem]">
        <p className="text-brass font-display text-xs uppercase tracking-[0.36em]">
          NeuroMusic Lab · Phase 6
        </p>
        <h1 className="font-display text-bone-cream mt-8 text-balance text-4xl leading-[1.1] md:text-6xl">
          Hearing is the oldest of the senses to fully form.
        </h1>
        <p className="text-bone-cream/65 mt-8 text-base leading-[1.7]">
          It begins in the womb. The NeuroMusic Lab — coming next — lets you
          scrub through tracks and watch Heschl&apos;s gyrus, posterior STG,
          and the reward circuitry respond. Three insight essays accompany
          the experience.
        </p>
        <p className="text-bone-cream/45 mt-10 text-xs uppercase tracking-[0.28em]">
          Coming in a later session.
        </p>
      </div>
    </ScrollScene>
  );
}
