"use client";

import { useEffect } from "react";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import {
  Body,
  Caption,
  Heading,
} from "@/components/typography/Typography";
import { sampleTimeline, trackById } from "@/lib/musicTracks";

type Props = {
  index: number;
  trackId: string;
  /** Headline rendered as a Heading. */
  headline: string;
  /** Body essay rendered as a single Body italic block. */
  body: string;
};

/**
 * Ambient essay step inside the closing PinnedSequence. As the step is
 * visible (i.e. mounted), the brain quietly drifts toward the essay's
 * referenced track's mid-point pattern — the brain is reading along.
 */
export default function InsightEssay({
  index,
  trackId,
  headline,
  body,
}: Props) {
  const setActivations = useBrainStageStore((s) => s.setActivations);
  const resetIdle = useBrainStageStore((s) => s.resetIdle);

  useEffect(() => {
    const track = trackById[trackId];
    if (!track) return;
    const snap = sampleTimeline(track.timeline, Math.round(track.duration / 2));
    setActivations(snap as Record<string, number>);
    return () => resetIdle();
  }, [trackId, setActivations, resetIdle]);

  return (
    <div className="mx-auto max-w-[36rem]">
      <Caption uppercase className="text-brass">
        Insight · 0{index + 1}
      </Caption>
      <Heading className="mt-6">{headline}</Heading>
      <Body italic className="text-bone-cream/85 mt-6">
        {body}
      </Body>
    </div>
  );
}
