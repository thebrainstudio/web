import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import Prose from "@/components/atlas/Prose";
import BridgeStrengthBadge from "@/components/bridges/BridgeStrengthBadge";
import BrainActivationDriver from "@/components/brain/BrainActivationDriver";
import ConnectomePanel from "@/components/brain/ConnectomePanel";
import ProvenanceBadge from "@/components/brain/ProvenanceBadge";
import ProvenanceFooter from "@/components/brain/ProvenanceFooter";
import { loadAtlasActivationServer } from "@/lib/loadActivationsServer";
import {
  Body,
  Caption,
  Display,
  Heading,
  Mono,
} from "@/components/typography/Typography";
import { regions, regionById, type RegionId } from "@/lib/regions";
import { atlasEntryForLocale, theThreadForLocale } from "@/content/atlas";
import {
  YEO_NETWORKS,
  allCitationsForEntry,
  citationsForSection,
  wordCount,
} from "@/lib/atlas";
import { REGION_BRIDGE_LINKS, BRIDGE_SECTIONS } from "@/lib/bridges";
import { citations } from "@/lib/citations";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/locales";

/**
 * Per-region Atlas page. Layout:
 *
 *   [breadcrumb]
 *   [hero: region name + Yeo network band]
 *   [content column] ............... [sidebar]
 *     1. Anatomy & landmarks         atlas indices
 *     2. Function                    adjacent regions
 *     3. Cell types                  related tours
 *     4. Connections                 connectivity tracts
 *     5. Clinical context            sources
 *     6. History of discovery
 *     7. The thread (from regions.ts)
 *
 * Citations: inline `[cite:id]` markers in prose are rendered as
 * brass superscripts that open a small popover. The "Sources" panel
 * in the sidebar lists the full set, numbered to match the
 * superscripts.
 */

export function generateStaticParams() {
  const out: { locale: string; regionId: RegionId }[] = [];
  for (const locale of locales) {
    for (const r of regions) {
      out.push({ locale, regionId: r.id });
    }
  }
  return out;
}

