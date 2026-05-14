"use client";

import { useEffect, useRef, useState } from "react";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import type { ParcelActivationFile } from "@/lib/loadActivations";

/**
 * PR-B — Bridges page activation driver. The page renders eleven
 * sections in a long scroll; this client component watches each
 * section's `data-bridge-section="<id>"` element, and as the most-
 * visible section changes it pushes that section's parcel-activation
 * map into the persistent brain store.
 *
 * The activation files are pre-loaded as a single dictionary at the
 * server level and passed in as a prop — no per-section network
 * call, just a switch in local state.
 *
 * Future-compat: if Bridges grows beyond one-page-many-sections to
 * a per-section route, this component is unnecessary; each route
 * would mount its own `BrainActivationDriver` instead.
 */
export default function BridgesActivationScroller({
  activationFiles,
}: {
  activationFiles: Record<string, ParcelActivationFile | null>;
}) {
  const setParcelActivations = useBrainStageStore(
    (s) => s.setParcelActivations,
  );
  const resetIdle = useBrainStageStore((s) => s.resetIdle);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Determine initial active section: first id with a real activation
  // file, falling back to "dmn-and-self-system" as the page's
  // canonical anchor.
  const initialRef = useRef(false);
  useEffect(() => {
    if (initialRef.current) return;
    initialRef.current = true;
    const fallback =
      "dmn-and-self-system" in activationFiles &&
      activationFiles["dmn-and-self-system"]
        ? "dmn-and-self-system"
        : Object.keys(activationFiles).find((k) => activationFiles[k]) ?? null;
    if (fallback) setActiveId(fallback);
  }, [activationFiles]);

  // IntersectionObserver: track which section is most-visible.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the highest intersectionRatio that
        // is intersecting.
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        }
        if (best) {
          const id = (best.target as HTMLElement).dataset.bridgeSection;
          if (id && activationFiles[id]) setActiveId(id);
        }
      },
      {
        // Trigger when the section's center is within the viewport.
        rootMargin: "-30% 0px -30% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    const els = document.querySelectorAll<HTMLElement>("[data-bridge-section]");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activationFiles]);

  // Push the active section's activation into the store.
  useEffect(() => {
    if (!activeId) return;
    const file = activationFiles[activeId];
    if (!file) return;
    setParcelActivations(file.parcel_activations);
  }, [activeId, activationFiles, setParcelActivations]);

  // Clear on unmount.
  useEffect(() => {
    return () => resetIdle();
  }, [resetIdle]);

  return null;
}
