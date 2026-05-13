import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./locales";

/**
 * Routing configuration shared between the proxy and the navigation
 * helpers. `localePrefix: "as-needed"` keeps English URLs clean
 * (`/mirror`) while every other locale is prefixed (`/th/mirror`).
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});

/**
 * Drop-in replacements for next/link, next/navigation that know about
 * locales. Use these instead of the next/* equivalents in client
 * code so language-aware routing stays consistent.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
