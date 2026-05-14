/**
 * Per-page SEO helpers. audit-fix: Task 4.
 *
 * Every route should declare canonical + per-locale alternates + a
 * room-scoped og:url and og:image instead of inheriting the bare-domain
 * defaults from app/layout.tsx. Use `roomMetadata()` from each page's
 * generateMetadata to keep the wiring identical.
 */

import type { Metadata } from "next";
import { locales, defaultLocale, type Locale } from "@/i18n/locales";

const SITE_URL = "https://brain-studio-kappa.vercel.app";

/**
 * Canonical URL for a given locale + optional sub-path. Always emits the
 * locale segment (routing is `localePrefix: "always"`).
 */
export function pageUrl(locale: string, slug?: string): string {
  const trimmed = slug?.replace(/^\/+/, "").replace(/\/+$/, "");
  return trimmed ? `${SITE_URL}/${locale}/${trimmed}` : `${SITE_URL}/${locale}`;
}

/**
 * Per-locale alternates map for `metadata.alternates.languages`. Google
 * uses this together with the hreflang Link header next-intl already
 * sets at the edge.
 */
export function languageAlternates(slug?: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const loc of locales) {
    out[loc] = pageUrl(loc, slug);
  }
  out["x-default"] = pageUrl(defaultLocale, slug);
  return out;
}

/**
 * Compose a per-room Metadata object. Pass the locale, the route slug
 * (e.g. "mirror"), and the localized title/description. Returns a fully
 * wired Metadata with:
 *   - openGraph.url set to the actual page URL (not the bare domain)
 *   - canonical link via alternates.canonical
 *   - per-locale alternates so each locale's URL is announced
 *   - openGraph.images / twitter.images left undefined so the per-route
 *     opengraph-image.tsx file convention takes over (Next.js wires the
 *     URL automatically).
 */
export function roomMetadata(args: {
  locale: Locale | string;
  slug: string;
  title: string;
  description: string;
}): Metadata {
  const { locale, slug, title, description } = args;
  const url = pageUrl(locale, slug);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(slug),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "The Brain Studio",
      type: "website",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Compose generateMetadata for a room page using i18n strings. Reads
 * the title + description from `home.rooms.<slug>` in the active locale's
 * messages bundle (all six locales already have these keys).
 *
 * `fallback` is used when a page doesn't map cleanly to `home.rooms.*`
 * (e.g. `about`); the page passes literal en strings and the function
 * still emits canonical + alternates from the locale param.
 */
export async function generateRoomMetadata(args: {
  locale: string;
  slug: string;
  fallback?: { title: string; description: string };
}): Promise<Metadata> {
  const { locale, slug, fallback } = args;
  let title = fallback?.title ?? slug;
  let description = fallback?.description ?? "";
  if (!fallback) {
    // Dynamic import keeps this server-only path lazy.
    const { getTranslations } = await import("next-intl/server");
    try {
      const t = await getTranslations({ locale, namespace: `home.rooms.${slug}` });
      title = t("title");
      description = t("description");
    } catch {
      // Leave fallback values intact if the namespace doesn't exist.
    }
  }
  return roomMetadata({ locale, slug, title, description });
}

/** Site palette used by the procedurally generated OG cards. */
export const OG_PALETTE = {
  navyDeep: "#0a1428",
  navyMid: "#0d162e",
  navyEnd: "#11192e",
  boneCream: "#f0e8d8",
  boneCreamMuted: "rgba(240, 232, 216, 0.6)",
  brass: "#c9a961",
  brassMuted: "rgba(201, 169, 97, 0.18)",
} as const;
