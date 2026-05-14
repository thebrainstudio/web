"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { usePathname } from "next/navigation";
import { pathToRoomId, type RoomId } from "@/lib/rooms";
import { easeCinematic } from "@/lib/animations";

/**
 * Persistent atmospheric layer. One full-viewport div mounted at the
 * root layout, whose background morphs between per-room presets as
 * the orchestrator changes rooms. The result is a slow ambient wash
 * that survives navigation — opening a door and the world's light
 * temperature shifts before the new content settles.
 *
 * Each per-page `AtmosphericGlow` keeps doing its localised job on
 * top of this layer; the persistent layer is the *room's* light, not
 * the *scene's*.
 *
 * Reduced motion: morph crossfade is shortened but still happens, so
 * the room-id-coded color cue is preserved as information.
 *
 * Phase 11 — Move 1.2: listens for `brain-studio:keystroke-pulse`
 * events and emits a brief opacity bump (idle → idle+0.04 over 180 ms,
 * then idle+0.04 → idle over 440 ms). The pulse is global to this
 * persistent layer, not scoped to the textarea — an ambient signal
 * that *something is being received*. Reduced-motion users get no
 * pulse (the room-transition cue is still preserved as information).
 */

/** Public event name. Dispatched from MirrorInput on every keystroke. */
export const KEYSTROKE_PULSE_EVENT = "brain-studio:keystroke-pulse";

/** Amplitude of the pulse, added to the current room's idle opacity. */
const PULSE_AMPLITUDE = 0.04;
const PULSE_UP_MS = 180;
const PULSE_DOWN_MS = 440;
/** Coalesce pulses fired within this window to one — prevents a runaway
 * pulse train under fast typing. */
const PULSE_COALESCE_MS = 60;

type RoomAtmosphere = {
  /** A CSS `background-image` value — typically one or more radial-gradients. */
  backgroundImage: string;
  /** Outer opacity for the wash. Lower = less assertive. */
  opacity: number;
};

