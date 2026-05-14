import ScrollScene from "@/components/motion/ScrollScene";
import ParallaxLayer from "@/components/motion/ParallaxLayer";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import Mandala from "@/components/decoration/Mandala";
import {
  Body,
  Caption,
  Display,
  Hand,
  Heading,
  Mono,
} from "@/components/typography/Typography";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { generateRoomMetadata } from "@/lib/seo";

// audit-fix: Task 4. Per-page og:url + canonical + alternates.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateRoomMetadata({ locale, slug: "threshold" });
}

/**
 * The Threshold — a contemplative essay room between the macro and the
 * cellular. Three movements. Written in full. The persistent brain shrinks
 * to a corner mark while reading. A Fludd mandala rotates very slowly in
 * the bottom-right. All copy is locale-aware via the `threshold` namespace.
 */
export default async function ThresholdPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "threshold" });
  return (
    <>
      <Mandala
        src="/mandalas/fludd_microcosm.jpg"
        alt="Robert Fludd, De integra microcosmi harmonia, 1619, Wellcome Collection"
        opacity={0.05}
        rotationSeconds={240}
        position="top-[40%] right-[-12rem]"
        size="w-[44rem]"
      />

      {/* Opening */}
      <ScrollScene
        id="threshold-open"
        brain={{
          position: [1.2, 0.6, 0],
          scale: 0.28,
          rotation: [0, -0.3, 0],
          activations: {},
        }}
        lighting="cinematic"
        className="relative flex min-h-[90vh] items-center px-6 pt-36 md:px-10 md:pt-44"
      >
        <AtmosphericGlow preset="amber-lamp" position="top" intensity="subtle" />
        <div className="mx-auto max-w-[44rem]">
          <Caption uppercase className="text-brass">
            {t("label")}
          </Caption>
          <Display italic className="mt-10">
            {t("openingDisplay")}
          </Display>
          <Body className="text-bone-cream/65 mt-10 max-w-[34rem]">
            {t("openingBody")}
          </Body>
        </div>
      </ScrollScene>

      {/* Movement 1 */}
      <ScrollScene
        id="threshold-m1"
        brain={{
          position: [1.2, 0.5, 0],
          scale: 0.26,
          rotation: [0, -0.2, 0],
          activations: {},
        }}
        lighting="cinematic"
        className="relative px-6 py-24 md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[40rem]">
          <Heading className="text-brass font-[200]">{t("m1.heading")}</Heading>
          <Body className="mt-10">{t("m1.body1")}</Body>
          <Body className="text-bone-cream/85 mt-6">{t("m1.body2")}</Body>
          <Body className="text-bone-cream/85 mt-6">{t("m1.body3")}</Body>
          <ParallaxLayer speed={0.95}>
            <Body italic className="text-bone-cream/60 mt-10">{t("m1.italic")}</Body>
          </ParallaxLayer>
          <Mono variant="label" className="text-bone-cream/35 mt-12 block">
            {t("m1.meta")}
          </Mono>
        </div>
      </ScrollScene>

      <hr className="border-brass/30 mx-auto w-[40%]" />

      {/* Movement 2 */}
      <ScrollScene
        id="threshold-m2"
        brain={{
          position: [1.2, 0.5, 0],
          scale: 0.26,
          rotation: [0, -0.1, 0],
          activations: {},
        }}
        lighting="warm"
        className="relative px-6 py-24 md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[40rem]">
          <Heading className="text-brass font-[200]">{t("m2.heading")}</Heading>
          <Body className="mt-10">{t("m2.body1")}</Body>
          <Body className="text-bone-cream/85 mt-6">{t("m2.body2")}</Body>
          <Body className="text-bone-cream/85 mt-6">{t("m2.body3")}</Body>
          <Body className="text-bone-cream/85 mt-6">{t("m2.body4")}</Body>
          <Body italic className="text-bone-cream/80 mt-8">{t("m2.italic")}</Body>
          <Mono variant="label" className="text-bone-cream/35 mt-12 block">
            {t("m2.meta")}
          </Mono>
        </div>
      </ScrollScene>

      <hr className="border-brass/30 mx-auto w-[40%]" />

      {/* Movement 3 */}
      <ScrollScene
        id="threshold-m3"
        brain={{
          position: [1.2, 0.5, 0],
          scale: 0.3,
          rotation: [0, 0, 0],
          activations: {},
        }}
        lighting="cinematic"
        className="relative px-6 py-24 md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-[40rem]">
          <Heading className="text-brass font-[200]">{t("m3.heading")}</Heading>
          <Body className="mt-10">{t("m3.body1")}</Body>
          <Body className="text-bone-cream/85 mt-6">{t("m3.body2")}</Body>
          <Body className="text-bone-cream/85 mt-6">{t("m3.body3")}</Body>
          <Body italic className="text-bone-cream/85 mt-8 text-lg leading-[1.6]">
            {t("m3.italic")}
          </Body>
          <Mono variant="label" className="text-bone-cream/35 mt-12 block">
            {t("m3.meta")}
          </Mono>
        </div>
      </ScrollScene>

      {/* Closing */}
      <section className="relative px-6 py-24 text-center md:px-10 md:py-32">
        <div className="mx-auto max-w-[40rem]">
          <p className="mb-8">
            <Hand className="text-cyan-glow">{t("closing.hand")}</Hand>
          </p>
          <div className="space-y-4">
            <div>
              <Link
                href="/"
                className="text-bone-cream/70 hover:text-brass border-bone-cream/15 hover:border-brass border-b transition-colors"
              >
                <Body italic>{t("closing.linkHome")}</Body>
              </Link>
            </div>
            <div>
              <Link
                href="/field-notes"
                className="text-bone-cream/70 hover:text-brass border-bone-cream/15 hover:border-brass border-b transition-colors"
              >
                <Body italic>{t("closing.linkFieldNotes")}</Body>
              </Link>
            </div>
            <div>
              <Link
                href="/cellular"
                className="text-bone-cream/70 hover:text-brass border-bone-cream/15 hover:border-brass border-b transition-colors"
              >
                <Body italic>{t("closing.linkCellular")}</Body>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
