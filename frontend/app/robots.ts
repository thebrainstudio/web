import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/urls";

/**
 * Robots policy for crawlers. Allows everything; points at the sitemap.
 *
 * audit-fix: Task 9. The previous policy disallowed three /test-*
 * sandbox routes that no longer exist (the test pages were deleted
 * in this same change). Listing them was reconnaissance bait.
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
