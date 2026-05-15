"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRIDGE_STRENGTHS, type BridgeStrength } from "@/lib/bridges";
import { Caption, Mono } from "@/components/typography/Typography";
import { easeStandard } from "@/lib/animations";

/**
 * Small badge that displays a bridge strength rating. Shown at every
 * section header on the Bridges page, and on the cards under each
 * Region Atlas page's Thread section. Hover reveals the description
 * the strength represents.
 *
 * The four ratings use the locked palette plus the bridge accent —
 * brass on navy for tight, brass on bone for partial, both softened
 * for distant, oxblood on bone-cream for none. Each badge is a
 * fixed-width Mono label so the four cluster legibly when shown
 * side by side in the legend graphic on Section 1.
 */
export default function BridgeStrengthBadge({
  strength,
  className,
  showDescription = false,
}: {
  strength: BridgeStrength;
  className?: string;
  /** When true, render the description inline instead of in a popover. */
  showDescription?: boolean;
}) {
  const info = BRIDGE_STRENGTHS[strength];
  const [hover, setHover] = useState(false);

  return (
    <span
      className={`relative inline-flex items-center ${className ?? ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <span
        role="status"
        aria-label={`Bridge strength: ${info.label}. ${info.description}`}
        className="inline-flex items-center rounded-sm px-2.5 py-1"
        style={{ color: info.fg, backgroundColor: info.bg }}
      >
        <Mono variant="label" className="tracking-[0.18em]">
          {info.label.toUpperCase()}
        </Mono>
      </span>
      {showDescription ? (
        <Caption className="text-bone-cream/85 ml-3 italic">
          {info.description}
        </Caption>
      ) : (
        <AnimatePresence>
          {hover && (
            <motion.span
              role="tooltip"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18, ease: easeStandard }}
              className="bg-navy-deep/95 border-bone-cream/15 absolute left-0 top-full z-[60] mt-2 block w-[24rem] max-w-[80vw] rounded-sm border px-4 py-3 shadow-xl backdrop-blur"
            >
              <Mono variant="label" className="text-brass block">
                {info.label.toUpperCase()}
              </Mono>
              <Caption className="text-bone-cream/85 mt-1 block">
                {info.description}
              </Caption>
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </span>
  );
}
