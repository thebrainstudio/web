"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import type { SavedExample } from "@/lib/savedExamples";
import {
  Body,
  Caption,
  Heading,
} from "@/components/typography/Typography";
import { easeCinematic } from "@/lib/animations";

type Props = {
  example: SavedExample;
  index: number;
  onApply: (text: string) => void;
};

export default function SavedExampleCard({ example, index, onApply }: Props) {
  const setActivations = useBrainStageStore((s) => s.setActivations);
  const resetIdle = useBrainStageStore((s) => s.resetIdle);

  const onEnter = useCallback(() => {
    setActivations(example.activations as Record<string, number>);
  }, [example.activations, setActivations]);

  const onLeave = useCallback(() => {
    resetIdle();
  }, [resetIdle]);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.8,
        ease: easeCinematic,
        delay: index * 0.1,
      }}
      onPointerEnter={onEnter}
      onFocus={onEnter}
      onPointerLeave={onLeave}
      onBlur={onLeave}
      onClick={() => onApply(example.body)}
      data-hover
      className="group block w-full text-left"
    >
      <Caption uppercase className="text-brass">
        Example · 0{index + 1}
      </Caption>
      <Heading as="h3" className="mt-3 font-[200]">
        {example.label}
      </Heading>
      <Body italic className="text-bone-cream/55 mt-1">
        {example.attribution}
      </Body>
      <Body className="text-bone-cream/80 mt-6 max-w-[34rem]">
        {example.body}
      </Body>
      <Body italic className="text-bone-cream/55 mt-6 max-w-[34rem]">
        {example.framing}
      </Body>
      <Caption uppercase className="text-brass mt-6 inline-flex items-center gap-2">
        Try it
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2"
        >
          →
        </span>
      </Caption>
      <span
        aria-hidden
        className="bg-brass mt-2 block h-px w-0 transition-[width] duration-500 ease-out group-hover:w-16"
      />
    </motion.button>
  );
}
