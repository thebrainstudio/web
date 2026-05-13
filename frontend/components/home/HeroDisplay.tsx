"use client";

import { motion } from "framer-motion";
import { Display } from "@/components/typography/Typography";
import { easeCinematic } from "@/lib/animations";

/**
 * Home page hero. Renders the three lines as one <Display italic> with each
 * word entering in a 60ms stagger. The italic carries the editorial voice.
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
    <Display italic className={`text-bone-cream ${className}`}>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden className="block">
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.split(" ").map((word, wi) => (
              <motion.span
                key={`${li}-${wi}`}
                className="inline-block"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  ease: easeCinematic,
                  delay: 0.2 + li * 0.18 + wi * 0.06,
                }}
              >
                {word}
                {wi < line.split(" ").length - 1 ? " " : ""}
              </motion.span>
            ))}
          </span>
        ))}
      </span>
    </Display>
  );
}
