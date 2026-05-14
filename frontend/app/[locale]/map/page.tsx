import type { Metadata } from "next";
import Mandala from "@/components/decoration/Mandala";
import SiteMapColumns from "@/components/map/SiteMapColumns";
import {
  Body,
  Caption,
  Display,
} from "@/components/typography/Typography";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { generateRoomMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateRoomMetadata({ locale, slug: "map" });
}

/**
 * /map — a single-page index for the whole site.
 *
 * Three columns: Rooms / Regions / Long form. Hover a card and the
 * cross-references in the other two columns light up. The page is
 * deliberately not a node-link diagram — BridgesNetwork already
 * carries that aesthetic. Map serves the reader who wants to see
 * what's actually here in a single view they can read in order.
 *
 * No persistent brain on this page — the map's job is structural,
 * not anatomical. The Fludd microcosm sits as a decorative mandala
 * because the page is precisely about how parts relate to whole.
 */
export default async function SiteMapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "map" });

  return (
    <main className="relative min-h-screen px-6 pt-36 pb-32 md:px-10 md:pt-44">
      <Mandala
        src="/mandalas/fludd_microcosm.jpg"
        alt="Robert Fludd, De integra microcosmi harmonia"
        opacity={0.04}
        rotationSeconds={420}
        position="top-[40%] left-1/2 -translate-x-1/2"
        size="w-[60rem]"
      />
      <div className="mx-auto max-w-[1200px]">
        <Caption uppercase className="text-brass">
          {t("label")}
        </Caption>
        <Display italic className="mt-10">
          {t("title")}
        </Display>
        <Body className="text-bone-cream/65 mt-10 max-w-[40rem]">
          {t("intro")}
        </Body>

        <div className="mt-20">
          <SiteMapColumns />
        </div>

        <div className="border-bone-cream/10 mt-32 border-t pt-10">
          <Caption className="text-bone-cream/45 max-w-[36rem] block leading-relaxed">
            {t("footerNote")}
          </Caption>
        </div>
      </div>
    </main>
  );
}
