"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import { Caption } from "@/components/typography/Typography";
import { sampleTimeline, type MusicTrack } from "@/lib/musicTracks";

type Props = {
  tracks: MusicTrack[];
  activeId: string;
  onSelect: (id: string) => void;
};

/**
 * Compact row of track chips. Hovering one previews its mid-track activation
 * pattern on the persistent brain; clicking switches the player.
 */
export default function TrackChooser({ tracks, activeId, onSelect }: Props) {
  const tt = useTranslations("music");
  const setActivations = useBrainStageStore((s) => s.setActivations);

  const previewMid = useCallback(
    (t: MusicTrack) => {
      const snap = sampleTimeline(t.timeline, Math.round(t.duration / 2));
      setActivations(snap as Record<string, number>);
    },
    [setActivations],
  );

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Tracks">
      {tracks.map((t) => {
        const active = t.id === activeId;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(t.id)}
            onPointerEnter={() => previewMid(t)}
            onFocus={() => previewMid(t)}
            data-hover
            className={`rounded-sm px-3 py-1.5 transition-colors duration-200 ${
              active
                ? "bg-brass text-navy-deep"
                : "text-bone-cream/70 hover:text-bone-cream"
            }`}
          >
            <Caption uppercase>{(() => { try { return tt(`tracks.${t.id}.era`); } catch { return t.era; } })()}</Caption>
          </button>
        );
      })}
    </div>
  );
}
