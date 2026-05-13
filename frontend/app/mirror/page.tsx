import ScrollScene from "@/components/motion/ScrollScene";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import { signaturePatterns } from "@/lib/regions";
import { Display, Body, Caption } from "@/components/typography/Typography";

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
      {/* Amber-lamp glow — subtle until a real prediction lights it up.
          Phase 5 will switch intensity to "pronounced" on prediction return. */}
      <AtmosphericGlow preset="amber-lamp" position="top" intensity="subtle" />
      <div className="mx-auto max-w-[40rem]">
        <Caption uppercase as="p" className="text-brass">
          Brain Mirror · Phase 5
        </Caption>
        <Display className="mt-8">Type something. Anything.</Display>
        <Body italic className="text-bone-cream/65 mt-8">
          The Brain Mirror is the next room to ship. You&apos;ll paste text,
          and the persistent brain on this screen will warm in the language
          regions the writing recruits — the inferior frontal gyrus, the
          posterior superior temporal gyrus, the anterior temporal lobe.
        </Body>
        <Caption uppercase as="p" className="text-bone-cream/45 mt-10">
          Coming in the next session.
        </Caption>
      </div>
    </ScrollScene>
  );
}
