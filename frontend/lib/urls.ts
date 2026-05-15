/**
 * Centralized URL constants.
 *
 * Two strings — the site's canonical origin and the GitHub source-of-
 * truth URL — used to be hardcoded across six different files
 * (`metadataBase`, `lib/seo.ts`, `robots.ts`, `sitemap.ts`, the OG
 * image route, `scripts/lighthouse.sh`) plus the SiteHeader/Footer
 * GitHub icons. When the project moves to its own domain and a
 * project-org GitHub repo, the change should be a single env-var
 * flip, not a sprawling find/replace.
 *
 * Both values fall back to the current vercel.app + dreamsmanifested
 * URLs so today's behaviour is identical. To override on Vercel set:
 *
 *   NEXT_PUBLIC_SITE_URL=https://brainstudio.io
 *   NEXT_PUBLIC_GITHUB_URL=https://github.com/brainstudio-jipp/brain-studio
 *
 * Both vars are exposed via `NEXT_PUBLIC_*` so client components
 * (SiteHeader / SiteFooter) can read them at build time.
 */

const DEFAULT_SITE_URL = "https://brain-studio-kappa.vercel.app";
const DEFAULT_GITHUB_URL =
  "https://github.com/dreamsmanifested6666-dotcom/brain-studio";

/** Canonical origin without trailing slash. */
export const SITE_URL: string =
  (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");

/** Project source-of-truth GitHub repository URL. */
export const GITHUB_URL: string =
  process.env.NEXT_PUBLIC_GITHUB_URL || DEFAULT_GITHUB_URL;

/**
 * Build a canonical absolute URL for a path. Leading slash optional;
 * trailing slash stripped from the path. Useful for OG `url`,
 * sitemap entries, hreflang alternates, and the `canonical`
 * <link> tag.
 */
export function canonicalUrl(path: string = "/"): string {
  const trimmed = path.replace(/^\/+/, "").replace(/\/+$/, "");
  return trimmed ? `${SITE_URL}/${trimmed}` : SITE_URL;
}

/** URL helpers consumed by GitHub-icon link components. */
export const githubLinks = {
  repo: GITHUB_URL,
  issues: `${GITHUB_URL}/issues`,
} as const;
