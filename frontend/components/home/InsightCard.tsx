"use client";

import { motion } from "framer-motion";
import { easeCinematic } from "@/lib/animations";

type Props = {
  index: number;
  headline: string;
  body: string;
};

/**
 * Long-form "what you'll learn" card on the home page.
 * Type-and-space hierarchy. No box, no border.
 */
export default function InsightCard({ index, headline, body }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: easeCinematic }}
      className="grid grid-cols-1 gap-6 md:grid-cols-12"
    >
      <div className="md:col-span-1">
        <span className="font-display text-brass text-xs uppercase tracking-[0.32em] tabular">
          0{index + 1}
        </span>
      </div>
      <h3 className="font-display text-bone-cream text-balance text-2xl leading-[1.15] md:col-span-6 md:text-4xl">
        {headline}
      </h3>
      <p className="text-bone-cream/65 max-w-[34rem] text-base leading-[1.7] md:col-span-5">
        {body}
      </p>
    </motion.article>
  );
}
