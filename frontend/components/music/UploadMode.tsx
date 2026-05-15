"use client";

import { Body, Caption, Heading } from "@/components/typography/Typography";

/**
 * Upload mode is a Phase 11 feature — real client-side audio feature
 * extraction will live here. For now it's an honest stub: a drop target
 * that explains what it will become and gracefully refuses to compute.
 */
export default function UploadMode() {
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
      <div className="md:col-span-7">
        <Caption uppercase className="text-brass">
          Upload mode · stub
        </Caption>
        <Heading as="h3" className="mt-4 font-[200]">
          Drop your own audio — coming in Phase 11.
        </Heading>
        <Body className="text-bone-cream/80 mt-6 max-w-[34rem]">
          A future build computes spectral features and tempogram metadata
          client-side (no upload, your audio stays in your browser) and
          feeds them through the same timeline interpolation the Library
          tracks use.
        </Body>
        <Body italic className="text-bone-cream/85 mt-6 max-w-[34rem]">
          Until then, drag a file here and the page will respond as
          honestly as it can: by telling you what it doesn&apos;t yet do.
        </Body>
      </div>

      <div className="md:col-span-5">
        <div
          aria-disabled
          className="border-bone-cream/15 hover:border-bone-cream/30 flex h-72 items-center justify-center border border-dashed px-6 text-center transition-colors duration-300"
        >
          <Body italic className="text-bone-cream/80">
            Drag & drop · Phase 11
          </Body>
        </div>
      </div>
    </div>
  );
}
