import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/i18n/locales";
import { regions } from "@/lib/regions";
import { tours } from "@/content/tours";
import { SITE_URL as BASE } from "@/lib/urls";

/**
 * Programmatic sitemap. Emits one entry per page concept with a
 * `languages` alternates block listing every locale that serves that
 * page. The `url` on each entry is the default-locale URL, which
 * Google and other crawlers treat as the canonical for that page.
 *
 * Locale routing is `localePrefix: "always"` (see i18n/navigation.ts),
 * so every locale — including English — gets a prefix segment.
 *
 * Coverage: 13 static routes + 20 atlas regions + 3 depth-psychology
 * essays + 2 field-notes + 4 tours = 42 page concepts × 6 locales.
 */

/** Static (non-dynamic) routes inside `app/[locale]/`. */
const STATIC_PATHS = [
  "", // /<locale> homepage
  "about",
  "archetypes",
  "atlas",
  "bridges",
  "cellular",
  "crosscultural",
  "depth-psychology",
  "field-notes",
  "mirror",
  "music",
  "threshold",
  "tours",
] as const;

/** Dynamic page slugs for depth-psychology, sourced statically. */
const DEPTH_PSYCH_SLUGS = ["aion", "red-book", "gestalt"] as const;

/** Dynamic page slugs for field-notes, sourced statically. */
const FIELD_NOTE_SLUGS = ["hippocampus", "what-the-brain-knows"] as const;

function localizedUrl(locale: string, path: string): string {
  const trimmed = path.replace(/^\/+/, "");
  const suffix = trimmed ? `/${trimmed}` : "";
  return `${BASE}/${locale}${suffix}`;
}

function languagesFor(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const loc of locales) {
    out[loc] = localizedUrl(loc, path);
  }
  out["x-default"] = localizedUrl(defaultLocale, path);
  return out;
}

function entryFor(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: localizedUrl(defaultLocale, path),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: languagesFor(path),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    const isHome = path === "";
    entries.push(entryFor(path, "monthly", isHome ? 1.0 : 0.8));
  }

  for (const r of regions) {
    entries.push(entryFor(`atlas/${r.id}`, "monthly", 0.7));
  }

  for (const slug of DEPTH_PSYCH_SLUGS) {
    entries.push(entryFor(`depth-psychology/${slug}`, "yearly", 0.6));
  }

  for (const slug of FIELD_NOTE_SLUGS) {
    entries.push(entryFor(`field-notes/${slug}`, "yearly", 0.6));
  }

  for (const t of tours) {
    entries.push(entryFor(`tours/${t.id}`, "monthly", 0.6));
  }

  return entries;
}
