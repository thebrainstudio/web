"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import { Caption, Mono } from "@/components/typography/Typography";
import { sceneAtTime, tourDuration, type Tour } from "@/lib/tours";
import { easeImportant, easeStandard } from "@/lib/animations";
import { regionById, type RegionId } from "@/lib/regions";
import { activationColor } from "@/lib/brain/activation-palette";

/**
 * Tours index hero — runs the featured tour autonomously on the
 * persistent brain canvas while the rest of the index page lists
 * the available tour cards.
 *
 * What it does
 *   - On mount, starts a rAF clock that advances `elapsed` in
 *     real time (1×; respects the visibility API so background
 *     tabs don't burn cycles).
 *   - As `elapsed` crosses each scene boundary, writes that
 *     scene's brainTransform + lighting + activeRegions into the
 *     brain stage store. The persistent BrainAnatomy lerps to the
 *     new state via its existing useFrame loop, so the brain
 *     glides through the tour exactly as it does in the player.
 *   - When the tour finishes, the clock loops back to 0 so the
 *     index page never "stalls" on a dead frame.
 *   - On unmount (route change), resets the brain to idle so the
 *     next page doesn't inherit the tour's last activation
 *     pattern.
 *
 * Visual treatment
 *   - The component renders a small contextual overlay above the
 *     index cards: a 'now showing' chip with the tour title, the
 *     current scene narration in italic, and a thin progress bar.
 *     Crossfades narration on scene boundaries.
 *   - The brain itself is the persistent canvas behind everything
 *     — there is no second canvas mounted here.
 *
 * Reduced motion
 *   - Disables the loop; the brain holds at the first scene's
 *     pattern so the page still shows the tour's first frame as a
 *     static still, but no autoplay happens. Caption shows the
 *     first scene's narration.
 */
type Props = {
  /** The tour to play. Pass the first/featured tour from the index. */
  tour: Tour;
  /** Translation strings — the parent index passes its `t("tour")`,
   *  `t("scene")` etc. so this component doesn't need its own
   *  next-intl hook for the tour-namespace labels. The regions
   *  namespace is read locally so the active-regions readout
   *  localizes alongside the rest of the site. */
  labels: {
    nowShowing: string;
    scene: string;
  };
};

