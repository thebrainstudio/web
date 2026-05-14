"use client";

import { useTranslations } from "next-intl";
import { Caption } from "@/components/typography/Typography";

/**
 * Brain Mirror attribution chip.
 *
 * Surfaces the engine that produced the last prediction. The Phase-10
 * brief requires this to be honest: if the response was a proxy
 * (embedding baseline, fakePredictor, anything that is NOT a real TRIBE
 * forward pass), we say so. Never claim TRIBE when it wasn't TRIBE.
 *
 * The chip has three states:
 *
 *   "tribe-live"  — real TRIBE v2 forward pass served the last response.
 *                   Full attribution: creator + paper + model card + license.
 *
 *   "baseline-fallback" — TRIBE was meant to be live but the request
 *                   failed (tunnel down, model cold-starting, rate limited).
 *                   The embedding baseline served the response.
 *
 *   "baseline-only" — this deployment has no TRIBE configured at all
 *                   (no NEXT_PUBLIC_TRIBE_API_BASE). The embedding
 *                   baseline is the primary engine, surfaced honestly.
 *
 * License compliance (CC-BY-NC-4.0 §3.a.1) requires retaining creator
 * identification, paper link, model-card link, and license URL whenever
 * the licensed material is shared. The "tribe-live" copy carries all
 * four artefacts.
 */

export type AttributionState = "tribe-live" | "baseline-fallback" | "baseline-only";

const MODEL_CARD_URL = "https://huggingface.co/facebook/tribev2";
const PAPER_URL = "https://arxiv.org/abs/2507.22229";
const LICENSE_URL = "https://creativecommons.org/licenses/by-nc/4.0/";

function StatusDot({ live }: { live: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-block size-1.5 rounded-full ${
        live
          ? "bg-brass shadow-[0_0_8px_var(--color-brass,#c9a961)]"
          : "bg-bone-cream/40"
      }`}
    />
  );
}

export default function AttributionChip({ state }: { state: AttributionState }) {
  const t = useTranslations("mirror.attribution");

  if (state === "tribe-live") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1"
      >
        <StatusDot live />
        <Caption className="text-bone-cream/70">
          {t("statusLive")} ·{" "}
          <span className="text-bone-cream/55">
            TRIBE v2 (Meta FAIR, d&apos;Ascoli et al., 2026){" "}
          </span>
          <a
            href={MODEL_CARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brass underline decoration-brass/40 underline-offset-2 transition-colors hover:decoration-brass"
          >
            {t("modelCard")}
          </a>
          <span className="text-bone-cream/55"> · </span>
          <a
            href={PAPER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brass underline decoration-brass/40 underline-offset-2 transition-colors hover:decoration-brass"
          >
            {t("paper")}
          </a>
          <span className="text-bone-cream/55"> · </span>
          <a
            href={LICENSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brass underline decoration-brass/40 underline-offset-2 transition-colors hover:decoration-brass"
          >
            {t("license")}
          </a>
          <span className="text-bone-cream/55">
            {" "}· text-only · average-subject
          </span>
        </Caption>
      </div>
    );
  }

  // Both baseline states surface the honest "not TRIBE" message.
  const copyKey = state === "baseline-fallback" ? "tribeOffline" : "baseline";
  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1"
    >
      <StatusDot live={false} />
      <Caption className="text-bone-cream/55 italic">{t(copyKey)}</Caption>
    </div>
  );
}
