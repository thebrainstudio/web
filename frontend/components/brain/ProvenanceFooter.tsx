import { Caption, Mono } from "@/components/typography/Typography";
import type { ParcelActivationFile } from "@/lib/loadActivations";

/**
 * PR-A — Inline provenance/methodology chip rendered under each
 * brain visualization on every room that loads a precomputed
 * Neurosynth JSON. Shows the term composition + source + license
 * + parcellation, plus a longer methodology note revealed on
 * `<details>` expand. Keeps the "this is not your brain"
 * disclaimer load-bearing as the data underneath becomes more
 * real.
 */
export default function ProvenanceFooter({
  file,
}: {
  file: ParcelActivationFile;
}) {
  const compositionStr = file.composition
    .map(([term, weight]) => `${term} ${(weight * 100).toFixed(0)}%`)
    .join(" · ");

  return (
    <details className="mt-6 group">
      <summary className="cursor-pointer list-none">
        <Mono
          variant="label"
          className="text-bone-cream/75 tracking-[0.18em] group-hover:text-bone-cream/85 transition-colors"
        >
          {file.source} · {file.parcellation} · {file.license}{" "}
          <span aria-hidden className="text-brass/70 ml-1 inline-block transition-transform group-open:rotate-90">
            ▸
          </span>
        </Mono>
      </summary>
      <div className="mt-3 max-w-[42rem] space-y-2 text-bone-cream/75">
        <Caption className="block leading-relaxed">
          <span className="text-bone-cream/75">Composition: </span>
          {compositionStr}
        </Caption>
        {file.notes ? (
          <Caption italic className="block leading-relaxed text-bone-cream/50">
            {file.notes}
          </Caption>
        ) : null}
        <Caption className="block leading-relaxed">
          {file.methodology}
        </Caption>
        <Caption className="block leading-relaxed text-bone-cream/70">
          {file.citation}
        </Caption>
        <Caption italic className="block leading-relaxed text-bone-cream/70">
          Not a measurement of any individual brain. What you're
          seeing is the activation pattern published meta-analysis
          associates with the term composition above.
        </Caption>
      </div>
    </details>
  );
}
