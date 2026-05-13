import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import {
  Body,
  Caption,
  Display,
  Heading,
  Mono,
} from "@/components/typography/Typography";
import { Link } from "@/i18n/navigation";
import { depthPsychologyPages } from "@/content/depth-psychology";
import { getTranslations, setRequestLocale } from "next-intl/server";

/**
 * Depth-psychology section landing.
 *
 * Aggregates the depth-psychology layer of the site:
 *  - Bridges (the synthesizing index — first card)
 *  - Threshold (existing contemplative essay)
 *  - Archetypes (existing essay + image gallery)
 *  - Field Notes (existing essay collection)
 *  - The new long-form pages: Aion, Red Book, Gestalt
 *
 * The Bridges card sits first with brass-border treatment so the
 * synthesizing role is the first thing a visitor reaches.
 */
export default async function DepthPsychologyLanding({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "depthPsychology" });

  // Existing pages alongside the new long-form entries.
  const existingPages = [
    {
      href: "/threshold",
      label: t("existing.threshold.label"),
      title: t("existing.threshold.title"),
      blurb: t("existing.threshold.blurb"),
    },
    {
      href: "/archetypes",
      label: t("existing.archetypes.label"),
      title: t("existing.archetypes.title"),
      blurb: t("existing.archetypes.blurb"),
    },
    {
      href: "/field-notes",
      label: t("existing.fieldNotes.label"),
      title: t("existing.fieldNotes.title"),
      blurb: t("existing.fieldNotes.blurb"),
    },
  ];

  return (
    <>
      {/* Breadcrumb + hero */}
      <section className="relative px-6 pt-36 md:px-10 md:pt-44">
        <AtmosphericGlow preset="amber-lamp" position="top" intensity="subtle" />
        <div className="mx-auto max-w-[1100px]">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-bone-cream/50">
              <li>
                <Link href="/" className="hover:text-brass">
                  <Caption uppercase className="tracking-[0.18em]">
                    The Brain Studio
                  </Caption>
                </Link>
              </li>
              <li aria-hidden className="text-bone-cream/30">·</li>
              <li>
                <Caption uppercase className="text-bone-cream/80 tracking-[0.18em]">
                  Depth Psychology
                </Caption>
              </li>
            </ol>
          </nav>
          <Caption uppercase className="text-brass mt-12 tracking-[0.22em]">
            {t("label")}
          </Caption>
          <Display italic className="mt-8">
            {t("title")}
          </Display>
          <Body className="text-bone-cream/65 mt-8 max-w-[40rem]">
            {t("intro")}
          </Body>
        </div>
      </section>

      {/* Bridges — featured first */}
      <section className="relative px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1100px]">
          <Link
            href="/bridges"
            prefetch
            className="border-brass/40 hover:border-brass group block rounded-sm border-2 p-6 transition-colors duration-200 md:p-8"
            data-hover
          >
            <Mono variant="label" className="text-brass block">
              {t("featured.label")}
            </Mono>
            <Heading
              as="h2"
              className="mt-3 font-[200] group-hover:text-brass transition-colors duration-200"
            >
              {t("featured.title")}
            </Heading>
            <Body italic className="text-bone-cream/75 mt-4 max-w-[40rem]">
              {t("featured.subtitle")}
            </Body>
            <Body className="text-bone-cream/60 mt-4 max-w-[44rem]">
              {t("featured.blurb")}
            </Body>
            <Caption
              uppercase
              className="text-brass mt-6 inline-flex items-center gap-2 tracking-[0.18em]"
            >
              {t("featured.open")}
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2"
              >
                →
              </span>
            </Caption>
          </Link>
        </div>
      </section>

      {/* New long-form pages */}
      <section className="relative px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1100px]">
          <Caption uppercase className="text-brass tracking-[0.22em]">
            {t("longForm.label")}
          </Caption>
          <Heading as="h2" className="mt-4 font-[200]">
            {t("longForm.heading")}
          </Heading>
          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            {depthPsychologyPages.map((page) => (
              <Link
                key={page.slug}
                href={`/depth-psychology/${page.slug}` as never}
                prefetch
                className="group block"
                data-hover
              >
                <Mono variant="label" className="text-bone-cream/40 block">
                  {page.readMinutes} {t("minRead")}
                </Mono>
                <Heading
                  as="h3"
                  className="mt-3 font-[200] group-hover:text-brass transition-colors duration-200"
                >
                  {page.title}
                </Heading>
                <Body italic className="text-bone-cream/70 mt-3 max-w-[28rem]">
                  {page.subtitle}
                </Body>
                <Caption
                  uppercase
                  className="text-brass mt-5 inline-flex items-center gap-2 tracking-[0.18em]"
                >
                  {t("openPage")}
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2"
                  >
                    →
                  </span>
                </Caption>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Existing pages */}
      <section className="relative px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1100px]">
          <Caption uppercase className="text-brass tracking-[0.22em]">
            {t("existing.label")}
          </Caption>
          <Heading as="h2" className="mt-4 font-[200]">
            {t("existing.heading")}
          </Heading>
          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {existingPages.map((page) => (
              <Link
                key={page.href}
                href={page.href as never}
                prefetch
                className="group block"
                data-hover
              >
                <Mono variant="label" className="text-bone-cream/40 block">
                  {page.label}
                </Mono>
                <Heading
                  as="h3"
                  className="mt-3 font-[200] group-hover:text-brass transition-colors duration-200"
                >
                  {page.title}
                </Heading>
                <Body className="text-bone-cream/60 mt-3 max-w-[22rem]">
                  {page.blurb}
                </Body>
                <Caption
                  uppercase
                  className="text-brass mt-5 inline-flex items-center gap-2 tracking-[0.18em]"
                >
                  {t("openPage")}
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2"
                  >
                    →
                  </span>
                </Caption>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative border-t border-bone-cream/10 px-6 py-12 text-center md:px-10">
        <Caption uppercase className="text-bone-cream/40">
          {t("footerNote")}
        </Caption>
      </footer>
    </>
  );
}
