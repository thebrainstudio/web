"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
 */

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
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function PersistentAtmosphere() {
  const pathname = usePathname();
  const room = pathToRoomId(pathname);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  const target = ROOM_ATMOSPHERE[room];

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
      animate={{
        backgroundImage: target.backgroundImage,
        opacity: target.opacity,
      }}
      transition={{
        duration: reduced ? 0.2 : 1.4,
        ease: easeCinematic,
      }}
    />
  );
}
