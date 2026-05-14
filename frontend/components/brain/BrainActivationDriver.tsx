"use client";

import { useEffect } from "react";
import { useBrainStageStore } from "@/store/useBrainStageStore";

/**
 * PR-A — Thin client wrapper that pushes a precomputed
 * HCP-MMP-360 parcel-activation map into the persistent brain
 * store on mount and clears it on unmount. Pages that read their
 * activation JSON at SSR time pass it as a prop; this keeps the
 * heavy bits (the parcel map can be ~3 KB) in the server-rendered
 * payload while the activation arrives the moment the page hydrates.
 */
export default function BrainActivationDriver({
  parcelActivations,
}: {
  parcelActivations: Record<string, number>;
}) {
  const setParcelActivations = useBrainStageStore(
    (s) => s.setParcelActivations,
  );
  const resetIdle = useBrainStageStore((s) => s.resetIdle);

  useEffect(() => {
    setParcelActivations(parcelActivations);
    return () => {
      resetIdle();
    };
  }, [parcelActivations, setParcelActivations, resetIdle]);

  return null;
}
