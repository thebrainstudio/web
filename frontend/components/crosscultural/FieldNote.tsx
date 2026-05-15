"use client";

import { useEffect } from "react";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import {
  Body,
  Caption,
  Hand,
  Heading,
} from "@/components/typography/Typography";
import { stimulusPairs } from "@/lib/stimulusPairs";

type Props = {
  index: number;
  pairId: string;
  /** When true, drive the brain to the Thai prediction (the broken side). */
  side?: "english" | "thai";
};

/**
 * Field note: a short scholarly observation pinned to one stimulus pair.
 * Mounting drives the persistent brain to the pair's referenced side.
 * The note's text is taken from `pair.fieldNote`; the Hand marginalia
 * is rendered as a side observation.
 */
export default function FieldNote({ index, pairId, side = "thai" }: Props) {
  const pair = stimulusPairs.find((p) => p.id === pairId);
  const setActivations = useBrainStageStore((s) => s.setActivations);
  const resetIdle = useBrainStageStore((s) => s.resetIdle);

  useEffect(() => {
    if (!pair) return;
    const target =
      side === "thai" ? pair.thaiActivations : pair.englishActivations;
    setActivations(target as Record<string, number>);
    return () => resetIdle();
  }, [pair, side, setActivations, resetIdle]);

  if (!pair) return null;

  return (
    <div className="mx-auto max-w-[40rem]">
      <Caption uppercase className="text-brass">
        Field note · 0{index + 1}
      </Caption>
      <Heading className="mt-6">
        {pair.id.split("-").join(" / ")}
      </Heading>
      <Body italic className="text-bone-cream/85 mt-6">
        {pair.fieldNote}
      </Body>
      <p className="mt-8">
        <Hand className="text-cyan-glow">
          {side === "thai"
            ? "← the model goes quiet here"
            : "← the model is at home here"}
        </Hand>
      </p>
    </div>
  );
}
