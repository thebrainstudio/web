"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { regionById, type RegionId } from "@/lib/regions";
import { activationBandKey } from "@/lib/activationBands";
import {
  Caption,
  Heading,
  Body,
  Mono,
} from "@/components/typography/Typography";
import { easeCinematic, staggerLoose } from "@/lib/animations";

function tr(t: ReturnType<typeof useTranslations>, key: string, fb: string): string {
  try { return t(key); } catch { return fb; }
}

type Props = {
  topRegions: { id: RegionId; activation: number }[];
};

/**
 * Top-3 region reveal. One card per region:
 *   - Activation value, top-right, large Mono (variant=value)
 *   - Display name in Heading
 *   - Anatomy in Caption uppercase brass
 *   - Science gloss in Body
 *   - Poetic gloss in Body italic
 *
 * Cards stagger in with cinematic easing. Each is keyed by region id so
 * re-renders feel like the cards rearrange in place rather than rebuild.
 */
export default function MirrorReveal({ topRegions }: Props) {
  const tRegions = useTranslations("regions");
  const tMirror = useTranslations("mirror");
  const tActivation = useTranslations("activation");
  if (topRegions.length === 0) return null;

  return (
    <section
      aria-label="What your writing reveals"
      className="mt-16 md:mt-24"
    >
      <Caption uppercase className="text-brass">
        {tr(tMirror, "revealLabel", "What your writing reveals")}
      </Caption>
      <Body italic className="text-bone-cream/85 mt-2 max-w-[34rem]">
        {tr(tMirror, "revealIntro", "Predictions in this preview are simulated locally; real TRIBE inference comes in Phase 10.")}
      </Body>

      <div className="mt-10 space-y-12 md:space-y-16">
        <AnimatePresence initial={false}>
          {topRegions.map((entry, i) => {
            const r = regionById[entry.id];
            return (
              <motion.article
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{
                  duration: 0.7,
                  ease: easeCinematic,
                  delay: i * staggerLoose,
                }}
                className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8"
              >
                <div className="md:col-span-7">
                  <Caption uppercase className="text-brass">
                    {tr(tRegions, `${entry.id}.anatomyName`, r.anatomyName)}
                  </Caption>
                  <Heading className="mt-3">
                    {tr(tRegions, `${entry.id}.displayName`, r.displayName)}
                  </Heading>
                  <Body className="text-bone-cream/75 mt-4 max-w-[34rem]">
                    {tr(tRegions, `${entry.id}.scienceGloss`, r.scienceGloss)}
                  </Body>
                  <Body italic className="text-bone-cream/60 mt-4 max-w-[34rem]">
                    {tr(tRegions, `${entry.id}.poeticGloss`, r.poeticGloss)}
                  </Body>
                  <Link
                    href={`/atlas/${entry.id}`}
                    prefetch
                    data-hover
                    className="text-brass hover:text-amber-soft mt-5 inline-flex items-center gap-2 transition-colors duration-150"
                  >
                    <Caption uppercase className="tracking-[0.18em]">
                      {tr(tMirror, "openInAtlas", "Open in atlas")}
                    </Caption>
                    <span aria-hidden className="text-[0.95em]">
                      →
                    </span>
                  </Link>
                </div>
                <div className="md:col-span-5 md:text-right">
                  {/* Integrity-pass: drop the false-precision
                      decimal. Render the qualitative band the
                      site's `bandFor` helper resolves the
                      activation value to. */}
                  <Mono
                    variant="label"
                    className="text-brass block tracking-[0.18em]"
                  >
                    {tActivation(activationBandKey(entry.activation))}
                  </Mono>
                  <Caption uppercase className="text-bone-cream/70 mt-2 block">
                    {tr(tMirror, "predictedActivation", "Predicted activation")}
                  </Caption>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
