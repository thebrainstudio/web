"use client";

import { useEffect, useRef, useState } from "react";
import { Caption, Mono } from "@/components/typography/Typography";

type Props = {
  duration: number;
  /** Whether the scrubber is currently advancing. */
  playing: boolean;
  /** Current playback time in seconds. */
  time: number;
  onTimeChange: (t: number) => void;
  onPlayToggle: () => void;
  /** When true, paint the scrubber in the room's atmospheric brass. */
  primary?: boolean;
};

function fmtTime(t: number): string {
  const s = Math.max(0, Math.round(t));
  const mm = Math.floor(s / 60);
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

/**
 * Audio-style scrubber. Advances `time` via requestAnimationFrame while
 * `playing` is true. Click or drag the rail to seek. No actual audio
 * is bound — Phase 6 is silent-with-timeline (see lib/musicTracks.ts).
 */
export default function Scrubber({
  duration,
  playing,
  time,
  onTimeChange,
  onPlayToggle,
  primary,
}: Props) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const [drag, setDrag] = useState(false);

  // rAF tick to advance time while playing.
  useEffect(() => {
    if (!playing) {
      lastTickRef.current = null;
      return;
    }
    const tick = (now: number) => {
      const prev = lastTickRef.current ?? now;
      const dt = (now - prev) / 1000;
      lastTickRef.current = now;
      const next = Math.min(duration, time + dt);
      onTimeChange(next);
      if (next < duration) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, duration, time, onTimeChange]);

  const seekFromEvent = (clientX: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const rect = rail.getBoundingClientRect();
    const k = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onTimeChange(k * duration);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={onPlayToggle}
          aria-label={playing ? "Pause" : "Play"}
          data-hover
          className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 ${
            primary
              ? "border-brass text-brass hover:bg-brass hover:text-navy-deep"
              : "border-bone-cream/40 text-bone-cream/80 hover:border-bone-cream hover:text-bone-cream"
          }`}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
              <rect x="6" y="4" width="3" height="16" fill="currentColor" />
              <rect x="15" y="4" width="3" height="16" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
              <path d="M6 4 18 12 6 20 Z" fill="currentColor" />
            </svg>
          )}
        </button>

        <div
          ref={railRef}
          role="slider"
          aria-label="Playback time"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={time}
          tabIndex={0}
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            setDrag(true);
            seekFromEvent(e.clientX);
          }}
          onPointerMove={(e) => {
            if (!drag) return;
            seekFromEvent(e.clientX);
          }}
          onPointerUp={() => setDrag(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") onTimeChange(Math.max(0, time - 1));
            if (e.key === "ArrowRight")
              onTimeChange(Math.min(duration, time + 1));
          }}
          className="relative h-1 flex-1 cursor-pointer bg-bone-cream/15"
        >
          <div
            className={`absolute inset-y-0 left-0 ${
              primary ? "bg-brass" : "bg-bone-cream/70"
            }`}
            style={{ width: `${(time / duration) * 100}%` }}
          />
          <div
            aria-hidden
            className={`absolute -top-1.5 h-4 w-px ${
              primary ? "bg-brass" : "bg-bone-cream"
            }`}
            style={{ left: `${(time / duration) * 100}%` }}
          />
        </div>

        <Mono variant="label" className="text-bone-cream/70 min-w-[6ch]">
          {fmtTime(time)} <Caption className="text-bone-cream/35">/</Caption>{" "}
          {fmtTime(duration)}
        </Mono>
      </div>
    </div>
  );
}