const ROOM_ATMOSPHERE: Record<RoomId, RoomAtmosphere> = {
  home: {
    backgroundImage:
      "radial-gradient(ellipse 1400px 1000px at 50% -5%, rgba(232, 160, 74, 0.10) 0%, rgba(201, 169, 97, 0.04) 35%, transparent 70%)",
    opacity: 0.9,
  },
  mirror: {
    backgroundImage:
      "radial-gradient(ellipse 1200px 900px at 50% -2%, rgba(232, 160, 74, 0.12) 0%, rgba(201, 169, 97, 0.05) 40%, transparent 72%)",
    opacity: 1,
  },
  music: {
    backgroundImage:
      "radial-gradient(ellipse 1400px 900px at 25% 15%, rgba(92, 200, 214, 0.08) 0%, transparent 60%), radial-gradient(ellipse 1000px 700px at 85% 90%, rgba(139, 58, 58, 0.06) 0%, transparent 60%)",
    opacity: 1,
  },
  crosscultural: {
    backgroundImage:
      "radial-gradient(ellipse 1100px 800px at 50% 45%, rgba(139, 58, 58, 0.10) 0%, rgba(139, 58, 58, 0.04) 38%, transparent 70%)",
    opacity: 1,
  },
  threshold: {
    backgroundImage:
      "radial-gradient(ellipse 1300px 900px at 50% 0%, rgba(232, 160, 74, 0.08) 0%, rgba(201, 169, 97, 0.03) 40%, transparent 72%)",
    opacity: 0.85,
  },
  archetypes: {
    backgroundImage:
      "radial-gradient(ellipse 1100px 900px at 18% 12%, rgba(232, 160, 74, 0.09) 0%, rgba(201, 169, 97, 0.04) 38%, transparent 70%), radial-gradient(ellipse 800px 600px at 82% 85%, rgba(184, 138, 160, 0.05) 0%, transparent 65%)",
    opacity: 0.9,
  },
  cellular: {
    backgroundImage:
      "radial-gradient(ellipse 1100px 900px at 50% 55%, rgba(139, 58, 58, 0.14) 0%, rgba(139, 58, 58, 0.05) 36%, transparent 70%)",
    opacity: 1,
  },
  about: {
    backgroundImage:
      "radial-gradient(ellipse 1300px 900px at 50% 0%, rgba(232, 160, 74, 0.07) 0%, rgba(201, 169, 97, 0.03) 40%, transparent 72%)",
    opacity: 0.8,
  },
  "field-notes": {
    backgroundImage:
      "radial-gradient(ellipse 1200px 900px at 22% 18%, rgba(232, 160, 74, 0.07) 0%, rgba(201, 169, 97, 0.03) 38%, transparent 70%)",
    opacity: 0.8,
  },
  atlas: {
    // Atlas is the reference layer — quieter than the rooms, with a
    // small warm glow at the top so the navy doesn't read as void.
    backgroundImage:
      "radial-gradient(ellipse 1300px 1000px at 50% -3%, rgba(232, 160, 74, 0.08) 0%, rgba(201, 169, 97, 0.03) 38%, transparent 70%)",
    opacity: 0.85,
  },
  bridges: {
    // Bridges sits between the neuroscience and depth-psychology
    // sides of the site. The atmosphere blends a warm top glow with
    // a cool counterpoint at the lower-right — visually signalling
    // the two-language framing of the page.
    backgroundImage:
      "radial-gradient(ellipse 1200px 900px at 30% 0%, rgba(232, 160, 74, 0.08) 0%, transparent 60%), radial-gradient(ellipse 1000px 700px at 80% 95%, rgba(92, 200, 214, 0.05) 0%, transparent 60%)",
    opacity: 0.9,
  },
  tours: {
    // The tour player needs the cleanest possible reading background
    // — a single soft warmth at the top of the screen, nothing
    // competing with the brain animation and the narration column.
    backgroundImage:
      "radial-gradient(ellipse 1400px 1000px at 50% -8%, rgba(232, 160, 74, 0.08) 0%, rgba(201, 169, 97, 0.03) 35%, transparent 70%)",
    opacity: 0.85,
  },
  "depth-psychology": {
    // The depth-psychology section reads warmer than the rest of the
    // site — a soft amber wash that signals reflective territory. The
    // long-form pages each read as a single sustained piece of writing,
    // and the atmosphere supports that pacing.
    backgroundImage:
      "radial-gradient(ellipse 1300px 1000px at 35% -5%, rgba(232, 160, 74, 0.10) 0%, rgba(201, 169, 97, 0.04) 40%, transparent 72%)",
    opacity: 0.9,
  },
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function PersistentAtmosphere() {
  const pathname = usePathname();
  const room = pathToRoomId(pathname);
  const [reduced, setReduced] = useState(false);
  const controls = useAnimation();
  // Coalesce keystroke bursts so we don't ramp into a permanent overdrive.
  const lastPulseAt = useRef(0);
  const pulseInFlight = useRef(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  const target = ROOM_ATMOSPHERE[room];

  // Phase 11 — Move 1.2: ambient pulse on keystroke.
  useEffect(() => {
    if (reduced) return; // reduced-motion users get no pulse
    const idle = target.opacity;
    const peak = Math.min(1, idle + PULSE_AMPLITUDE);

    const onPulse = () => {
      const now =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      // Coalesce: ignore pulses fired within the coalesce window of the
      // previous one. Keeps fast typists from stacking the up-ramp.
      if (now - lastPulseAt.current < PULSE_COALESCE_MS) return;
      lastPulseAt.current = now;
      // If another pulse is already animating, let it finish; the next
      // event will pick up after the coalesce window.
      if (pulseInFlight.current) return;
      pulseInFlight.current = true;
      void (async () => {
        await controls.start({
          opacity: peak,
          transition: { duration: PULSE_UP_MS / 1000, ease: easeCinematic },
        });
        await controls.start({
          opacity: idle,
          transition: { duration: PULSE_DOWN_MS / 1000, ease: easeCinematic },
        });
        pulseInFlight.current = false;
      })();
    };

    window.addEventListener(KEYSTROKE_PULSE_EVENT, onPulse);
    return () => window.removeEventListener(KEYSTROKE_PULSE_EVENT, onPulse);
  }, [controls, target.opacity, reduced]);

  // Keep the controls in sync with the room's idle opacity whenever the
  // pathname changes (so the pulse animation ends at the *new* idle).
  useEffect(() => {
    controls.set({ opacity: target.opacity });
  }, [controls, target.opacity, pathname]);

  return (
    <motion.div
      aria-hidden="true"
      data-persistent-atmosphere
      // Sits between the body wash and the persistent brain (both z-0).
      // The brain canvas DOM follows this element so it composites on top.
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 0,
        // Initial paint values — framer-motion will tween from these
        // to `animate` whenever the room changes. Without an explicit
        // initial the first paint is empty (no gradient ever appears).
        backgroundImage: target.backgroundImage,
        opacity: target.opacity,
      }}
      animate={controls}
      // backgroundImage transitions stay on the standard room-morph
      // timing — pulse only touches opacity via the imperative controls.
      transition={{
        duration: reduced ? 0.2 : 1.4,
        ease: easeCinematic,
      }}
      initial={{
        backgroundImage: target.backgroundImage,
        opacity: target.opacity,
      }}
    />
  );
}

/**
 * Dispatch a keystroke pulse. Safe to call from any client component;
 * the PersistentAtmosphere listener handles coalescing internally.
 *
 * Reduced-motion users never see the pulse, by design — the listener
 * exits early in that case.
 */
export function dispatchKeystrokePulse(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(KEYSTROKE_PULSE_EVENT));
}