export default async function AtlasRegionPage({
  params,
}: {
  params: Promise<{ locale: string; regionId: string }>;
}) {
  const { locale, regionId } = await params;
  setRequestLocale(locale);

  const region = regionById[regionId as RegionId];
  if (!region) notFound();
  const entry = atlasEntryForLocale(region.id, locale);
  const localizedThread = theThreadForLocale(region.id, locale);

  // PR-A: load this region's precomputed Neurosynth-derived parcel
  // activation (HCP-MMP-360). When present, the persistent brain
  // visualization renders the real meta-analytic pattern; when
  // absent (file missing, region without a Neurosynth term match),
  // the brain falls back to the 20-region path.
  const activationFile = loadAtlasActivationServer(region.id);

  const t = await getTranslations({ locale, namespace: "atlas" });
  const tRegions = await getTranslations({ locale, namespace: "regions" });

  const network = YEO_NETWORKS[entry.yeoNetwork];
  const allCitations = allCitationsForEntry(entry);

  const sections = [
    {
      id: "anatomy",
      title: t("sections.anatomy"),
      content: entry.anatomyAndLandmarks,
    },
    {
      id: "function",
      title: t("sections.function"),
      content: entry.functionSection,
    },
    {
      id: "cells",
      title: t("sections.cells"),
      content: entry.cellTypesSection,
    },
    {
      id: "connections",
      title: t("sections.connections"),
      content: entry.connectionsSection,
    },
    {
      id: "clinical",
      title: t("sections.clinical"),
      content: entry.clinicalContext,
    },
    {
      id: "discovery",
      title: t("sections.discovery"),
      content: entry.historyOfDiscovery,
    },
  ];

  const totalWords = sections.reduce(
    (sum, s) => sum + wordCount(s.content),
    0,
  );

  return (
    <>
      {/* PR-A: real-fMRI driver. When a precomputed activation file
          exists for this region the persistent brain renders the
          Neurosynth meta-analytic pattern (HCP-MMP-360 parcels);
          otherwise the brain falls back to the 20-region idle path. */}
      {activationFile && (
        <BrainActivationDriver
          parcelActivations={activationFile.parcel_activations}
        />
      )}

      {/* Breadcrumb */}
      <section className="relative px-6 pt-36 md:px-10 md:pt-44">
        <div className="mx-auto max-w-[1180px]">
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
                <Link href="/atlas" className="hover:text-brass">
                  <Caption uppercase className="tracking-[0.18em]">
                    {t("breadcrumb.atlas")}
                  </Caption>
                </Link>
              </li>
              <li aria-hidden className="text-bone-cream/30">·</li>
              <li>
                <Caption uppercase className="text-bone-cream/80 tracking-[0.18em]">
                  {tRegions(`${region.id}.displayName`)}
                </Caption>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Hero */}
      <section className="relative px-6 pt-12 md:px-10 md:pt-16">
        <AtmosphericGlow preset="amber-lamp" position="top" intensity="subtle" />
        <div className="mx-auto max-w-[1180px]">
          <div className="flex items-baseline gap-4">
            <span
              aria-hidden
              className="inline-block h-3 w-3 translate-y-[-2px] rounded-full"
              style={{ backgroundColor: network.accent }}
            />
            <span style={{ color: network.accent }}>
              <Caption uppercase className="tracking-[0.22em]">
                {network.displayName}
              </Caption>
            </span>
          </div>
          <Display italic className="mt-6">
            {tRegions(`${region.id}.displayName`)}
          </Display>
          <Caption uppercase className="text-brass mt-4 block">
            {tRegions(`${region.id}.anatomyName`)}
          </Caption>
          {/* Integrity-pass: persistent visual badge naming the
              data source that drives the brain on this page. Sits
              above the poetic gloss so it's adjacent to the
              brain stage on first paint. */}
          {activationFile && (
            <div className="mt-5">
              <ProvenanceBadge state="neurosynth" />
            </div>
          )}
          <Body italic className="text-bone-cream/65 mt-8 max-w-[40rem]">
            {tRegions(`${region.id}.poeticGloss`)}
          </Body>
          {entry.status === "in-progress" && (
            <div className="border-brass/30 mt-12 max-w-[40rem] rounded-sm border px-5 py-4">
              <Caption uppercase className="text-brass tracking-[0.18em]">
                {t("inProgressBanner.label")}
              </Caption>
              <Body italic className="text-bone-cream/70 mt-2">
                {t("inProgressBanner.body")}
              </Body>
            </div>
          )}
          {/* PR-A: provenance/methodology footer for the persistent
              brain visualization. Renders only when a precomputed
              Neurosynth activation is loaded for this region. */}
          {activationFile && <ProvenanceFooter file={activationFile} />}
        </div>
      </section>

      {/* Content + sidebar */}
      <section className="relative px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-16 md:grid-cols-12 md:gap-12">
          {/* Main column */}
          <div className="md:col-span-8">
            {sections.map((section) => {
              const order = citationsForSection(section.content);
              if (section.content.paragraphs.length === 0) {
                return (
                  <article
                    key={section.id}
                    id={section.id}
                    className="border-bone-cream/10 mb-16 border-b pb-12"
                  >
                    <Heading as="h2" className="font-[200]">
                      {section.title}
                    </Heading>
                    <Body italic className="text-bone-cream/45 mt-6">
                      {t("emptySection")}
                    </Body>
                  </article>
                );
              }
              return (
                <article
                  key={section.id}
                  id={section.id}
                  className="border-bone-cream/10 mb-16 border-b pb-12 last:border-b-0"
                >
                  <Heading as="h2" className="font-[200]">
                    {section.title}
                  </Heading>
                  {section.content.paragraphs.map((p, i) => (
                    <Prose key={i} paragraph={p} citationOrder={order} />
                  ))}
                </article>
              );
            })}

            {/* The Thread — pulled from regions.ts with per-locale overlay */}
            {localizedThread && (
              <article id="thread" className="mt-8">
                <Heading as="h2" className="font-[200]">
                  {t("sections.thread")}
                </Heading>
                <Body italic className="text-bone-cream/75 mt-6 max-w-[34rem] leading-[1.7]">
                  {localizedThread}
                </Body>
                {(() => {
                  const link = REGION_BRIDGE_LINKS[region.id];
                  if (!link) return null;
                  const section = BRIDGE_SECTIONS.find((s) => s.id === link.section);
                  if (!section) return null;
                  return (
                    <Link
                      href={`/bridges#${link.section}` as never}
                      prefetch
                      data-hover
                      className="border-brass/30 hover:border-brass/60 mt-10 block max-w-[36rem] rounded-sm border px-5 py-4 transition-colors duration-200"
                    >
                      <div className="flex items-baseline gap-3">
                        <BridgeStrengthBadge strength={link.strength} />
                        <Caption
                          uppercase
                          className="text-brass tracking-[0.18em]"
                        >
                          {t("bridgeCard.label")}
                        </Caption>
                      </div>
                      <Body className="text-bone-cream/80 mt-3">
                        {section.heading}
                      </Body>
                      <Caption className="text-bone-cream/70 mt-2 inline-flex items-center gap-2">
                        {t("bridgeCard.open")}
                        <span aria-hidden>→</span>
                      </Caption>
                    </Link>
                  );
                })()}
              </article>
            )}
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-4">
            <div className="md:sticky md:top-32 md:space-y-10">
              {/* Network */}
              <div>
                <Caption uppercase className="text-brass tracking-[0.18em]">
                  {t("sidebar.network")}
                </Caption>
                <div className="mt-2" style={{ color: network.accent }}>
                  <Body>{network.displayName}</Body>
                </div>
                <Caption className="text-bone-cream/50 mt-1 block max-w-[18rem]">
                  {network.shortDescription}
                </Caption>
              </div>

              {/* Connectome — interactive tract overlay */}
              <ConnectomePanel regionId={region.id} />

              {/* Adjacent regions */}
              {entry.adjacentRegions.length > 0 && (
                <div>
                  <Caption uppercase className="text-brass tracking-[0.18em]">
                    {t("sidebar.adjacent")}
                  </Caption>
                  <ul className="mt-3 space-y-1.5">
                    {entry.adjacentRegions.map((id) => (
                      <li key={id}>
                        <Link
                          href={`/atlas/${id}`}
                          prefetch
                          className="text-bone-cream/75 hover:text-brass inline-flex items-center gap-2 transition-colors duration-150"
                          data-hover
                        >
                          <Caption>{tRegions(`${id}.displayName`)}</Caption>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disorders */}
              {entry.disorders.length > 0 && (
                <div>
                  <Caption uppercase className="text-brass tracking-[0.18em]">
                    {t("sidebar.disorders")}
                  </Caption>
                  <ul className="mt-3 space-y-3">
                    {entry.disorders.map((d) => (
                      <li key={d.id}>
                        <Body className="text-bone-cream/80">{d.name}</Body>
                        <Caption className="text-bone-cream/70 mt-0.5 block max-w-[18rem]">
                          {d.oneLine}
                        </Caption>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cell types */}
              {entry.cellTypes.length > 0 && (
                <div>
                  <Caption uppercase className="text-brass tracking-[0.18em]">
                    {t("sidebar.cells")}
                  </Caption>
                  <ul className="mt-3 space-y-1.5">
                    {entry.cellTypes.map((c) => (
                      <li key={c.name}>
                        <Caption className="text-bone-cream/75">{c.name}</Caption>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/cellular"
                    prefetch
                    className="text-brass hover:text-amber-soft mt-4 inline-flex items-center gap-2 transition-colors duration-150"
                    data-hover
                  >
                    <Caption uppercase className="tracking-[0.18em]">
                      {t("sidebar.descend")}
                    </Caption>
                    <span aria-hidden>↓</span>
                  </Link>
                </div>
              )}

              {/* Sources */}
              {allCitations.length > 0 && (
                <div>
                  <Caption uppercase className="text-brass tracking-[0.18em]">
                    {t("sidebar.sources")}
                  </Caption>
                  <ol className="mt-3 space-y-3">
                    {allCitations.map((id, i) => {
                      const c = citations[id];
                      if (!c) return null;
                      return (
                        <li key={id} className="flex gap-2">
                          <Mono variant="label" className="text-brass mt-0.5 shrink-0">
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
                                <Caption className="block italic">
                                  {c.title}
                                </Caption>
                                <Caption className="mt-0.5 block">
                                  {c.journal}
                                </Caption>
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
              )}

              {/* Meta */}
              <div className="border-bone-cream/10 border-t pt-6">
                <Caption className="text-bone-cream/65 block">
                  {t("sidebar.lastReviewed", { date: entry.lastUpdated })}
                </Caption>
                {entry.status === "complete" && (
                  <Caption className="text-bone-cream/65 mt-1 block">
                    {t("sidebar.wordCount", { count: totalWords })}
                  </Caption>
                )}
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
