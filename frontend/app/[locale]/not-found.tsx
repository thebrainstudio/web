import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  Body,
  Caption,
  Display,
} from "@/components/typography/Typography";

/**
 * Locale-aware 404. audit-fix: Task 5. All strings come from the
 * notFound + home.rooms namespaces in the active locale's messages
 * bundle, so the SSR copy stays in sync with the actual six rooms.
 *
 * The previous app/not-found.tsx hardcoded "three rooms" and linked
 * only to Mirror / Music / Cross-Cultural; it has been replaced with
 * a minimal non-localized fallback (rarely reached because proxy.ts
 * redirects every URL to a locale prefix first).
 */
export default async function LocaleNotFound() {
  // next-intl resolves the locale from the request context.
  const t = await getTranslations("notFound");
  const tRooms = await getTranslations("home.rooms");

  // All six rooms + Home. Labels come from already-translated keys so
  // we don't have to add new i18n entries for this fix.
  const links: Array<{ href: string; label: string }> = [
    { href: "/mirror", label: tRooms("mirror.title") },
    { href: "/music", label: tRooms("music.title") },
    { href: "/crosscultural", label: tRooms("crosscultural.title") },
    { href: "/threshold", label: tRooms("threshold.title") },
    { href: "/archetypes", label: tRooms("archetypes.title") },
    { href: "/cellular", label: tRooms("cellular.title") },
    { href: "/", label: t("linkHome") },
  ];

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 pt-32">
      <div className="mx-auto max-w-[40rem] text-center">
        <Caption uppercase className="text-brass">
          {t("label")}
        </Caption>
        <Display italic className="mt-10">
          {t("title")}
        </Display>
        <Body className="text-bone-cream/80 mt-8">{t("body")}</Body>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href as never}
              prefetch
              data-hover
              className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-5 py-2.5 transition-colors duration-300"
            >
              <Caption uppercase>{label}</Caption>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
