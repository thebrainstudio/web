"use client";

import { useCallback, useState } from "react";
import { useLocale } from "next-intl";
import type { RegionId } from "@/lib/regions";
import { generateCaption } from "@/lib/mirror/caption-generator";
import { savedExamples } from "@/lib/savedExamples";
import { captureBrainViews } from "@/components/brain/BrainViews";

/**
 * Move 5 — "Export · PNG 1080×1080" button.
 *
 * POSTs the user's text + activations + generated caption to the
 * `/api/mirror/fingerprint` route and downloads the returned PNG.
 *
 * Filename: brain-mirror-YYYY-MM-DD-<6-char-hash>.png
 * Hash is derived from the text so identical inputs produce identical
 * filenames (useful for deduplication, small power-user affordance).
 */

type Props = {
  text: string;
  activations: Partial<Record<RegionId, number>>;
};

async function sha256_6(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", enc);
    const bytes = new Uint8Array(buf);
    return Array.from(bytes.slice(0, 3))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Fallback when crypto.subtle isn't available
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).slice(0, 6);
}

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function ExportPngButton({ text, activations }: Props) {
  const locale = useLocale();
  const [busy, setBusy] = useState(false);

  const onExport = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      // Generate the same caption the page is already showing.
      const caption = generateCaption({
        activations,
        examples: savedExamples.map((ex) => ({
          id: ex.id,
          label: ex.label,
          activations: ex.activations,
        })),
      });
      // Capture the four BrainViews canvases as PNG data URLs so the
      // export composition can embed the user's actual rendered brain
      // (the real fsaverage5 mesh with their TRIBE prediction colours)
      // rather than the schematic dot pattern we used to ship.
      const capturedViews = captureBrainViews();
      const brainImages = capturedViews
        .filter((v) => v.dataUrl !== null)
        .map((v) => ({ labelKey: v.labelKey, dataUrl: v.dataUrl as string }));

      const res = await fetch("/api/mirror/fingerprint", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text,
          activations,
          caption: caption.text,
          locale,
          brainImages,
        }),
      });
      if (!res.ok) {
        console.warn(
          "[ExportPngButton] fingerprint API failed:",
          res.status,
          await res.text(),
        );
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const hash = await sha256_6(text);
      const a = document.createElement("a");
      a.href = url;
      a.download = `brain-mirror-${todayIso()}-${hash}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Give the browser a tick to start the download, then release.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      setBusy(false);
    }
  }, [busy, text, activations, locale]);

  return (
    <button
      type="button"
      onClick={onExport}
      disabled={busy}
      data-hover
      className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-4 py-2 font-editorial text-caption uppercase tracking-[0.18em] transition-colors duration-300 disabled:opacity-60"
    >
      {busy ? "Generating…" : "Export · PNG 1080×1080"}
    </button>
  );
}