export default function ToursIndexHero({ tour, labels }: Props) {
  const totalDuration = useMemo(() => tourDuration(tour), [tour]);

  const setTransform = useBrainStageStore((s) => s.setTransform);
  const setLighting = useBrainStageStore((s) => s.setLighting);
  const setActivations = useBrainStageStore((s) => s.setActivations);
  const resetIdle = useBrainStageStore((s) => s.resetIdle);

  const [elapsed, setElapsed] = useState(0);
  const [reduced, setReduced] = useState(false);
  const lastFrame = useRef<number | null>(null);
  const rafHandle = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  // Detect reduced motion once on mount; if reduced, freeze on
  // scene 0 so the user sees the tour's opening pattern without
  // any change.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pause the clock when the tab is hidden; nothing on the
  // persistent canvas needs to render while we're not looking.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onVis = () => {
      isVisibleRef.current = document.visibilityState === "visible";
      // Reset the last-frame anchor so dt doesn't spike on resume.
      if (isVisibleRef.current) lastFrame.current = null;
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // rAF clock. Loops back to 0 when the tour finishes so the
  // index page always has motion to offer.
  useEffect(() => {
    if (reduced) return;
    const tick = (now: number) => {
      if (!isVisibleRef.current) {
        rafHandle.current = window.requestAnimationFrame(tick);
        return;
      }
      if (lastFrame.current === null) lastFrame.current = now;
      const dt = (now - lastFrame.current) / 1000;
      lastFrame.current = now;
      setElapsed((e) => {
        const next = e + dt;
        // Loop with a tiny gap so the brain visibly resets between
        // play-throughs rather than snapping in the middle of a
        // long scene.
        return next >= totalDuration ? 0 : next;
      });
      rafHandle.current = window.requestAnimationFrame(tick);
    };
    rafHandle.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafHandle.current !== null) {
        window.cancelAnimationFrame(rafHandle.current);
      }
    };
  }, [reduced, totalDuration]);

  // Apply each scene's brain target as elapsed advances. The brain
  // anatomy's own useFrame loop lerps to the new state.
  const { sceneIndex } = sceneAtTime(tour, elapsed);
  const currentScene = tour.scenes[sceneIndex];

  useEffect(() => {
    setTransform({
      position: currentScene.brainTransform.position,
      scale: currentScene.brainTransform.scale,
      rotation: currentScene.brainTransform.rotation,
    });
    if (currentScene.lighting) setLighting(currentScene.lighting);
    setActivations(currentScene.activeRegions as Record<string, number>);
  }, [
    currentScene.id,
    currentScene.brainTransform.position,
    currentScene.brainTransform.scale,
    currentScene.brainTransform.rotation,
    currentScene.activeRegions,
    currentScene.lighting,
    setTransform,
    setLighting,
    setActivations,
  ]);

  // On unmount, return the persistent brain to idle so subsequent
  // pages don't inherit the tour's final activation pattern.
  useEffect(() => {
    return () => {
      resetIdle();
    };
  }, [resetIdle]);

  const progress = Math.min(1, elapsed / totalDuration);

  return (
    <div className="border-bone-cream/10 bg-navy-deep/30 mx-auto mt-12 max-w-[1100px] rounded-sm border px-6 py-6 backdrop-blur-sm md:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span
            aria-hidden
            className="bg-brass relative inline-block h-1.5 w-1.5 rounded-full"
          >
            <span className="bg-brass absolute inset-0 animate-ping rounded-full opacity-60" />
          </span>
          <Caption uppercase className="text-brass tracking-[0.22em]">
            {labels.nowShowing}
          </Caption>
          <Caption className="text-bone-cream/85">{tour.title}</Caption>
        </div>
        <Mono variant="label" className="text-bone-cream/75 tracking-[0.18em]">
          {labels.scene} {String(sceneIndex + 1).padStart(2, "0")} /{" "}
          {String(tour.scenes.length).padStart(2, "0")}
        </Mono>
      </div>

      {/* Narration — crossfades on scene boundary */}
      <div className="relative mt-4 min-h-[3.5rem]">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentScene.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.55, ease: easeImportant }}
            className="text-bone-cream/85 font-editorial max-w-[44rem] text-[1.05rem] italic leading-relaxed"
          >
            {currentScene.narration}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Active regions — compact horizontal readout so the index
          hero stays one-glance-readable while still telling the
          reader which areas of the brain are firing in this scene. */}
      <ActiveRegionsRow
        key={currentScene.id}
        activeRegions={currentScene.activeRegions}
      />

      {/* Progress bar */}
      <div
        aria-hidden
        className="bg-bone-cream/8 mt-5 h-px w-full overflow-hidden"
      >
        <motion.div
          className="bg-brass h-full origin-left"
          style={{ scaleX: progress, transformOrigin: "left" }}
          transition={{ duration: 0, ease: easeStandard }}
        />
      </div>
    </div>
  );
}

/**
 * Compact active-regions row used in the index hero. Flat chip
 * style so the hero stays one band tall — the full vertical
 * "lit up in this scene" panel lives inside the tour player.
 */
function ActiveRegionsRow({
  activeRegions,
}: {
  activeRegions: Partial<Record<RegionId, number>>;
}) {
  const tRegions = useTranslations("regions");
  const top = useMemo(() => {
    return (Object.entries(activeRegions) as [RegionId, number][])
      .filter(([, v]) => v > 0.08)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [activeRegions]);

  if (top.length === 0) return null;

  const localName = (id: RegionId, fallback: string): string => {
    try {
      return tRegions(`${id}.displayName`);
    } catch {
      return fallback;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={top.map(([id]) => id).join("|")}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.45, ease: easeImportant, delay: 0.1 }}
        className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5"
      >
        {top.map(([id, value]) => {
          const r = regionById[id];
          if (!r) return null;
          const color = activationColor(value);
          return (
            <span
              key={id}
              className="border-bone-cream/10 bg-bone-cream/[0.02] inline-flex items-center gap-2 rounded-sm border px-2.5 py-1"
            >
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <Caption className="text-bone-cream/80 text-[0.74rem]">
                {localName(id, r.displayName)}
              </Caption>
            </span>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
