"use client";

import { useEffect, useState } from "react";
import { Display } from "@/components/typography/Typography";
import { useReturningVisitor } from "@/hooks/useReturningVisitor";

/**
 * Home page hero. Renders the three lines as one <Display italic> with
 * each word entering in a 50ms stagger.
 *
 * Stagger is a CSS keyframe (see globals.css `.hero-word`) — pure CSS so
 * there are no Framer Motion hydration races in Next 16 / React 19 strict.
 * Per-word animation-delay is set inline.
 *
 * Reactivity-pass Fix 12 — returning-visitor opener.
 *
 * If `useReturningVisitor()` says we're an `opener` reader, the
 * Display first renders the line `you came back.` for 800 ms, then
 * crossfades over 1.2 s to the normal three-line hero. Reduced
 * motion and first-time visitors get the normal hero directly with
 * no flash. SSR renders the normal hero (no opener) so the
 * server-side HTML matches the most common path; the crossfade is
 * a post-hydration garnish only.
 */
export default function HeroDisplay({
  line1,
  line2,
  line3,
  className = "",
}: {
  line1: string;
  line2: string;
  line3: string;
  className?: string;
}) {
  const phase = useReturningVisitor();
  // Two-step animation state for the opener: 'prelude' → 'crossfade'
  // → 'normal'. Starts at 'normal' for SSR / first-visit / reduced
  // motion; flips to 'prelude' when the opener phase arrives.
  const [animState, setAnimState] = useState<"prelude" | "crossfade" | "normal">(
    "normal",
  );

  useEffect(() => {
    if (phase !== "opener") return;
    setAnimState("prelude");
    // Hold the prelude for 800 ms, then start the 1.2 s crossfade.
    const t1 = window.setTimeout(() => setAnimState("crossfade"), 800);
    const t2 = window.setTimeout(() => setAnimState("normal"), 800 + 1200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [phase]);

  const lines = [line1, line2, line3];
  // Build a flat sequence so the staggered delays are continuous across lines.
  let wordIndex = 0;
  const heroBody = (
    <>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden className="block">
        {lines.map((line, li) => {
          const words = line.split(" ");
          return (
            <span key={li} className="block">
              {words.map((word, wi) => {
                const delay = 0.18 + wordIndex * 0.06;
                wordIndex++;
                const last = wi === words.length - 1;
                return (
                  <span
                    key={`${li}-${wi}`}
                    className="hero-word"
                    style={{ animationDelay: `${delay}s` }}
                  >
                    {word}
                    {/* U+00A0 instead of " ": display:inline-block
                        plus white-space:nowrap was collapsing the
                        trailing space inside the box and jamming
                        adjacent words together. NBSP is never
                        collapsed. */}
                    {last ? "" : " "}
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </>
  );

  // When the opener is running we relative-position a wrapper and
  // overlay the prelude over the normal hero, crossfading opacity.
  if (animState === "normal") {
    return (
      <Display
        italic
        className={`text-bone-cream mx-auto max-w-[18ch] ${className}`}
      >
        {heroBody}
      </Display>
    );
  }

  const preludeOpacity = animState === "prelude" ? 1 : 0;
  const bodyOpacity = animState === "prelude" ? 0 : 1;
  const crossfadeDur = "1200ms";

  return (
    <div className="relative">
      {/* Prelude — fades out over 1.2 s once the crossfade starts.
          Wrapped in a div whose opacity carries the crossfade
          transition; Display itself doesn't accept a style prop. */}
      <div
        style={{
          opacity: preludeOpacity,
          transition: `opacity ${crossfadeDur} cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        <Display
          italic
          as="div"
          className={`text-bone-cream mx-auto max-w-[18ch] ${className}`}
        >
          <span aria-hidden className="block">
            you came back.
          </span>
        </Display>
      </div>
      {/* Normal hero — fades in over the same 1.2 s. Absolutely
          positioned over the prelude so the slot height is stable. */}
      <div
        className="absolute inset-0"
        style={{
          opacity: bodyOpacity,
          transition: `opacity ${crossfadeDur} cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        <Display
          italic
          as="div"
          className={`text-bone-cream mx-auto max-w-[18ch] ${className}`}
        >
          {heroBody}
        </Display>
      </div>
    </div>
  );
}
