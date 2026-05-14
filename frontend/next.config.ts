import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * Content-Security-Policy in Report-Only mode.
 *
 * audit-fix: Task 2. Browsers log violations to the console but don't
 * block anything, giving a soak window to confirm the policy doesn't
 * break the WebGL brain stage, framer-motion, gsap, or next-intl's
 * client hooks before flipping to enforcing mode.
 *
 * Allowlist rationale:
 *   - `'unsafe-inline'` on script-src: Next.js prerender hydration uses
 *     inline payload scripts. Required until we adopt a nonce strategy.
 *   - `'unsafe-eval'` on script-src: gsap function2string + Three.js
 *     shader compilation rely on it.
 *   - `style-src 'unsafe-inline'`: Tailwind + framer-motion inline styles.
 *   - `img-src https:` is permissive because attributed-image content
 *     pulls from public-domain image hosts that we don't control.
 *   - `connect-src` includes Vercel Live preview comments and the
 *     vitals beacon endpoint (used by Vercel Analytics if/when added).
 *
 * TODO(audit): switch from Content-Security-Policy-Report-Only to
 * Content-Security-Policy once Phase 10 backend is wired and the
 * report-only soak window is clean. Long-term goal: replace
 * 'unsafe-inline' on script-src with a per-request nonce strategy
 * (Next.js supports this via headers in a middleware/proxy).
 */
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://vitals.vercel-insights.com https://vercel.live wss://ws-us3.pusher.com",
  "media-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Global response headers. Vercel already sets HSTS at the edge, so
 * we layer on the remaining defensive headers here.
 */
const securityHeaders = [
  // Browsers can't sniff the response into a different MIME type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Refuse to be embedded in iframes (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Trim referrer information sent to other origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Deny all powerful features we don't use; the few we might want
  // later (e.g. fullscreen) can be opted back in by name.
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "midi=()",
      "magnetometer=()",
      "accelerometer=()",
      "gyroscope=()",
      "interest-cohort=()",
    ].join(", "),
  },
  // audit-fix: Task 2. CSP-Report-Only for soak time. See policy above.
  { key: "Content-Security-Policy-Report-Only", value: CSP_REPORT_ONLY },
  // audit-fix: Task 3. Vercel's default Access-Control-Allow-Origin: *
  // on HTML responses is too permissive — HTML pages aren't meant to be
  // fetched cross-origin. Empty value tells Next.js / the edge to omit
  // the header entirely, falling back to standard same-origin policy.
  // If any future /api/* route legitimately needs CORS, scope it there.
  { key: "Access-Control-Allow-Origin", value: "" },
];

/**
 * Cache policy for prerendered HTML. audit-fix: Task 7.
 *
 *   max-age=0              — browser always revalidates (in background)
 *   s-maxage=3600          — Vercel edge serves cached for 1h before
 *                            revalidating to origin
 *   stale-while-revalidate — for up to a day, serve the cached copy
 *                            while a background fetch refreshes it
 *
 * Previously Cache-Control was `public, max-age=0, must-revalidate`,
 * forcing a revalidation roundtrip per visit. New policy keeps the CDN
 * serving instant responses while letting the browser refresh in the
 * background.
 *
 * Scoped to non-/api routes via the `source` pattern so any future API
 * handler keeps the framework default of no caching. Phase 10 dynamic
 * personalized routes should explicitly override this.
 */
const HTML_CACHE_CONTROL =
  "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Security headers apply everywhere except API.
        source: "/((?!api/).*)",
        headers: securityHeaders,
      },
      {
        // audit-fix: Task 7. Cache policy only for HTML page routes —
        // explicitly skip /api/* and Next's static asset hashed paths
        // (those already have immutable caching from Next's defaults).
        source: "/((?!api/|_next/).*)",
        headers: [{ key: "Cache-Control", value: HTML_CACHE_CONTROL }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
