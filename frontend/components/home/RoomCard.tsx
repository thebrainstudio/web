"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import type { RegionId } from "@/lib/regions";
import { easeCinematic } from "@/lib/animations";
import { Heading, Body, Caption, Mono } from "@/components/typography/Typography";

type Props = {
  title: string;
  description: string;
  href: string;
  index: number;
  pattern: Partial<Record<RegionId, number>>;
};

/**
 * One of the three home-page doorways. Hover lerps the brain toward the
 * room's signature pattern. Type-and-space hierarchy; no borders.
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
        <Mono variant="label" className="text-bone-cream/40 block">
          0{index + 1}
        </Mono>
        <Heading as="h3" className="mt-4 font-[200]">
          {title}
        </Heading>
        <Body className="text-bone-cream/65 mt-4 max-w-[22rem]">
          {description}
        </Body>
        <Caption uppercase className="text-brass mt-6 inline-flex items-center gap-2">
          Enter
          <span aria-hidden className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2">
            →
          </span>
        </Caption>
        <span
          aria-hidden
          className="bg-brass absolute -bottom-1 left-0 h-px w-0 transition-[width] duration-500 ease-out group-hover:w-12"
        />
      </Link>
    </motion.div>
  );
}
