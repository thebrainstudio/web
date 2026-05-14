import type { MetadataRoute } from "next";

/**
 * Robots policy for crawlers. Allows everything; points at the sitemap.
 *
 * audit-fix: Task 9. The previous policy disallowed three /test-*
 * sandbox routes that no longer exist (the test pages were deleted
 * in this same change). Listing them was reconnaissance bait.
 */

const BASE = "https://brain-studio-kappa.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
