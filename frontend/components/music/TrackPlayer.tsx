"use client";

import { useEffect, useState } from "react";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import {
  Body,
  Caption,
  Heading,
} from "@/components/typography/Typography";
import { sampleTimeline, type MusicTrack } from "@/lib/musicTracks";
import Scrubber from "./Scrubber";

type Props = {
  track: MusicTrack;
  primary?: boolean;
  /** When true, this player drives `setActivations`. In Compare mode, only
      the focused player drives the persistent brain. */
  driveBrain?: boolean;
};

/**
 * Track player: title block + scrubber. As time advances, the brain stage
 * store is updated with an interpolated activation snapshot. Audio output
 * is silent for Phase 6 (see lib/musicTracks.ts).
 */
export default function TrackPlayer({
  track,
  primary,
  driveBrain = true,
}: Props) {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const setActivations = useBrainStageStore((s) => s.setActivations);
  const resetIdle = useBrainStageStore((s) => s.resetIdle);

  useEffect(() => {
    if (!driveBrain) return;
    const snap = sampleTimeline(track.timeline, time);
    setActivations(snap as Record<string, number>);
  }, [time, track, driveBrain, setActivations]);

  // Stop driving the brain when this player unmounts (or driveBrain flips).
  useEffect(() => {
    return () => {
      if (driveBrain) resetIdle();
    };
  }, [driveBrain, resetIdle]);

  // Auto-pause at end.
  useEffect(() => {
    if (time >= track.duration && playing) setPlaying(false);
  }, [time, track.duration, playing]);

  // Reset time when the track changes.
  useEffect(() => {
    setTime(0);
    setPlaying(false);
  }, [track.id]);

  return (
    <div className="w-full">
      <Caption uppercase className={primary ? "text-brass" : "text-bone-cream/55"}>
        {track.era}
      </Caption>
      <Heading as="h3" className="mt-3 font-[200]">
        {track.title}
      </Heading>
      <Caption className="text-bone-cream/55 mt-2 block">
        {track.attribution}
      </Caption>
      <Body italic className="text-bone-cream/65 mt-6 max-w-[34rem]">
        {track.framing}
      </Body>

      <div className="mt-10">
        <Scrubber
          duration={track.duration}
          playing={playing}
          time={time}
          onTimeChange={setTime}
          onPlayToggle={() => setPlaying((p) => !p)}
          primary={primary}
        />
      </div>

      {!track.src && (
        <Caption className="text-bone-cream/40 mt-4 block">
          Silent preview · licensed audio comes in Phase 11
        </Caption>
      )}
    </div>
  );
}
