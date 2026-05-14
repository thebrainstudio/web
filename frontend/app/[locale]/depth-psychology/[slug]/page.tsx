import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import {
  Body,
  Caption,
  Display,
  Heading,
} from "@/components/typography/Typography";
import ReadingTime from "@/components/typography/ReadingTime";
import {
  depthPsychologyPages,
  depthPsychologyPageBySlugAndLocale,
} from "@/content/depth-psychology";
import { BRIDGE_SECTIONS } from "@/lib/bridges";
import { regionById } from "@/lib/regions";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/locales";

/**
 * Long-form depth-psychology page. Renders the entry's prose as
 * paragraphs (with "## " prefix marking section headings), plus a
 * sidebar of cross-references to the Bridges page sections and
 * Atlas regions the entry engages.
 *
 * Prose paragraphs that contain markdown-style links of the form
 * `[label](href)` are parsed at render time into Next-Link
 * elements pointing into the rest of the site. This keeps the
 * authoring experience close to plain text while delivering proper
 * internal navigation.
 */

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const page of depthPsychologyPages) {
      params.push({ locale, slug: page.slug });
    }
  }
  return params;
}

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

type Segment =
  | { kind: "text"; value: string }
  | { kind: "link"; label: string; href: string };

function parseInlineLinks(line: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  for (const match of line.matchAll(LINK_PATTERN)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      segments.push({ kind: "text", value: line.slice(lastIndex, start) });
    }
    segments.push({ kind: "link", label: match[1], href: match[2] });
    lastIndex = start + match[0].length;
  }
  if (lastIndex < line.length) {
    segments.push({ kind: "text", value: line.slice(lastIndex) });
  }
  return segments;
}

export default async function DepthPsychologyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const entry = depthPsychologyPageBySlugAndLocale(slug, locale);
  if (!entry) notFound();
  const t = await getTranslations({ locale, namespace: "depthPsychology" });
  const tRegions = await getTranslations({ locale, namespace: "regions" });

  return (
    <>
      {/* Breadcrumb */}
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
                <Link href="/depth-psychology" className="hover:text-brass">
                  <Caption uppercase className="tracking-[0.18em]">
                    Depth Psychology
                  </Caption>
                </Link>
              </li>
              <li aria-hidden className="text-bone-cream/30">·</li>
              <li>
                <Caption uppercase className="text-bone-cream/80 tracking-[0.18em]">
                  {entry.title}
                </Caption>
              </li>
            </ol>
          </nav>
          <Display italic className="mt-12">
            {entry.title}
          </Display>
          <Body italic className="text-bone-cream/70 mt-6 max-w-[40rem]">
            {entry.subtitle}
          </Body>
          <div className="text-bone-cream/65 mt-8 block">
            {/* PR 5: shared ReadingTime meta variant. */}
            <ReadingTime
              kind="meta"
              wordCount={entry.wordCount}
              minutes={entry.readMinutes}
              publishedAt={entry.publishedAt}
            />
          </div>
        </div>
      </section>

      {/* Body + sidebar */}
      <section className="relative px-6 pb-32 pt-12 md:px-10 md:pb-40 md:pt-16">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-16 md:grid-cols-12 md:gap-12">
          {/* Prose column */}
          <article className="md:col-span-8">
            {entry.paragraphs.map((p, i) => {
              if (p.startsWith("## ")) {
                return (
                  <Heading
                    key={i}
                    as="h3"
                    className="mt-12 font-[200] text-brass max-w-[36rem]"
                  >
                    {p.slice(3)}
                  </Heading>
                );
              }
              const segments = parseInlineLinks(p);
              return (
                <Body
                  key={i}
                  className="text-bone-cream/85 mt-6 max-w-[36rem] leading-[1.75]"
                >
                  {segments.map((seg, j) => {
                    if (seg.kind === "text") return <span key={j}>{seg.value}</span>;
                    return (
                      <Link
                        key={j}
                        href={seg.href as never}
                        prefetch
                        data-hover
                        className="text-brass hover:text-amber-soft underline decoration-brass/30 decoration-1 underline-offset-2 transition-colors duration-150"
                      >
                        {seg.label}
                      </Link>
                    );
                  })}
                </Body>
              );
            })}
          </article>

          {/* Sidebar */}
          <aside className="md:col-span-4">
            <div className="md:sticky md:top-32 md:space-y-10">
              {entry.bridgeSections.length > 0 && (
                <div>
                  <Caption uppercase className="text-brass tracking-[0.18em]">
                    {t("sidebar.bridges")}
                  </Caption>
                  <ul className="mt-3 space-y-3">
                    {entry.bridgeSections.map((id) => {
                      const sect = BRIDGE_SECTIONS.find((s) => s.id === id);
                      if (!sect) return null;
                      return (
                        <li key={id}>
                          <Link
                            href={`/bridges#${id}` as never}
                            prefetch
                            data-hover
                            className="text-bone-cream/80 hover:text-brass block transition-colors duration-150"
                          >
                            <Caption className="block">{sect.heading}</Caption>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {entry.atlasRegions.length > 0 && (
                <div>
                  <Caption uppercase className="text-brass tracking-[0.18em]">
                    {t("sidebar.atlas")}
                  </Caption>
                  <ul className="mt-3 space-y-1.5">
                    {entry.atlasRegions.map((id) => {
                      const region = regionById[id];
                      if (!region) return null;
                      return (
                        <li key={id}>
                          <Link
                            href={`/atlas/${id}` as never}
                            prefetch
                            data-hover
                            className="text-bone-cream/75 hover:text-brass inline-flex items-center gap-2 transition-colors duration-150"
                          >
                            <Caption>
                              {tRegions(`${id}.displayName`)}
                            </Caption>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="border-bone-cream/10 border-t pt-6">
                <Link
                  href="/depth-psychology"
                  className="text-bone-cream/70 hover:text-brass border-bone-cream/15 hover:border-brass inline-flex items-center gap-2 border-b transition-colors duration-200"
                >
                  <Caption className="italic">{t("backToIndex")}</Caption>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="relative border-t border-bone-cream/10 px-6 py-12 text-center md:px-10">
        <Caption uppercase className="text-bone-cream/65">
          {t("footerNote")}
        </Caption>
      </footer>
    </>
  );
}
