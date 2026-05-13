"use client";

import { motion } from "framer-motion";
import { Display } from "@/components/typography/Typography";
import { easeCinematic } from "@/lib/animations";

/**
 * Home page hero. Renders the three lines as one <Display italic> with
 * each word entering in a 60ms stagger.
 *
 * Each line is its own `block` so wrapping is controlled — at narrow
 * widths, the type-scale clamp drops the size enough that lines no
 * longer awkwardly break onto multiple visual rows. We also wrap each
 * word in a non-breaking `inline-block` so the space between words can
 * collapse but words themselves stay intact.
 */
export default function HeroDisplay({
  line1,
  line2,
  line3,
  className = "",
}: {
  line1: string;
  line2: string;
  line3: string;
  className?: string;
}) {
  const lines = [line1, line2, line3];
  return (
    <Display
      italic
      className={`text-bone-cream mx-auto max-w-[18ch] ${className}`}
    >
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden className="block">
        {lines.map((line, li) => {
          const words = line.split(" ");
          return (
            <span key={li} className="block">
              {words.map((word, wi) => (
                <motion.span
                  key={`${li}-${wi}`}
                  className="inline-block whitespace-nowrap"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    ease: easeCinematic,
                    delay: 0.2 + li * 0.16 + wi * 0.05,
                  }}
                >
                  {word}
                  {wi < words.length - 1 ? " " : ""}
                </motion.span>
              ))}
            </span>
          );
        })}
      </span>
    </Display>
  );
}
