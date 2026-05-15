"use client";

import { useEffect, useMemo, useRef, useState, use } from "react";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { tourByIdAndLocale } from "@/content/tours";
import { sceneAtTime, tourDuration } from "@/lib/tours";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import {
  Body,
  Caption,
  Display,
  Heading,
  Mono,
} from "@/components/typography/Typography";
import { easeCinematic, easeStandard } from "@/lib/animations";
import { regionById, type RegionId } from "@/lib/regions";
import { activationColor } from "@/lib/brain/activation-palette";

/**
 * Tour player. Drives the persistent brain through the scene-by-scene
 * choreography while the narration scrolls beside it. Auto-advances
 * on a real-time clock; the brain itself lerps to each scene's
 * target via BrainAnatomy's existing useFrame loop. The persistent
 * brain is intentionally reused — there is no second canvas — so
 * the tour feels like an extension of the single film the site is.
 *
 * No scrubbing is offered intentionally. The tour is meant to unfold
 * at its own pace; Pause and Restart are available, but seeking would
 * undermine the contemplative pacing.
 *
 * Reduced motion: the player honours `prefers-reduced-motion: reduce`
 * by leaving the brain at scene targets without the lerping
 * intermediate states. Scene-to-scene transitions become snaps.
 */
export default function TourPlayerPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = use(params);
  const t = useTranslations("tours");
  const locale = useLocale();

  const tour = tourByIdAndLocale(tourId, locale);
  if (!tour) notFound();

  const setTransform = useBrainStageStore((s) => s.setTransform);
  const setLighting = useBrainStageStore((s) => s.setLighting);
  const setActivations = useBrainStageStore((s) => s.setActivations);

  const totalDuration = useMemo(() => tourDuration(tour), [tour]);

  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const lastFrameTime = useRef<number | null>(null);
  const rafHandle = useRef<number | null>(null);

  // Clock loop. Uses rAF for smooth visual sync with the brain's lerping.
  useEffect(() => {
    if (!playing) {
      lastFrameTime.current = null;
      return;
    }
    const tick = (now: number) => {
      if (lastFrameTime.current === null) lastFrameTime.current = now;
      const dt = (now - lastFrameTime.current) / 1000;
      lastFrameTime.current = now;
      setElapsed((e) => {
        const next = e + dt;
        if (next >= totalDuration) {
          setPlaying(false);
          return totalDuration;
        }
        return next;
      });
      rafHandle.current = window.requestAnimationFrame(tick);
    };
    rafHandle.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafHandle.current !== null) {
        window.cancelAnimationFrame(rafHandle.current);
      }
    };
  }, [playing, totalDuration]);

  // Apply the current scene's brain target to the store as `elapsed`
  // advances. The brain interpolates these targets in its own loop;
  // ScrollScene is dormant on this page so we own the brain fully.
  const { sceneIndex, tourProgress } = sceneAtTime(tour, elapsed);
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

  const restart = () => {
    setElapsed(0);
    setPlaying(true);
  };

  const ended = elapsed >= totalDuration;

  // The narration column shows the current scene plus a faded
  // preview of the previous one (above) — context for the reader.
  const previousScene = sceneIndex > 0 ? tour.scenes[sceneIndex - 1] : null;

  return (
    <>
      {/* Player surface — brain on left two-thirds, narration on right */}
      <section className="relative min-h-screen px-6 pt-32 pb-24 md:px-10 md:pt-36">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          {/* Left: brain reference area. The persistent brain renders
              behind <main>; we leave this column mostly empty so the
              user can see the brain through it. */}
          <div className="md:col-span-7">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-bone-cream/50">
                <li>
                  <Link href="/" className="hover:text-brass">
                    <Caption uppercase className="tracking-[0.18em]">
                      The Brain Studio
                    </Caption>
                  </Link>
                </li>
                <li aria-hidden className="text-bone-cream/30">·</li>
                <li>
                  <Link href="/tours" className="hover:text-brass">
                    <Caption uppercase className="tracking-[0.18em]">
                      Tours
                    </Caption>
                  </Link>
                </li>
                <li aria-hidden className="text-bone-cream/30">·</li>
                <li>
                  <Caption uppercase className="text-bone-cream/80 tracking-[0.18em]">
                    {tour.title}
                  </Caption>
                </li>
              </ol>
            </nav>

            <Caption uppercase className="text-brass tracking-[0.22em]">
              {t("label")}
            </Caption>
            <Heading className="mt-4 font-[200] max-w-[34rem]">
              {tour.title}
            </Heading>
            <Body italic className="text-bone-cream/80 mt-4 max-w-[34rem]">
              {tour.subtitle}
            </Body>
          </div>

          {/* Right: narration column */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-32">
              <Mono variant="label" className="text-brass tracking-[0.18em]">
                {t("scene")} {String(sceneIndex + 1).padStart(2, "0")} /{" "}
                {String(tour.scenes.length).padStart(2, "0")}
              </Mono>

              {previousScene && (
                <Body className="text-bone-cream/60 mt-6 max-w-[28rem]">
                  {previousScene.narration}
                </Body>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: easeCinematic }}
                >
                  <Body className="text-bone-cream mt-6 max-w-[28rem] text-[1.05rem] leading-[1.7]">
                    {currentScene.narration}
                  </Body>
                </motion.div>
              </AnimatePresence>

              {/* Active regions panel — shows which regions the brain
                  is lighting up in this scene, with names + activation
                  strength. Lets viewers connect "the brain glows here"
                  to "this is Broca's area." Localized via the regions
                  namespace. */}
              <ActiveRegionsPanel
                key={currentScene.id}
                activeRegions={currentScene.activeRegions}
              />

              {/* Controls */}
              <div className="mt-12 flex items-center gap-3">
                {!ended ? (
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    data-hover
                    className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-4 py-2 transition-colors duration-300"
                  >
                    <Caption uppercase className="tracking-[0.22em]">
                      {playing ? t("pause") : t("play")}
                    </Caption>
                  </button>
                ) : (
                  <Caption className="text-bone-cream/85 italic">
                    {t("ended")}
                  </Caption>
                )}
                <button
                  type="button"
                  onClick={restart}
                  data-hover
                  className="text-bone-cream/85 hover:text-brass inline-flex items-center justify-center px-3 py-2 transition-colors duration-200"
                >
                  <Caption uppercase className="tracking-[0.22em]">
                    {t("restart")}
                  </Caption>
                </button>
              </div>

              {/* Continue card on end */}
              {ended && tour.continueHref && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: easeCinematic, delay: 0.4 }}
                  className="border-brass/30 mt-10 rounded-sm border px-5 py-4"
                >
                  <Caption uppercase className="text-brass tracking-[0.18em]">
                    {t("continueLabel")}
                  </Caption>
                  <Link
                    href={tour.continueHref as never}
                    prefetch
                    data-hover
                    className="hover:text-brass mt-2 inline-flex items-center gap-2 text-bone-cream/85 transition-colors duration-200"
                  >
                    <Body italic>{tour.continueLabel}</Body>
                    <span aria-hidden>→</span>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Progress bar pinned to the bottom */}
      <div
        aria-hidden
        className="fixed inset-x-0 bottom-0 z-[55] h-px bg-bone-cream/10"
      >
        <motion.div
          className="bg-brass h-px origin-left"
          animate={{ scaleX: tourProgress }}
          transition={{ duration: 0.12, ease: easeStandard }}
        />
      </div>
    </>
  );
}

