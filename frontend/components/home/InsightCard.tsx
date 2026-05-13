"use client";

import { motion } from "framer-motion";
import { easeCinematic } from "@/lib/animations";
import { Heading, Body, Mono } from "@/components/typography/Typography";

type Props = {
  index: number;
  headline: string;
  body: string;
};

/**
 * Long-form "what you'll learn" card. Type-and-space hierarchy, no box.
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
        <Mono variant="label" className="text-brass">
          0{index + 1}
        </Mono>
      </div>
      <Heading as="h3" className="md:col-span-6 md:font-[200] md:text-display md:leading-[1.1]">
        {headline}
      </Heading>
      <Body className="text-bone-cream/65 max-w-[34rem] md:col-span-5">
        {body}
      </Body>
    </motion.article>
  );
}
