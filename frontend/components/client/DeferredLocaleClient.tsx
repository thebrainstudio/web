"use client";

import dynamic from "next/dynamic";

/**
 * Locale-scoped client-only components. Lives inside the locale layout
 * so it sits under NextIntlClientProvider — anything here is free to
 * call locale-aware hooks like `useRouter`/`usePathname` from
 * `@/i18n/navigation`.
 *
 * SearchPalette specifically needs this scope: its `useRouter` from
 * next-intl throws if called outside the provider, which Next 16 then
 * catches and renders as the framework's default "page couldn't load"
 * fallback (no global-error.tsx → built-in UI).
 */

const SearchPalette = dynamic(
  () => import("@/components/search/SearchPalette"),
  { ssr: false, loading: () => null },
);

export default function DeferredLocaleClient() {
  return <SearchPalette />;
}
