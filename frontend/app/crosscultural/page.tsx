import ScrollScene from "@/components/motion/ScrollScene";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import { signaturePatterns } from "@/lib/regions";
import { Display, Body, Caption, Hand } from "@/components/typography/Typography";

export default function CrossCulturalPage() {
  return (
    <ScrollScene
      id="cc-stub"
      brain={{
        position: [0.1, 0.05, 0],
        scale: 0.9,
        rotation: [0, 0.15, 0],
        activations: signaturePatterns.crosscultural,
      }}
      lighting="clinical"
      className="relative flex min-h-screen items-center px-6 pt-32 md:px-10"
    >
      {/* Oxblood-ember — the moment that wants weight. */}
      <AtmosphericGlow preset="oxblood-ember" position="center" intensity="medium" />
      <div className="mx-auto max-w-[40rem]">
        <Caption uppercase as="p" className="text-brass">
          Cross-Cultural Brain · Phase 7
        </Caption>
        <Display italic className="mt-8">
          This model was trained on English.
        </Display>
        <Body className="text-bone-cream/65 mt-8">
          What it cannot translate is the most honest finding. The
          Cross-Cultural Brain — coming later — surfaces the gap by running
          Thai and English stimulus pairs side-by-side, with field notes on
          what the silence reveals.
        </Body>
        <p className="mt-6">
          <Hand className="text-cyan-glow">← this one will surprise you</Hand>
        </p>
        <Caption uppercase as="p" className="text-bone-cream/45 mt-10">
          Coming in a later session.
        </Caption>
      </div>
    </ScrollScene>
  );
}
