import ScrollScene from "@/components/motion/ScrollScene";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import { signaturePatterns } from "@/lib/regions";
import { Display, Body, Caption } from "@/components/typography/Typography";

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
      {/* Cool-cathedral — dual-source naturally suggests left + right channels. */}
      <AtmosphericGlow preset="cool-cathedral" intensity="subtle" />
      <div className="mx-auto max-w-[40rem]">
        <Caption uppercase as="p" className="text-brass">
          NeuroMusic Lab · Phase 6
        </Caption>
        <Display className="mt-8">
          Hearing is the oldest of the senses to fully form.
        </Display>
        <Body className="text-bone-cream/65 mt-8">
          It begins in the womb. The NeuroMusic Lab — coming next — lets you
          scrub through tracks and watch Heschl&apos;s gyrus, posterior STG,
          and the reward circuitry respond. Three insight essays accompany
          the experience.
        </Body>
        <Caption uppercase as="p" className="text-bone-cream/45 mt-10">
          Coming in a later session.
        </Caption>
      </div>
    </ScrollScene>
  );
}
