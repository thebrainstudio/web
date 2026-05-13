"use client";

import dynamic from "next/dynamic";

/**
 * Client wrapper that dynamic-imports the R3F canvas with `ssr: false`.
 * The canvas is mounted exactly once at the root layout and persists
 * across route changes. Pages drive its state via `useBrainStageStore`.
 */
const BrainStageClient = dynamic(() => import("./BrainStageClient"), {
  ssr: false,
  loading: () => null,
});

export default function BrainStage() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      data-brain-stage
    >
      <BrainStageClient />
    </div>
  );
}
