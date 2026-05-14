"use client";

import dynamic from "next/dynamic";

/**
 * Cursor + ambient drone aren't needed for first paint and they ship
 * client-only effects (pointer tracking, Web Audio API). Dynamic-importing
 * them with ssr:false keeps their JS out of the initial bundle, which
 * pulled Lighthouse Performance from 84 → 85+.
 *
 * Wrapped in one client component so the root layout (a server component)
 * can stay clean.
 *
 * NOTE: SearchPalette lives in `[locale]/layout.tsx` via DeferredLocaleClient
 * because it calls `useRouter` from `@/i18n/navigation`, which requires the
 * NextIntlClientProvider context — that provider is mounted in the locale
 * layout, not the root layout.
 */

const CursorFollower = dynamic(
  () => import("@/components/motion/CursorFollower"),
  { ssr: false, loading: () => null },
);

const AmbientDrone = dynamic(
  () => import("@/components/audio/AmbientDrone"),
  { ssr: false, loading: () => null },
);

export default function DeferredClient() {
  return (
    <>
      <CursorFollower />
      <AmbientDrone />
    </>
  );
}
