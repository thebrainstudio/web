"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { musicTracks, sampleTimeline } from "@/lib/musicTracks";
import { Body, Caption } from "@/components/typography/Typography";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import { easeCinematic } from "@/lib/animations";
import TrackPlayer from "./TrackPlayer";

/**
 * Compare mode: two players side by side. Only the focused one drives the
 * persistent brain — clicking either side hands the brain over. Visual cue:
 * brass divider, focused side gets the brass scrubber.
 */
export default function CompareMode() {
  const tt = useTranslations("music");
  const [leftId, setLeftId] = useState(musicTracks[0].id);
  const [rightId, setRightId] = useState(musicTracks[1].id);
  const [focused, setFocused] = useState<"left" | "right">("left");
  const setActivations = useBrainStageStore((s) => s.setActivations);

  const left = musicTracks.find((t) => t.id === leftId) ?? musicTracks[0];
  const right = musicTracks.find((t) => t.id === rightId) ?? musicTracks[1];

  const Selector = ({
    side,
    currentId,
    onChange,
  }: {
    side: "left" | "right";
    currentId: string;
    onChange: (id: string) => void;
  }) => (
    <div className="mb-4 flex flex-wrap gap-2">
      {musicTracks.map((t) => {
        const active = t.id === currentId;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            onPointerEnter={() => {
              if (focused === side) {
                setActivations(
                  sampleTimeline(
                    t.timeline,
                    Math.round(t.duration / 2),
                  ) as Record<string, number>,
                );
              }
            }}
            data-hover
            className={`rounded-sm px-2.5 py-1 transition-colors duration-200 ${
              active
                ? "bg-brass text-navy-deep"
                : "text-bone-cream/65 hover:text-bone-cream"
            }`}
          >
            <Caption uppercase>{(() => { try { return tt(`tracks.${t.id}.era`).split(" ·")[0]; } catch { return t.era.split(" ·")[0]; } })()}</Caption>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10">
      <AnimatePresence mode="popLayout">
        <motion.section
          key="left"
          layout
          onFocus={() => setFocused("left")}
          onPointerEnter={() => setFocused("left")}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeCinematic }}
          className={`relative md:pr-10 ${
            focused === "left"
              ? "md:border-r md:border-brass/40"
              : "md:border-r md:border-bone-cream/10"
          }`}
        >
          <Caption uppercase className={focused === "left" ? "text-brass" : "text-bone-cream/70"}>
            Left channel
          </Caption>
          <div className="mt-2">
            <Selector side="left" currentId={leftId} onChange={setLeftId} />
            <TrackPlayer
              track={left}
              primary={focused === "left"}
              driveBrain={focused === "left"}
            />
          </div>
        </motion.section>

        <motion.section
          key="right"
          layout
          onFocus={() => setFocused("right")}
          onPointerEnter={() => setFocused("right")}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeCinematic, delay: 0.1 }}
          className="md:pl-10"
        >
          <Caption uppercase className={focused === "right" ? "text-brass" : "text-bone-cream/70"}>
            Right channel
          </Caption>
          <div className="mt-2">
            <Selector side="right" currentId={rightId} onChange={setRightId} />
            <TrackPlayer
              track={right}
              primary={focused === "right"}
              driveBrain={focused === "right"}
            />
          </div>
        </motion.section>
      </AnimatePresence>

      <Body italic className="text-bone-cream/45 col-span-full max-w-[40rem]">
        The brain follows the channel under your cursor — hover the other
        side to hand it over.
      </Body>
    </div>
  );
}
