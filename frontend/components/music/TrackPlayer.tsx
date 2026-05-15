"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import {
  Body,
  Caption,
  Heading,
} from "@/components/typography/Typography";
import { sampleTimeline, type MusicTrack } from "@/lib/musicTracks";
import { loadMusicActivation } from "@/lib/loadActivations";
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
  const t = useTranslations("music");
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const setActivations = useBrainStageStore((s) => s.setActivations);
  const setParcelActivations = useBrainStageStore(
    (s) => s.setParcelActivations,
  );
  const resetIdle = useBrainStageStore((s) => s.resetIdle);
  // Visual-elevation Fix 2: pause idle breathing on scrub/play.
  const markInteraction = useBrainStageStore((s) => s.markInteraction);

  // PR-D: load this track's precomputed Neurosynth parcel map once
  // the player mounts (or when the track changes). The persistent
  // brain renders the real meta-analytic activation underneath the
  // 20-region per-frame timeline that drives the editorial diff.
  useEffect(() => {
    if (!driveBrain) return;
    let cancelled = false;
    loadMusicActivation(track.id).then((file) => {
      if (cancelled || !file) return;
      setParcelActivations(file.parcel_activations);
    });
    return () => {
      cancelled = true;
    };
  }, [track.id, driveBrain, setParcelActivations]);
  const era = (() => { try { return t(`tracks.${track.id}.era`); } catch { return track.era; } })();
  const framing = (() => { try { return t(`tracks.${track.id}.framing`); } catch { return track.framing; } })();

  // PR 6: real audio. When `track.src` is present we mount an
  // <audio> element and bind it to the scrubber. `time` stays the
  // source of truth — audio currentTime is driven by it.
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync play state to the audio element.
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !track.src) return;
    if (playing) {
      el.play().catch(() => {
        // Autoplay blocked or src missing — fall back to silent
        // scrubber so the brain visualization still works.
        setPlaying(false);
      });
    } else {
      el.pause();
    }
  }, [playing, track.src]);

  // Sync currentTime when the scrubber moves (and the user isn't
  // actively dragging — only when the delta exceeds a small epsilon
  // so we don't fight the browser's own playback updates).
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !track.src) return;
    const drift = Math.abs(el.currentTime - time);
    if (drift > 0.25) el.currentTime = time;
  }, [time, track.src]);

  // As the audio element plays, push its currentTime back into
  // `time` so the scrubber and the brain timeline stay synced.
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !track.src) return;
    const onTimeUpdate = () => setTime(el.currentTime);
    el.addEventListener("timeupdate", onTimeUpdate);
    return () => el.removeEventListener("timeupdate", onTimeUpdate);
  }, [track.src]);

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
      <Caption uppercase className={primary ? "text-brass" : "text-bone-cream/85"}>
        {era}
      </Caption>
      <Heading as="h3" className="mt-3 font-[200]">
        {track.title}
      </Heading>
      <Caption className="text-bone-cream/85 mt-2 block">
        {track.attribution}
      </Caption>
      <Body italic className="text-bone-cream/80 mt-6 max-w-[34rem]">
        {framing}
      </Body>

      <div className="mt-10">
        <Scrubber
          duration={track.duration}
          playing={playing}
          time={time}
          onTimeChange={(t) => {
            setTime(t);
            // Fix 2: scrub counts as interaction.
            markInteraction();
          }}
          onPlayToggle={() => {
            setPlaying((p) => !p);
            markInteraction();
          }}
          primary={primary}
        />
      </div>

      {/* PR 6: hidden <audio> element when this track has a real
          source. Controls come from the scrubber + the play button
          inside it — the native audio UI never renders. preload
          metadata so duration is known without buffering the whole
          clip up front. */}
      {track.src && (
        <audio
          ref={audioRef}
          src={track.src}
          preload="metadata"
          aria-hidden
        />
      )}

      {/* Attribution / license line. Real tracks get a citation;
          silent slots get an honest "audio in development" note. */}
      <div className="mt-4">
        {track.src && track.licenseAttribution ? (
          <Caption className="text-bone-cream/75 block leading-relaxed">
            {track.licenseAttribution}
          </Caption>
        ) : (
          <Caption className="text-bone-cream/75 block leading-relaxed">
            Silent preview — this slot is awaiting a contributed
            recording. The brain timeline above is hand-authored so
            the visualization works without audio.
          </Caption>
        )}
      </div>
    </div>
  );
}
