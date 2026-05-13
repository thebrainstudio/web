import { Link } from "@/i18n/navigation";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import {
  Body,
  Caption,
  Display,
  Heading,
  Mono,
} from "@/components/typography/Typography";
import { regions, regionById, type RegionId } from "@/lib/regions";
import { atlasEntries } from "@/content/atlas";
import { YEO_NETWORKS, type YeoNetwork } from "@/lib/atlas";
import { getTranslations, setRequestLocale } from "next-intl/server";

/**
 * Atlas index. Lists all 20 regions, grouped by Yeo network. Each
 * card shows the display name, anatomy, network membership, a brief
 * function summary, and a status pill ("in progress" or empty for
 * complete). Clicking opens the region's full Atlas page.
 *
 * Atmosphere: the page itself gets a subtle amber-lamp glow from the
 * persistent atmosphere layer (the "atlas" room atmosphere). The
 * grouping is the visual signature — each network's color band runs
 * down the left edge of its group.
 */
export default async function AtlasIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "atlas" });
  const tRegions = await getTranslations({ locale, namespace: "regions" });

  // Group regions by Yeo network, preserving the network ordering.
  const networkOrder: YeoNetwork[] = [
    "FrontoparietalControl",
    "Auditory",
    "DefaultMode",
    "Limbic",
    "VentralAttention",
    "DorsalAttention",
    "Somatomotor",
    "Visual",
  ];
  const byNetwork = new Map<YeoNetwork, RegionId[]>();
  for (const r of regions) {
    const network = atlasEntries[r.id].yeoNetwork;
    if (!byNetwork.has(network)) byNetwork.set(network, []);
    byNetwork.get(network)!.push(r.id);
  }

  const completeCount = regions.filter(
    (r) => atlasEntries[r.id].status === "complete",
  ).length;

  return (
    <>
      <section className="relative px-6 pt-36 md:px-10 md:pt-44">
        <AtmosphericGlow preset="amber-lamp" position="top" intensity="subtle" />
        <div className="mx-auto max-w-[1180px]">
          <Caption uppercase className="text-brass">
            {t("label")}
          </Caption>
          <Display italic className="mt-8">
            {t("title")}
          </Display>
          <Body className="text-bone-cream/65 mt-8 max-w-[36rem]">
            {t("intro")}
          </Body>
          <Caption className="text-bone-cream/45 mt-6 block max-w-[36rem]" italic>
            {t("statusNote", { complete: completeCount, total: regions.length })}
          </Caption>
        </div>
      </section>

      <section className="relative px-6 pb-32 pt-20 md:px-10 md:pb-40 md:pt-24">
        <div className="mx-auto max-w-[1180px] space-y-20">
          {networkOrder.map((network) => {
            const regionIds = byNetwork.get(network);
            if (!regionIds || regionIds.length === 0) return null;
            const info = YEO_NETWORKS[network];
            return (
              <div key={network}>
                <div className="flex items-baseline gap-4">
                  <span
                    aria-hidden
                    className="inline-block h-3 w-3 translate-y-[-2px] rounded-full"
                    style={{ backgroundColor: info.accent }}
                  />
                  <span style={{ color: info.accent }}>
                    <Heading as="h2" className="font-[200]">
                      {info.displayName}
                    </Heading>
                  </span>
                </div>
                <Caption className="text-bone-cream/55 mt-2 block max-w-[28rem]">
                  {info.shortDescription}
                </Caption>
                <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                  {regionIds.map((id) => {
                    const region = regionById[id];
                    const entry = atlasEntries[id];
                    return (
                      <Link
                        key={id}
                        href={`/atlas/${id}`}
                        prefetch
                        className="group block"
                        data-hover
                      >
                        <Mono variant="label" className="text-bone-cream/40 block">
                          {tRegions(`${id}.anatomyName`)}
                        </Mono>
                        <div className="mt-2 flex items-baseline gap-3">
                          <Heading
                            as="h3"
                            className="font-[200] group-hover:text-brass transition-colors duration-200"
                          >
                            {tRegions(`${id}.displayName`)}
                          </Heading>
                          {entry.status === "in-progress" && (
                            <Caption
                              uppercase
                              className="text-bone-cream/40 tracking-[0.18em]"
                            >
                              {t("inProgress")}
                            </Caption>
                          )}
                        </div>
                        <Body className="text-bone-cream/60 mt-3 max-w-[22rem]">
                          {tRegions(`${id}.scienceGloss`)}
                        </Body>
                        <Caption
                          uppercase
                          className="text-brass mt-4 inline-flex items-center gap-2"
                        >
                          {entry.status === "complete"
                            ? t("openCard")
                            : t("previewCard")}
                          <span
                            aria-hidden
                            className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2"
                          >
                            →
                          </span>
                        </Caption>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
