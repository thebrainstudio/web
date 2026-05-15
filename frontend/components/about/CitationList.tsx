"use client";

import { motion } from "framer-motion";
import { citations } from "@/lib/citations";
import {
  Body,
  Caption,
  Mono,
} from "@/components/typography/Typography";
import { easeCinematic } from "@/lib/animations";

/**
 * Renders every entry from lib/citations.ts in author-year order, with
 * DOIs linked through to doi.org. Each row is one stagger step.
 */
export default function CitationList() {
  const rows = Object.values(citations).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.authors.localeCompare(b.authors);
  });

  return (
    <ol className="border-bone-cream/10 mt-10 border-t">
      {rows.map((c, i) => (
        <motion.li
          key={c.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.6,
            ease: easeCinematic,
            delay: Math.min(0.6, i * 0.05),
          }}
          className="border-bone-cream/5 grid grid-cols-1 gap-3 border-b py-6 md:grid-cols-12"
        >
          <div className="md:col-span-1">
            <Mono variant="label" className="text-brass">
              {String(i + 1).padStart(2, "0")}
            </Mono>
          </div>
          <div className="md:col-span-11">
            <Body className="text-bone-cream/80">
              {c.authors} ({c.year}).{" "}
              <span className="italic">{c.title}</span>{" "}
              <Caption className="text-bone-cream/85">{c.journal}.</Caption>
            </Body>
            {c.doi && (
              <a
                href={`https://doi.org/${c.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brass text-bone-cream/70 mt-2 inline-block transition-colors duration-200"
              >
                <Mono variant="label">doi:{c.doi}</Mono>
              </a>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
