"use client";

import dynamic from "next/dynamic";
import { useBrainStageStore } from "@/store/useBrainStageStore";

/**
 * Client wrapper that dynamic-imports the R3F canvas with `ssr: false`.
 * The canvas is mounted exactly once at the root layout and persists
 * across route changes. Pages drive its state via `useBrainStageStore`.
 *
 * The `visible` store flag toggles opacity instead of unmount so the
 * underlying WebGL context survives — pages like /cellular set it to
 * false because their own scale-specific canvases should own the visual
 * field there, and the macro brain in the background looked like a
 * bleed-through bug.
 */
const BrainStageClient = dynamic(() => import("./BrainStageClient"), {
  ssr: false,
  loading: () => null,
});

export default function BrainStage() {
  const visible = useBrainStageStore((s) => s.visible);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
      data-brain-stage
      style={{ opacity: visible ? 1 : 0 }}
    >
      <BrainStageClient />
    </div>
  );
}
