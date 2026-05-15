"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Caption } from "@/components/typography/Typography";
import { regionById, type RegionId } from "@/lib/regions";
import { activationBandKey } from "@/lib/activationBands";

type Props = {
  text: string;
  topRegion?: { id: RegionId; activation: number };
};

/**
 * Capture the persistent brain canvas + composite the user's text and a
 * single poetic gloss line into a 1080×1080 PNG. Downloads on click.
 *
 * The Canvas already runs with preserveDrawingBuffer enabled so
 * `canvas.toDataURL` returns the actual rendered pixels. If for any reason
 * the canvas is unreachable, fall back to a text-only PNG.
 */
export default function SaveInsightButton({ text, topRegion }: Props) {
  const tMirror = useTranslations("mirror");
  const tRegions = useTranslations("regions");
  const tActivation = useTranslations("activation");
  const [working, setWorking] = useState(false);
  const tr = (t: ReturnType<typeof useTranslations>, key: string, fb: string) => {
    try { return t(key); } catch { return fb; }
  };

  const onSave = async () => {
    if (working) return;
    setWorking(true);

    try {
      const brainCanvas = document.querySelector(
        "[data-brain-stage] canvas",
      ) as HTMLCanvasElement | null;

      const W = 1080;
      const H = 1080;
      const out = document.createElement("canvas");
      out.width = W;
      out.height = H;
      const ctx = out.getContext("2d");
      if (!ctx) return;

      // Background: deep navy.
      ctx.fillStyle = "#0a1428";
      ctx.fillRect(0, 0, W, H);

      // Brain image in the top half, faded.
      if (brainCanvas) {
        try {
          const aspect = brainCanvas.width / brainCanvas.height;
          const drawH = Math.round(W * 0.55);
          const drawW = Math.round(drawH * aspect);
          const x = (W - drawW) / 2;
          const y = Math.round(W * 0.06);
          ctx.save();
          ctx.globalAlpha = 0.92;
          ctx.drawImage(brainCanvas, x, y, drawW, drawH);
          ctx.restore();
        } catch {
          /* CORS / drawing-buffer issue — skip */
        }
      }

      // The text (Fraunces editorial).
      ctx.fillStyle = "#f0e8d8";
      ctx.textAlign = "left";

      const textTop = Math.round(W * 0.66);
      const margin = 80;
      const maxW = W - margin * 2;
      ctx.font = '500 22px "Fraunces", Georgia, serif';
      ctx.fillStyle = "#c9a961";
      ctx.fillText(tr(tMirror, "revealLabel", "What your writing reveals").toUpperCase(), margin, textTop);

      ctx.font = 'italic 32px "Fraunces", Georgia, serif';
      ctx.fillStyle = "#f0e8d8";
      const truncated = text.length > 220 ? text.slice(0, 217) + "…" : text;
      wrapText(ctx, truncated, margin, textTop + 56, maxW, 44);

      if (topRegion) {
        const r = regionById[topRegion.id];
        const poetic = tr(tRegions, `${topRegion.id}.poeticGloss`, r.poeticGloss);
        const anatomy = tr(tRegions, `${topRegion.id}.anatomyName`, r.anatomyName);
        ctx.font = '400 20px "Fraunces", Georgia, serif';
        ctx.fillStyle = "rgba(240, 232, 216, 0.6)";
        const poeticY = H - margin - 80;
        wrapText(ctx, "— " + poetic, margin, poeticY, maxW, 28);

        ctx.font = 'italic 14px "Fraunces", Georgia, serif';
        ctx.fillStyle = "#c9a961";
        // Integrity-pass: shared PNG no longer carries a
        // false-precision percentage. Band label keeps the readout
        // honest when the insight gets shared off-site.
        const band = tActivation(activationBandKey(topRegion.activation));
        ctx.fillText(
          `${anatomy.toUpperCase()}  ·  ${band.toUpperCase()}`,
          margin,
          H - margin - 16,
        );
      }

      // Watermark.
      ctx.font = '400 14px "Fraunces", Georgia, serif';
      ctx.fillStyle = "rgba(240, 232, 216, 0.4)";
      ctx.textAlign = "right";
      ctx.fillText("the brain studio", W - margin, H - margin - 16);

      const dataUrl = out.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `brain-mirror-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setWorking(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onSave}
      disabled={!text.trim() || working}
      data-hover
      aria-label="Save this insight as a PNG"
      className="border-brass text-brass hover:bg-brass hover:text-navy-deep disabled:cursor-not-allowed disabled:opacity-40 inline-flex items-center gap-2 rounded-sm border px-5 py-2.5 transition-colors duration-300"
    >
      <Caption uppercase>{working ? "Composing…" : "Save this insight"}</Caption>
    </button>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(/\s+/);
  let line = "";
  let yy = y;
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}
