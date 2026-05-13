import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { locales, defaultLocale } from "./locales";

/**
 * Server-side locale negotiation for next-intl. Called by the
 * next-intl plugin (configured in next.config.ts) at the start of
 * every server render.
 *
 * The hasLocale narrowing returns the default locale (en) if the
 * incoming locale isn't recognised — the proxy at the root prefixes
 * URLs, so an unknown locale shouldn't reach this code in practice,
 * but the fallback keeps the site from 500ing if it does.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(locales, requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
