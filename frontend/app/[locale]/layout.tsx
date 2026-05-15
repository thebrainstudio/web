import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/locales";
import LocaleLangSync from "@/components/i18n/LocaleLangSync";
import TranslationStatusBanner from "@/components/i18n/TranslationStatusBanner";
import SiteHeader from "@/components/nav/SiteHeader";
import SiteFooter from "@/components/nav/SiteFooter";
import RoomTemperature from "@/components/atmospheric/RoomTemperature";
import DeferredLocaleClient from "@/components/client/DeferredLocaleClient";
import ScrollWeight from "@/components/typography/ScrollWeight";
import MotionSpeedSync from "@/components/motion/MotionSpeedSync";
import { Caption } from "@/components/typography/Typography";

/**
 * Locale-aware nested layout. Sits *inside* the root layout so that
 * BrainStage and friends survive a language switch. Responsibilities:
 *
 *   - validate the URL locale (404 if unknown);
 *   - load the locale's messages bundle and provide it to client
 *     components via NextIntlClientProvider;
 *   - keep <html lang> in sync with the active locale (handled on the
 *     client by LocaleLangSync — the root layout's lang attribute is a
 *     fallback for the initial paint of `/`);
 *   - render SiteHeader + <main> here, so the header (which calls
 *     useTranslations) has access to the provider context.
 */

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) notFound();

  // Required for static rendering with next-intl.
  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleLangSync locale={locale} />
      {/* Skip link — keyboard users jump straight to <main>. */}
      <a
        href="#main"
        className="focus:bg-brass focus:text-navy-deep sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1100] focus:rounded-sm focus:px-4 focus:py-2"
      >
        <Caption uppercase>{t("skipToContent")}</Caption>
      </a>
      <SiteHeader />
      <TranslationStatusBanner />
      {/* Visual-elevation Fix 4: per-room colour temperature.
          RoomTemperature writes a CSS custom property on <html>
          based on the active route; the filter on <main> picks
          it up. Subtle — readers should not consciously notice;
          they should feel they've entered a different room. */}
      <RoomTemperature />
      {/* Visual-elevation Fix 8: writes --scroll-wght on <html>
          from a smoothed scroll-velocity tracker. Display and
          Heading components consume it via font-variation-settings.
          Reduced-motion users are pinned at wght 400. */}
      <ScrollWeight />
      {/* Reactivity-pass Fix 17 + 18: mirrors store.motionScale into
          a CSS var and the GSAP global timeline so Shift-held and
          Space-toggle propagate across every animation surface. */}
      <MotionSpeedSync />
      {/* Visual-elevation Fix 5 composes a second filter slot on
          top of Fix 4's per-room temperature: `--scene-saturate`,
          driven by transient PinnedCinematic moments (Threshold
          Movement Two animates this 1 → 0 → 1 across its pin). */}
      <main
        id="main"
        className="relative z-10"
        style={{
          filter:
            "var(--temperature-filter, none) saturate(var(--scene-saturate, 1))",
        }}
      >
        {children}
      </main>
      {/* PR 9 — shared SiteFooter. Sits at the layout level so every
          locale-scoped page picks it up automatically. */}
      <SiteFooter />
      {/* SearchPalette + any other locale-aware deferred clients live
          here so they sit under NextIntlClientProvider. */}
      <DeferredLocaleClient />
    </NextIntlClientProvider>
  );
}
