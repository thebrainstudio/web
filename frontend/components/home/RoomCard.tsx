"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import type { RegionId } from "@/lib/regions";
import { easeCinematic } from "@/lib/animations";

type Props = {
  title: string;
  description: string;
  href: string;
  index: number;
  pattern: Partial<Record<RegionId, number>>;
};

/**
 * One of the three room doorways on the home page.
 *
 * On hover, lerps the brain's activations toward this room's signature
 * pattern. On unhover, returns to idle. Click navigates with prefetch.
 *
 * Hierarchy through type and color, never borders.
 */
export default function RoomCard({
  title,
  description,
  href,
  index,
  pattern,
}: Props) {
  const setActivations = useBrainStageStore((s) => s.setActivations);
  const resetIdle = useBrainStageStore((s) => s.resetIdle);

  const onEnter = useCallback(() => {
    setActivations(pattern as Record<string, number>);
  }, [pattern, setActivations]);

  const onLeave = useCallback(() => {
    resetIdle();
  }, [resetIdle]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.8,
        ease: easeCinematic,
        delay: index * 0.12,
      }}
    >
      <Link
        href={href}
        prefetch
        onPointerEnter={onEnter}
        onFocus={onEnter}
        onPointerLeave={onLeave}
        onBlur={onLeave}
        className="group relative block"
        data-hover
      >
        <div className="text-bone-cream/40 text-xs uppercase tracking-[0.32em] tabular">
          0{index + 1}
        </div>
        <h3 className="font-display text-bone-cream mt-4 text-balance text-3xl leading-[1.1] md:text-4xl">
          {title}
        </h3>
        <p className="text-bone-cream/65 mt-4 max-w-[22rem] text-sm leading-[1.65] md:text-base">
          {description}
        </p>
        <span className="text-brass mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.32em]">
          Enter
          <span aria-hidden className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2">
            →
          </span>
        </span>
        <span
          aria-hidden
          className="bg-brass absolute -bottom-1 left-0 h-px w-0 transition-[width] duration-500 ease-out group-hover:w-12"
        />
      </Link>
    </motion.div>
  );
}
