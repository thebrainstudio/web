"use client";

import Link from "next/link";

function GithubMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-1.9c-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.18.91-.25 1.88-.38 2.85-.38.97 0 1.94.13 2.85.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.57.23 2.73.11 3.02.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.77 1.04.77 2.1v3.11c0 .3.21.65.8.54 4.56-1.52 7.85-5.83 7.85-10.91C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

/**
 * Sticky persistent nav.
 * THE BRAIN STUDIO wordmark in Fraunces brass, top-left.
 * Right: room links, About, GitHub icon.
 * (Mute toggle is mounted by AmbientDrone separately to keep audio
 * concerns isolated from the nav.)
 */
export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 backdrop-blur-md">
      <div
        className="absolute inset-0 -z-10 bg-navy-deep/70"
        aria-hidden
      />
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="font-display text-base tracking-[0.22em] text-brass uppercase"
        >
          The Brain Studio
        </Link>
        <ul className="flex items-center gap-6 text-sm text-bone-cream/80 md:gap-8">
          <li>
            <Link
              href="/mirror"
              prefetch
              className="transition-colors duration-200 hover:text-bone-cream"
            >
              Mirror
            </Link>
          </li>
          <li>
            <Link
              href="/music"
              prefetch
              className="transition-colors duration-200 hover:text-bone-cream"
            >
              Music
            </Link>
          </li>
          <li>
            <Link
              href="/crosscultural"
              prefetch
              className="hidden transition-colors duration-200 hover:text-bone-cream md:inline"
            >
              Cross-Cultural
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              prefetch
              className="transition-colors duration-200 hover:text-bone-cream"
            >
              About
            </Link>
          </li>
          <li>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Source on GitHub"
              className="text-bone-cream/70 transition-colors duration-200 hover:text-brass"
            >
              <GithubMark />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
