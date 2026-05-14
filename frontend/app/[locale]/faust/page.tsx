import { getTranslations, setRequestLocale } from "next-intl/server";
import { generateRoomMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
  Body,
  Caption,
  Display,
  Heading,
  Mono,
} from "@/components/typography/Typography";
import MovementHeader from "@/components/literary/MovementHeader";
import PassageAnalysis from "@/components/literary/PassageAnalysis";
import TriangulationNote from "@/components/literary/TriangulationNote";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generateRoomMetadata({ locale, slug: "faust" });
}

/**
 * The Faust room — literature as a third language alongside
 * neuroscience and depth psychology. Five movements:
 *   I.  The frame — what Faust is, as a question about mind.
 *   II. The brain — what mechanism reveals about Faustian striving.
 *  III. The psyche — Jung's reading and what came after.
 *   IV. The language — three German passages with English alongside.
 *   V.  The image — Delacroix's 1828 lithograph.
 *
 * Voice and discipline: the same as Threshold and the Archetypes
 * essays. Neuroscience and depth psychology do not zoom into each
 * other; literature does something neither can do alone; the work
 * remains larger than the triangulation. The room states the
 * discipline explicitly between Movements IV and V.
 */
export default async function FaustPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "faust" });
  const tCommon = await getTranslations({ locale, namespace: "literary" });

  const minutesLabel = tCommon("readingMinutes");
  const totalMinutes = 22;
  const movement = tCommon("movement");

  return (
    <main className="relative px-6 pt-36 pb-24 md:px-10 md:pt-44">
      <div className="mx-auto max-w-[68rem]">
        {/* Breadcrumb */}
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
              <Caption
                uppercase
                className="text-bone-cream/80 tracking-[0.18em]"
              >
                {t("breadcrumb")}
              </Caption>
            </li>
          </ol>
        </nav>

        {/* Title block */}
        <header className="mt-12">
          <Caption uppercase className="text-brass tracking-[0.28em]">
            {t("label")}
          </Caption>
          <Display
            italic
            as="h1"
            className="mt-8 max-w-[42rem] !text-[3.4rem] !leading-[1.05] md:!text-[4.5rem]"
          >
            {t("title")}
          </Display>
          <Heading
            as="h2"
            className="text-bone-cream/75 mt-8 max-w-[40rem] font-[200]"
          >
            {t("subtitle")}
          </Heading>
          <div className="text-bone-cream/40 mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <Mono variant="label" className="tracking-[0.18em]">
              {totalMinutes} {minutesLabel}
            </Mono>
            <span aria-hidden className="bg-bone-cream/20 h-px w-12" />
            <Caption uppercase className="tracking-[0.18em]">
              {t("structure")}
            </Caption>
          </div>
        </header>

        {/* Movement I — The Frame */}
        <section className="mx-auto mt-24 max-w-[40rem] md:mt-32">
          <MovementHeader
            number="I"
            label={movement}
            title={t("m1.title")}
            readingMinutes={3}
          />
          <div className="space-y-6">
            <Body>{t("m1.p1")}</Body>
            <Body>{t("m1.p2")}</Body>
            <Body italic className="text-bone-cream/85 mt-8 text-[1.1rem] leading-[1.7]">
              {t("m1.claim")}
            </Body>
          </div>
        </section>

        {/* Movement II — The Brain */}
        <section className="mx-auto mt-24 max-w-[40rem] md:mt-32">
          <MovementHeader
            number="II"
            label={movement}
            title={t("m2.title")}
            readingMinutes={5}
          />
          <div className="space-y-6">
            <Body>{t("m2.p1")}</Body>
            <Body>{t("m2.p2")}</Body>
            <Body>{t("m2.p3")}</Body>
            <Body>{t("m2.p4")}</Body>
            <Body italic className="text-bone-cream/75 mt-6 text-[0.98rem] leading-[1.6]">
              {t("m2.disclaimer")}
            </Body>
          </div>
        </section>

        {/* Movement III — The Psyche */}
        <section className="mx-auto mt-24 max-w-[40rem] md:mt-32">
          <MovementHeader
            number="III"
            label={movement}
            title={t("m3.title")}
            readingMinutes={5}
          />
          <div className="space-y-6">
            <Body>{t("m3.p1")}</Body>
            <Body>{t("m3.p2")}</Body>
            <Body>{t("m3.p3")}</Body>
            <Body>{t("m3.p4")}</Body>
            <Body italic className="text-bone-cream/85 mt-8 text-[1.05rem] leading-[1.7]">
              {t("m3.refusal")}
            </Body>
          </div>
        </section>

        {/* Movement IV — The Language */}
        <section className="mx-auto mt-24 max-w-[56rem] md:mt-32">
          <MovementHeader
            number="IV"
            label={movement}
            title={t("m4.title")}
            readingMinutes={7}
          />
          <div className="mx-auto max-w-[40rem]">
            <Body>{t("m4.intro")}</Body>
          </div>

          {/* Passage 1 — The wager */}
          <PassageAnalysis
            index={tCommon("passage") + " I"}
            citation={t("m4.passage1.citation")}
            originalLabel={t("m4.originalLabel")}
            original={
              <div className="whitespace-pre-line font-editorial">
                {t("m4.passage1.original")}
              </div>
            }
            translationLabel={t("m4.translationLabel")}
            translation={
              <div className="whitespace-pre-line">
                {t("m4.passage1.translation")}
              </div>
            }
            translationAttribution={t("m4.passage1.translationAttribution")}
            analysisParagraphs={[
              t("m4.passage1.analysis1"),
              t("m4.passage1.analysis2"),
            ]}
            originalActivations={{
              vmpfc: 0.78,
              dmpfc: 0.62,
              pcc: 0.55,
              amyg_left: 0.48,
              hipp_right: 0.4,
            }}
            translationActivations={{
              ifg_left: 0.52,
              mtg_left: 0.5,
              agl_left: 0.42,
              vmpfc: 0.38,
            }}
            predictionDisclaimer={t("m4.predictionDisclaimer")}
            originalPredictionLabel={t("m4.originalPredictionLabel")}
            translationPredictionLabel={t("m4.translationPredictionLabel")}
          />

          {/* Passage 2 — The translation scene */}
          <PassageAnalysis
            index={tCommon("passage") + " II"}
            citation={t("m4.passage2.citation")}
            originalLabel={t("m4.originalLabel")}
            original={
              <div className="whitespace-pre-line font-editorial">
                {t("m4.passage2.original")}
              </div>
            }
            translationLabel={t("m4.translationLabel")}
            translation={
              <div className="whitespace-pre-line">
                {t("m4.passage2.translation")}
              </div>
            }
            translationAttribution={t("m4.passage2.translationAttribution")}
            analysisParagraphs={[
              t("m4.passage2.analysis1"),
              t("m4.passage2.analysis2"),
            ]}
            originalActivations={{
              ifg_left: 0.72,
              mtg_left: 0.65,
              atl_left: 0.58,
              agl_left: 0.5,
              dmpfc: 0.42,
            }}
            translationActivations={{
              ifg_left: 0.58,
              mtg_left: 0.55,
              atl_left: 0.45,
              agl_left: 0.42,
            }}
            predictionDisclaimer={t("m4.predictionDisclaimer")}
            originalPredictionLabel={t("m4.originalPredictionLabel")}
            translationPredictionLabel={t("m4.translationPredictionLabel")}
          />

          {/* Passage 3 — The mystic chorus */}
          <PassageAnalysis
            index={tCommon("passage") + " III"}
            citation={t("m4.passage3.citation")}
            originalLabel={t("m4.originalLabel")}
            original={
              <div className="whitespace-pre-line font-editorial">
                {t("m4.passage3.original")}
              </div>
            }
            translationLabel={t("m4.translationLabel")}
            translation={
              <div className="whitespace-pre-line">
                {t("m4.passage3.translation")}
              </div>
            }
            translationAttribution={t("m4.passage3.translationAttribution")}
            analysisParagraphs={[
              t("m4.passage3.analysis1"),
              t("m4.passage3.analysis2"),
            ]}
            originalActivations={{
              atl_left: 0.72,
              atl_right: 0.65,
              pcc: 0.6,
              precuneus: 0.56,
              vmpfc: 0.48,
              mtg_right: 0.42,
            }}
            translationActivations={{
              atl_left: 0.45,
              atl_right: 0.38,
              pcc: 0.35,
              mtg_left: 0.32,
            }}
            predictionDisclaimer={t("m4.predictionDisclaimer")}
            originalPredictionLabel={t("m4.originalPredictionLabel")}
            translationPredictionLabel={t("m4.translationPredictionLabel")}
          />
        </section>

        {/* Triangulation note — the room's philosophical heart */}
        <TriangulationNote
          label={tCommon("triangulation")}
          body={t("triangulation")}
        />

        {/* Movement V — The Image */}
        <section className="mx-auto max-w-[40rem]">
          <MovementHeader
            number="V"
            label={movement}
            title={t("m5.title")}
            readingMinutes={2}
          />
          <figure className="not-prose">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
              <Image
                src="/plates/delacroix_faust.webp"
                alt={t("m5.imageAlt")}
                fill
                sizes="(max-width: 768px) 100vw, 40rem"
                className="object-cover"
              />
            </div>
            <figcaption className="text-bone-cream/55 mt-4 text-[0.78rem]">
              <Mono variant="label" className="tracking-[0.14em]">
                {t("m5.imageCredit")}
              </Mono>
            </figcaption>
          </figure>
          <div className="mt-12 space-y-6">
            <Body>{t("m5.p1")}</Body>
            <Body>{t("m5.p2")}</Body>
            <Body italic className="text-bone-cream/85 text-[1.05rem] leading-[1.7]">
              {t("m5.p3")}
            </Body>
          </div>
        </section>

        {/* Sibling room link */}
        <section className="mx-auto mt-32 max-w-[40rem] text-center">
          <Caption uppercase className="text-bone-cream/45 tracking-[0.18em]">
            {tCommon("companionLabel")}
          </Caption>
          <div className="mt-6">
            <Link
              href="/dante"
              className="text-bone-cream/80 hover:text-brass border-bone-cream/20 hover:border-brass border-b inline-block transition-colors"
            >
              <Body italic>{t("companion")}</Body>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
