"use client";

import Image from "next/image";
import { useState } from "react";
import { Caption, Mono } from "@/components/typography/Typography";

export type ImageProvenance = {
  src: string;
  title: string;
  artist: string;
  date: string;
  institution: string;
  license: string;
  source_url: string;
  note?: string;
};

type Props = {
  prov: ImageProvenance;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  /** Alt fallback if you want to override the auto-generated one. */
  alt?: string;
};

/**
 * A public-domain artwork rendered with a brass-bordered frame, a Mono
 * caption beneath it, and a small ⓘ affordance in the corner that opens
 * a panel with full provenance. Every artifact in the site that has
 * provenance metadata uses this component — the discipline is that you
 * cannot show the picture without being able to show where it came from.
 */
export default function AttributedImage({
  prov,
  width,
  height,
  priority = false,
  className = "",
  alt,
}: Props) {
  const [open, setOpen] = useState(false);
  const finalAlt =
    alt ?? `${prov.title} by ${prov.artist} (${prov.date}). ${prov.note ?? ""}`;

  return (
    <figure className={`relative ${className}`}>
      <div className="border-brass/30 ring-brass/10 relative overflow-hidden border ring-1">
        <Image
          src={prov.src}
          alt={finalAlt}
          width={width}
          height={height}
          priority={priority}
          className="block h-auto w-full"
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Image provenance"
          aria-expanded={open}
          className="bg-navy-deep/70 text-bone-cream/80 border-bone-cream/15 hover:bg-brass hover:text-navy-deep absolute right-3 top-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs backdrop-blur-md transition-colors"
        >
          ⓘ
        </button>
        {open && (
          <div className="bg-navy-deep/95 border-brass/30 absolute inset-x-0 bottom-0 z-10 border-t p-5 backdrop-blur-md">
            <Caption uppercase className="text-brass">
              Provenance
            </Caption>
            <div className="mt-3 space-y-1.5">
              <div className="text-bone-cream/90">
                <Caption className="text-bone-cream/90">{prov.title}</Caption>
              </div>
              <div className="text-bone-cream/60">
                <Caption>
                  {prov.artist} · {prov.date}
                </Caption>
              </div>
              <div className="text-bone-cream/60">
                <Caption>{prov.institution}</Caption>
              </div>
              <div>
                <Mono variant="label" className="text-bone-cream/45">
                  {prov.license}
                </Mono>
              </div>
              <div className="pt-2">
                <a
                  href={prov.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brass hover:text-bone-cream"
                >
                  <Mono variant="label">source ↗</Mono>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      <figcaption>
        <Mono
          variant="label"
          className="text-bone-cream/70 mt-3 block"
        >
          {prov.artist} · {prov.title} · {prov.date} · {prov.institution}
        </Mono>
      </figcaption>
    </figure>
  );
}
