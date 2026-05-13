import ScrollScene from "@/components/motion/ScrollScene";
import { signaturePatterns } from "@/lib/regions";

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
      <div className="mx-auto max-w-[40rem]">
        <p className="text-brass font-display text-xs uppercase tracking-[0.36em]">
          Cross-Cultural Brain · Phase 7
        </p>
        <h1 className="font-display text-bone-cream mt-8 text-balance text-4xl leading-[1.1] md:text-6xl">
          This model was trained on English.
        </h1>
        <p className="text-bone-cream/65 mt-8 text-base leading-[1.7]">
          What it cannot translate is the most honest finding. The
          Cross-Cultural Brain — coming later — surfaces the gap by running
          Thai and English stimulus pairs side-by-side, with field notes on
          what the silence reveals.
        </p>
        <p className="text-bone-cream/45 mt-10 text-xs uppercase tracking-[0.28em]">
          Coming in a later session.
        </p>
      </div>
    </ScrollScene>
  );
}
