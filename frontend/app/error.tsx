"use client";

import { useEffect } from "react";
import {
  Body,
  Caption,
  Display,
} from "@/components/typography/Typography";

/**
 * Route-level error boundary. Matches the site's voice — no stack trace,
 * no marketing chrome. A single editorial line and a way back.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[brain-studio] route error:", error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 pt-32">
      <div className="mx-auto max-w-[40rem] text-center">
        <Caption uppercase className="text-brass">
          Something didn&apos;t resolve
        </Caption>
        <Display italic className="mt-10">
          The model lost its line for a moment.
        </Display>
        <Body className="text-bone-cream/80 mt-8">
          A part of the page failed to render. The persistent brain is
          still here, in the background, breathing. Try the room again —
          or step into another one.
        </Body>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            data-hover
            className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-6 py-3 transition-colors duration-300"
          >
            <Caption uppercase>Try again</Caption>
          </button>
          <a
            href="/"
            data-hover
            className="text-bone-cream/85 hover:text-bone-cream inline-flex items-center justify-center px-3 py-3 transition-colors duration-300"
          >
            <Caption uppercase>Return home</Caption>
          </a>
        </div>
        {error.digest && (
          <Caption className="text-bone-cream/35 mt-10 block">
            digest · {error.digest}
          </Caption>
        )}
      </div>
    </main>
  );
}
