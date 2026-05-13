"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import { getTransitionPhase, useTransitionState } from "@/lib/transitionState";
import type { ScrollSceneConfig } from "@/lib/scrollScenes";

type Props = ScrollSceneConfig & {
  children: ReactNode;
  className?: string;
  /** Used to identify which scene fired in dev. */
  debug?: boolean;
};

/**
 * Wraps a `<section>` that should drive brain camera + lighting + activations.
 * When the section enters the viewport (top crosses center), it writes its
 * targets into the brain stage store. The brain itself lerps toward those
 * targets in its own `useFrame` loop, so motion stays smooth even if scroll
 * is fast.
 *
 * Two-way trigger: also fires on scroll back up (`onEnterBack`).
 */
export default function ScrollScene({
  id,
  brain,
  lighting,
  meshResolution,
  children,
  className,
  debug,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const setTransform = useBrainStageStore((s) => s.setTransform);
  const setLighting = useBrainStageStore((s) => s.setLighting);
  const setActivations = useBrainStageStore((s) => s.setActivations);
  const setMeshResolution = useBrainStageStore((s) => s.setMeshResolution);

  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);

    // The orchestrator owns the brain during the room-to-room
    // transition window. We back off while phase !== "idle" so the
    // scenic anchor isn't clobbered mid-glide. As soon as the phase
    // returns to idle, we replay the current scene's apply() if it
    // is still within the trigger range, so the user doesn't end up
    // looking at the wrong anchor on a freshly-landed page.
    let queued = false;
    const apply = () => {
      if (getTransitionPhase() !== "idle") {
        queued = true;
        return;
      }
      if (debug) console.log("[ScrollScene]", id);
      setTransform({
        position: brain.position,
        scale: brain.scale,
        rotation: brain.rotation,
      });
      if (lighting) setLighting(lighting);
      if (brain.activations) {
        setActivations(brain.activations as Record<string, number>);
      }
      if (meshResolution) setMeshResolution(meshResolution);
    };

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 65%",
      end: "bottom 35%",
      onEnter: apply,
      onEnterBack: apply,
    });

    // Replay if a queued apply was suppressed during a transition.
    const unsub = useTransitionState.subscribe((state) => {
      if (state.phase === "idle" && queued) {
        queued = false;
        // Only fire if our trigger is currently within range.
        if (trigger.isActive) apply();
      }
    });

    return () => {
      trigger.kill();
      unsub();
    };
  }, [
    id,
    brain.position,
    brain.scale,
    brain.rotation,
    brain.activations,
    lighting,
    meshResolution,
    setTransform,
    setLighting,
    setActivations,
    setMeshResolution,
    debug,
  ]);

  return (
    <section ref={ref} data-scene={id} className={className}>
      {children}
    </section>
  );
}
