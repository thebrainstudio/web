"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Caption } from "@/components/typography/Typography";
import { easeCinematic } from "@/lib/animations";

const messages = [
  "Reading.",
  "Resolving semantic structure.",
  "Mapping onto predicted activation.",
];

/**
 * Cycles through three editorial loading lines while a prediction
 * settles. Never the word "Loading…" — the discipline is the point.
 */
export default function MirrorLoadingMessage({
  active,
}: {
  active: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 900);
    return () => window.clearInterval(id);
  }, [active]);

  if (!active) return null;

  return (
    <div className="text-bone-cream/55 mt-6 flex items-center gap-3">
      <span
        aria-hidden
        className="bg-brass inline-block h-1.5 w-1.5 animate-pulse rounded-full"
      />
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: easeCinematic }}
        >
          <Caption uppercase>{messages[index]}</Caption>
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
