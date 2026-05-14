"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import { useTransitionState } from "@/lib/transitionState";
import { pathToRoomId, transitionStyle, type RoomId } from "@/lib/rooms";
import type { RegionId } from "@/lib/regions";
import { easeCinematic, easeExpressive } from "@/lib/animations";
import { Heading, Body, Caption, Mono } from "@/components/typography/Typography";

type Props = {
  title: string;
  description: string;
  href: string;
  index: number;
  pattern: Partial<Record<RegionId, number>>;
};

/**
 * One of the home-page doorways. Two layers of feedback:
 *
 *   1. Hover lerps the brain toward the room's signature pattern via
 *      `setActivations`. Leaving the card resets the pattern.
 *   2. Click intercepts the navigation: the card briefly scales down
 *      (a 150ms acknowledgment), the brain pulses toward the
 *      destination's activations, and only then do we hand off to
 *      the router. The orchestrator picks up the pathname change and
 *      continues the choreography on the other side.
 *
 * Doors that descend deeper (notably into Cellular) hold their pulse
 * for 750ms so the user feels the going-under. Standard doors hold
 * for 250ms — long enough for the brain to read, short enough that
 * the navigation doesn't feel laggy.
 */

const STANDARD_DOOR_HOLD_MS = 250;
const DESCENT_HOLD_MS = 750;
const TOUCH_DOOR_HOLD_MS = 100;
const REDUCED_MOTION_HOLD_MS = 30;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isTouchOnly(): boolean {
  if (typeof window === "undefined") return false;
  // (hover: none) matches phones and most tablets — the gesture is a
  // tap, not a hover, so a 250ms pre-nav hold reads as a "stuck"
  // tap. Shortening to ~100ms keeps the brain-pulse readable without
  // making the door feel laggy on touch.
  return window.matchMedia("(hover: none)").matches;
}

export default function RoomCard({
  title,
  description,
  href,
  index,
  pattern,
}: Props) {
  const router = useRouter();
  const setActivations = useBrainStageStore((s) => s.setActivations);
  const resetIdle = useBrainStageStore((s) => s.resetIdle);
  const setTransitionSnap = useTransitionState((s) => s.set);
  const [opening, setOpening] = useState(false);
  // Lock during in-flight choreography so a frantic double-click doesn't
  // trip the timeline up. The orchestrator handles rapid nav after the
  // route flips; the door's job is the pre-nav handoff.
  const inFlight = useRef(false);

  const onEnter = useCallback(() => {
    if (inFlight.current) return;
    setActivations(pattern as Record<string, number>);
  }, [pattern, setActivations]);

  const onLeave = useCallback(() => {
    if (inFlight.current) return;
    resetIdle();
  }, [resetIdle]);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let the browser handle modifier-clicks naturally (new tab, etc.).
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }
      e.preventDefault();
      if (inFlight.current) return;
      inFlight.current = true;

      const reduced = prefersReducedMotion();
      // Pulse the destination pattern hard — overshoot the hover state.
      setActivations(pattern as Record<string, number>);
      setOpening(true);

      // Pre-signal the orchestrator so any concurrent ScrollScene
      // triggers back off immediately. The orchestrator's own
      // pathname-change effect will re-confirm fromRoom/toRoom.
      const fromRoom: RoomId = pathToRoomId(
        typeof window !== "undefined" ? window.location.pathname : "/",
      );
      const toRoom: RoomId = pathToRoomId(href);
      setTransitionSnap({
        phase: "exiting",
        fromRoom,
        toRoom,
        startedAt: Date.now(),
      });

      const style = transitionStyle(fromRoom, toRoom);
      const touch = isTouchOnly();
      const hold = reduced
        ? REDUCED_MOTION_HOLD_MS
        : style === "deep-descent"
          ? // Descent is the one place a touch user still gets the
            // full pause — going into Cellular is the room's whole
            // promise; a short tap-flip would undersell it.
            DESCENT_HOLD_MS
          : touch
            ? TOUCH_DOOR_HOLD_MS
            : STANDARD_DOOR_HOLD_MS;

      window.setTimeout(() => {
        // Router push triggers the URL change; the orchestrator picks
        // up the rest. We don't reset `inFlight` here — the new page
        // mounts a fresh RoomCard instance.
        router.push(href);
      }, hold);
    },
    [href, pattern, router, setActivations, setTransitionSnap],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.8,
        ease: easeCinematic,
        delay: index * 0.12,
      }}
      // The card scales down 0.5% on opening, a near-imperceptible
      // pressure on the door that resolves before the route flips.
      animate={
        opening
          ? { scale: 0.995, opacity: 0.92 }
          : { scale: 1, opacity: 1 }
      }
      style={{ willChange: opening ? "transform, opacity" : undefined }}
      // We use the expressive easing for the door press — it's a
      // mechanical action, not a cinematic glide.
    >
      <Link
        href={href}
        prefetch
        onPointerEnter={onEnter}
        onFocus={onEnter}
        onPointerLeave={onLeave}
        onBlur={onLeave}
        onClick={onClick}
        className="group relative block"
        data-hover
      >
        <Mono variant="label" className="text-bone-cream/65 block">
          0{index + 1}
        </Mono>
        <Heading as="h3" className="mt-4 font-[200]">
          {title}
        </Heading>
        <Body className="text-bone-cream/65 mt-4 max-w-[22rem]">
          {description}
        </Body>
        <Caption uppercase className="text-brass mt-6 inline-flex items-center gap-2">
          Enter
          <motion.span
            aria-hidden
            className="inline-block"
            animate={opening ? { x: 14, opacity: 0.6 } : { x: 0, opacity: 1 }}
            transition={{ duration: 0.18, ease: easeExpressive }}
          >
            →
          </motion.span>
        </Caption>
        <motion.span
          aria-hidden
          className="bg-brass absolute -bottom-1 left-0 h-px"
          initial={{ width: 0 }}
          animate={{ width: opening ? "100%" : 0 }}
          whileHover={opening ? undefined : { width: "3rem" }}
          transition={{ duration: opening ? 0.4 : 0.5, ease: easeCinematic }}
        />
      </Link>
    </motion.div>
  );
}
