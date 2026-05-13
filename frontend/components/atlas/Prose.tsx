"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseProse } from "@/lib/atlas";
import { citations, type Citation } from "@/lib/citations";
import { Body, Caption, Mono } from "@/components/typography/Typography";
import { easeStandard } from "@/lib/animations";

/**
 * Renders a single Atlas paragraph. Citations appear as a brass
 * superscript number; clicking opens a small popover with the full
 * reference. The numbered order matches the section's own citation
 * order (passed in via `citationOrder`) so a reader scanning
 * superscripts can find the matching entry in the sidebar's source
 * list.
 *
 * Lives in `components/atlas/` so the parser stays close to the
 * type definition in `lib/atlas.ts`.
 */

type Props = {
  paragraph: string;
  /**
   * Ordered list of citation ids for the section this paragraph
   * belongs to. Used to assign each `[cite:id]` a stable number.
   */
  citationOrder: string[];
};

export default function Prose({ paragraph, citationOrder }: Props) {
  const segments = useMemo(() => parseProse(paragraph), [paragraph]);
  const indexFor = useMemo(() => {
    const m = new Map<string, number>();
    citationOrder.forEach((id, i) => m.set(id, i + 1));
    return m;
  }, [citationOrder]);

  return (
    <Body className="text-bone-cream/80 mt-6 max-w-[34rem] leading-[1.7]">
      {segments.map((seg, i) => {
        if (seg.kind === "text") {
          return <span key={i}>{seg.value}</span>;
        }
        const citation = citations[seg.id];
        if (!citation) {
          // Author error — emit a small visible marker so the
          // missing citation is obvious in dev.
          return (
            <span
              key={i}
              className="text-oxblood"
              title={`Missing citation: ${seg.id}`}
            >
              [?]
            </span>
          );
        }
        const number = indexFor.get(seg.id) ?? 0;
        return <CitationMarker key={i} number={number} citation={citation} />;
      })}
    </Body>
  );
}

function CitationMarker({
  number,
  citation,
}: {
  number: number;
  citation: Citation;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block align-baseline">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-label={`Citation ${number}: ${citation.authors} ${citation.year}`}
        className="text-brass hover:text-amber-soft mx-0.5 inline-flex translate-y-[-0.4em] text-[0.7em] underline decoration-brass/40 underline-offset-2 transition-colors duration-150"
        data-hover
      >
        {number}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: easeStandard }}
            className="bg-navy-deep/95 border-bone-cream/15 absolute left-0 top-full z-[60] mt-2 block w-[22rem] max-w-[80vw] rounded-sm border px-4 py-3 shadow-xl backdrop-blur"
          >
            <Mono variant="label" className="text-brass block">
              [{number}]
            </Mono>
            <Caption className="text-bone-cream/85 mt-1 block">
              {citation.authors} <span className="text-bone-cream/55">({citation.year})</span>
            </Caption>
            <Caption className="text-bone-cream/85 mt-1 block italic">
              {citation.title}
            </Caption>
            <Caption className="text-bone-cream/55 mt-1 block">
              {citation.journal}
              {citation.doi ? ` · doi:${citation.doi}` : null}
            </Caption>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
