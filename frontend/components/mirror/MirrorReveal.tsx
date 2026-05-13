"use client";

import { motion, AnimatePresence } from "framer-motion";
import { regionById, type RegionId } from "@/lib/regions";
import {
  Caption,
  Heading,
  Body,
  Mono,
} from "@/components/typography/Typography";
import { easeCinematic, staggerLoose } from "@/lib/animations";

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
  if (topRegions.length === 0) return null;

  return (
    <section
      aria-label="What your writing reveals"
      className="mt-16 md:mt-24"
    >
      <Caption uppercase className="text-brass">
        What your writing reveals
      </Caption>
      <Body italic className="text-bone-cream/55 mt-2 max-w-[34rem]">
        Predictions in this preview are simulated locally; real TRIBE
        inference comes in Phase 10.
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
                    {r.anatomyName}
                  </Caption>
                  <Heading className="mt-3">{r.displayName}</Heading>
                  <Body className="text-bone-cream/75 mt-4 max-w-[34rem]">
                    {r.scienceGloss}
                  </Body>
                  <Body italic className="text-bone-cream/60 mt-4 max-w-[34rem]">
                    {r.poeticGloss}
                  </Body>
                </div>
                <div className="md:col-span-5 md:text-right">
                  <Mono
                    variant="value"
                    className="text-brass block leading-none"
                  >
                    {(entry.activation * 100).toFixed(0)}
                  </Mono>
                  <Caption uppercase className="text-bone-cream/45 mt-2 block">
                    Predicted activation
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