/**
 * Active regions panel — shows the top-N regions firing in the
 * current scene, each with its localized name + activation
 * strength. The strength is communicated three ways:
 *
 *   1. A coloured pip on the left, in the same activation ramp the
 *      WebGL brain uses (idle → cold → cool → warm → hot).
 *   2. A horizontal brass bar whose width tracks activation 0→1.
 *   3. A mono activation % on the right.
 *
 * Region names come from the `regions` i18n namespace so the
 * Spanish tour shows Spanish names, the Thai tour shows Thai names,
 * etc. Falls back to the canonical `displayName` if the locale
 * doesn't have a translation. Anatomy name renders in caption type
 * underneath each display name for the reader who wants the
 * clinical anchor.
 *
 * Crossfade is handled by the parent (we key the whole panel on
 * scene id), so the panel slides in cleanly on each scene boundary.
 */
function ActiveRegionsPanel({
  activeRegions,
}: {
  activeRegions: Partial<Record<RegionId, number>>;
}) {
  const tRegions = useTranslations("regions");
  const tTour = useTranslations("tours");

  const top = useMemo(() => {
    return (Object.entries(activeRegions) as [RegionId, number][])
      .filter(([, v]) => v > 0.05)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [activeRegions]);

  // Localized region label helper — falls back to the canonical
  // English displayName if the locale bundle doesn't define it.
  const localName = (id: RegionId, fallback: string): string => {
    try {
      return tRegions(`${id}.displayName`);
    } catch {
      return fallback;
    }
  };
  const localAnatomy = (id: RegionId, fallback: string): string => {
    try {
      return tRegions(`${id}.anatomyName`);
    } catch {
      return fallback;
    }
  };

  if (top.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeCinematic, delay: 0.15 }}
      className="mt-10 max-w-[30rem]"
    >
      <Caption
        uppercase
        className="text-brass tracking-[0.22em] mb-3 block"
      >
        {tTour("activeRegions")}
      </Caption>
      <ul className="space-y-3">
        {top.map(([id, value]) => {
          const r = regionById[id];
          if (!r) return null;
          const color = activationColor(value);
          const pct = Math.round(value * 100);
          return (
            <li key={id} className="flex items-baseline gap-3">
              {/* Pip — activation-coloured dot */}
              <span
                aria-hidden
                className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <Caption className="text-bone-cream/90">
                    {localName(id, r.displayName)}
                  </Caption>
                  <Mono
                    variant="label"
                    className="text-brass tabular-nums tracking-[0.12em]"
                  >
                    {pct}%
                  </Mono>
                </div>
                <Caption className="text-bone-cream/70 mt-0.5 block text-[0.72rem]">
                  {localAnatomy(id, r.anatomyName)}
                </Caption>
                {/* Strength bar */}
                <div
                  aria-hidden
                  className="bg-bone-cream/8 mt-2 h-px w-full overflow-hidden"
                >
                  <div
                    className="h-px origin-left"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: color,
                      opacity: 0.85,
                    }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
