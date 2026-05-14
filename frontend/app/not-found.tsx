import Link from "next/link";
import {
  Body,
  Caption,
  Display,
} from "@/components/typography/Typography";

/**
 * Root-level 404. audit-fix: Task 5. In practice proxy.ts redirects
 * every URL into a locale prefix, so the locale-aware 404 at
 * app/[locale]/not-found.tsx is the page users actually see. This
 * file exists as a hard fallback for pathways that escape the proxy
 * (e.g. direct requests for paths that shouldn't be routed).
 *
 * Kept intentionally minimal and locale-agnostic — no room list, just
 * a way home. The locale 404 carries the editorial copy.
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 pt-32">
      <div className="mx-auto max-w-[40rem] text-center">
        <Caption uppercase className="text-brass">
          Out of the training distribution
        </Caption>
        <Display italic className="mt-10">
          We didn&apos;t learn that page.
        </Display>
        <Body className="text-bone-cream/65 mt-8">
          That address isn&apos;t one of the rooms we built.
        </Body>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            prefetch
            data-hover
            className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-5 py-2.5 transition-colors duration-300"
          >
            <Caption uppercase>Home</Caption>
          </Link>
        </div>
      </div>
    </main>
  );
}
