"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useBrainStageStore, type SynapsePhase } from "@/store/useBrainStageStore";

/**
 * Screen-reader-only live region that narrates the synapse phase
 * machine as it advances. Pure text alt-path for the Three.js
 * canvas content (a11y Fix 8).
 *
 * The visual layer in `Synapse.tsx` remains the authority on
 * timing; it `setSynapsePhase()`s the store on every transition
 * (`idle → travelling-ap → ca-influx → fusing → crossing →
 * binding → afterglow → idle`). This component reads the phase
 * from the store and emits one sentence per phase into the
 * aria-live region.
 *
 * Mounted as a sibling of `<Synapse />` on the Cellular page;
 * renders an `sr-only` `role="status"` div with
 * `aria-live="polite"` and `aria-atomic="true"`.
 *
 * Locale-aware: phase descriptions come from
 * `cellular.synapsePhase.*` in the locale message bundle.
 */
export default function SynapsePhaseAnnouncer() {
  const phase = useBrainStageStore((s) => s.synapsePhase);
  const t = useTranslations("cellular.synapsePhase");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!phase || phase === "idle") {
      setMessage("");
      return;
    }
    // Look up the phase description; fall back to the phase id if
    // a locale hasn't supplied a string for that key.
    try {
      setMessage(t(phase));
    } catch {
      setMessage(phase as SynapsePhase);
    }
  }, [phase, t]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
