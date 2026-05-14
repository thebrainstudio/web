import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import BridgeStrengthBadge from "@/components/bridges/BridgeStrengthBadge";
import BridgesNetwork from "@/components/bridges/BridgesNetwork";
import Prose from "@/components/atlas/Prose";
import {
  Body,
  Caption,
  Display,
  Heading,
  Mono,
} from "@/components/typography/Typography";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BRIDGE_SECTIONS, BRIDGE_STRENGTHS } from "@/lib/bridges";
import { bridgeSectionContentForLocale } from "@/content/bridges";
import { citationsForSection } from "@/lib/atlas";
import { citations } from "@/lib/citations";

/**
 * The Bridges page — the synthesizing index between the site's
 * neuroscience and depth-psychology layers. Eleven sections, each
 * rated for empirical bridge strength. The page is prose-dominant
 * and intentionally long; pull quotes break up the reading rhythm,
 * and the citation source list at the foot of the page anchors
 * every empirical claim.
 *
 * Routing: lives at /[locale]/bridges. The brief envisioned
 * `/depth-psychology/bridges`, but the depth-psychology landing
 * page does not yet exist in the codebase; placing the Bridges
 * page at a top-level route lets it ship now without depending on
 * a future section landing.
 */
export default async function BridgesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "bridges" });
  const localizedContent = bridgeSectionContentForLocale(locale);

  // Aggregate every citation used in the page, across all sections,
  // preserving order. This drives the page-foot bibliography and the
  // superscript numbering used by <Prose>.
  const sectionEntries = BRIDGE_SECTIONS.map((meta) => {
    const content = localizedContent[meta.id];
    // Pull every text-block paragraph for citation extraction.
    const paragraphs: string[] = [];
    for (const block of content.blocks) {
      if (block.kind === "text") paragraphs.push(...block.paragraphs);
    }
    return {
      meta,
      content,
      citationOrder: citationsForSection({ paragraphs }),
    };
  });

  const allCitations: string[] = [];
  const seen = new Set<string>();
  for (const entry of sectionEntries) {
    for (const id of entry.citationOrder) {
      if (!seen.has(id)) {
        seen.add(id);
        allCitations.push(id);
      }
    }
  }

  return (
    <>
      {/* Breadcrumb */}
      <section className="relative px-6 pt-36 md:px-10 md:pt-44">
        <div className="mx-auto max-w-[1100px]">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-bone-cream/50">
              <li>
                <Link href="/" className="hover:text-brass">
                  <Caption uppercase className="tracking-[0.18em]">
                    {t("breadcrumb.studio")}
                  </Caption>
                </Link>
              </li>
              <li aria-hidden className="text-bone-cream/30">·</li>
              <li>
                <Caption uppercase className="text-bone-cream/80 tracking-[0.18em]">
                  {t("breadcrumb.bridges")}
                </Caption>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Hero */}
      <section className="relative px-6 pt-10 md:px-10 md:pt-14">
        <AtmosphericGlow preset="amber-lamp" position="top" intensity="subtle" />
        <div className="mx-auto max-w-[1100px]">
          <Caption uppercase className="text-brass tracking-[0.22em]">
            {t("label")}
          </Caption>
          <Display italic className="mt-8 text-bone-cream">
            {t("title")}
          </Display>
          <Body className="text-bone-cream/65 mt-8 max-w-[40rem]">
            {t("subtitle")}
          </Body>

          {/* Strength legend */}
          <div className="mt-14 max-w-[44rem] rounded-sm border border-bone-cream/10 p-6">
            <Caption uppercase className="text-brass tracking-[0.18em]">
              {t("legendLabel")}
            </Caption>
            <div className="mt-5 space-y-3">
              {(["tight", "partial", "distant", "none"] as const).map((s) => (
                <div key={s} className="flex items-start gap-4">
                  <BridgeStrengthBadge strength={s} />
                  <Caption className="text-bone-cream/65 mt-0.5">
                    {BRIDGE_STRENGTHS[s].description}
                  </Caption>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Network — the single graphic summarizing every bridge */}
      <section className="relative px-6 py-16 md:px-10 md:py-20">
        <BridgesNetwork variant="full" />
      </section>

      {/* Sections */}
      <section className="relative px-6 pb-32 pt-16 md:px-10 md:pb-40 md:pt-24">
        <div className="mx-auto max-w-[1100px] space-y-24">
          {sectionEntries.map(({ meta, content, citationOrder }, sectionIdx) => (
            <article
              key={meta.id}
              id={meta.id}
              className="border-bone-cream/10 border-t pt-12 first:border-t-0 first:pt-0"
            >
              <div className="flex flex-wrap items-baseline gap-4">
                <Mono variant="label" className="text-bone-cream/65">
                  {String(sectionIdx + 1).padStart(2, "0")}
                </Mono>
                <BridgeStrengthBadge strength={meta.strength} />
                {meta.subtitle && (
                  <Caption className="text-bone-cream/70 italic">
                    {meta.subtitle}
                  </Caption>
                )}
              </div>
              <Heading as="h2" className="mt-6 font-[200] max-w-[40rem]">
                {meta.heading}
              </Heading>
              <div className="mt-8 space-y-2">
                {content.blocks.map((block, i) => {
                  if (block.kind === "rule") {
                    return (
                      <hr
                        key={i}
                        className="border-brass/30 my-10 w-[40%]"
                      />
                    );
                  }
                  if (block.kind === "heading") {
                    return (
                      <Heading
                        key={i}
                        as="h3"
                        className="text-brass mt-10 font-[200]"
                      >
                        {block.text}
                      </Heading>
                    );
                  }
                  if (block.kind === "block-quote") {
                    return (
                      <blockquote
                        key={i}
                        className="border-brass/40 my-10 max-w-[36rem] border-l-2 pl-6"
                      >
                        <Body italic className="text-bone-cream/80">
                          “{block.quote}”
                        </Body>
                        <Caption className="text-bone-cream/50 mt-3 block">
                          — {block.attribution}
                        </Caption>
                      </blockquote>
                    );
                  }
                  // text block
                  return (
                    <div key={i}>
                      {block.paragraphs.map((p, j) => (
                        <Prose
                          key={j}
                          paragraph={p}
                          citationOrder={citationOrder}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Full bibliography */}
      {allCitations.length > 0 && (
        <section className="relative border-t border-bone-cream/10 px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1100px]">
            <Caption uppercase className="text-brass tracking-[0.22em]">
              {t("bibliographyLabel")}
            </Caption>
            <Heading className="mt-6 font-[200]">
              {t("bibliographyHeading")}
            </Heading>
            <Body italic className="text-bone-cream/70 mt-4 max-w-[36rem]">
              {t("bibliographyIntro")}
            </Body>
            <ol className="mt-10 space-y-5">
              {allCitations.map((id, i) => {
                const c = citations[id];
                if (!c) return null;
                return (
                  <li key={id} className="flex gap-3">
                    <Mono variant="label" className="text-brass mt-0.5 shrink-0 w-8">
                      [{i + 1}]
                    </Mono>
                    <div>
                      <Caption className="text-bone-cream/80 block">
                        {c.authors} <span className="text-bone-cream/70">({c.year})</span>
                      </Caption>
                      {c.doi ? (
                        <a
                          href={`https://doi.org/${c.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-bone-cream/70 hover:text-brass transition-colors duration-150"
                          data-hover
                        >
                          <Caption className="block italic">{c.title}</Caption>
                          <Caption className="mt-0.5 block">{c.journal}</Caption>
                        </a>
                      ) : (
                        <>
                          <Caption className="text-bone-cream/70 block italic">
                            {c.title}
                          </Caption>
                          <Caption className="text-bone-cream/70 mt-0.5 block">
                            {c.journal}
                          </Caption>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      )}

      <footer className="relative border-t border-bone-cream/10 px-6 py-12 text-center md:px-10">
        <Caption uppercase className="text-bone-cream/65">
          {t("footerNote")}
        </Caption>
      </footer>
    </>
  );
}
