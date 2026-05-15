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
import PassageActivationScroller from "@/components/brain/PassageActivationScroller";
import ProvenanceBadge from "@/components/brain/ProvenanceBadge";
import ProvenanceFooter from "@/components/brain/ProvenanceFooter";
import { loadPassageActivationServer } from "@/lib/loadActivationsServer";
import type { ParcelActivationFile } from "@/lib/loadActivations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generateRoomMetadata({ locale, slug: "dante" });
}

/**
 * The Dante room — companion to Faust. Same five-movement
 * structure, same triangulation discipline, different work. Dante's
 * Commedia is built for the default-mode network the way Faust's
 * monologue is built for the prediction-error circuitry: each work
 * found a form that matches a piece of brain architecture, four
 * to seven centuries before that architecture had a name.
 */
export default async function DantePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "dante" });
  const tCommon = await getTranslations({ locale, namespace: "literary" });

  const minutesLabel = tCommon("readingMinutes");
  const totalMinutes = 22;
  const movement = tCommon("movement");

  // PR-C: Dante passage activations.
  const danteActivations: Record<string, ParcelActivationFile | null> = {
    dante_nel_mezzo: loadPassageActivationServer("dante_nel_mezzo"),
    dante_paolo_francesca: loadPassageActivationServer("dante_paolo_francesca"),
    dante_beatrice: loadPassageActivationServer("dante_beatrice"),
  };
  const heroProvenance = danteActivations.dante_nel_mezzo;

  return (
    <main className="relative px-6 pt-36 pb-24 md:px-10 md:pt-44">
      <PassageActivationScroller
        activationFiles={danteActivations}
        defaultId="dante_nel_mezzo"
      />
      <div className="mx-auto max-w-[68rem]">
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
          {/* PR-C: provenance for the hero brain (Inferno I.1 / nel
              mezzo). The scroller swaps activations across passages
              as the reader moves through Movement IV. */}
          {heroProvenance && (
            <div className="mt-10 max-w-[42rem]">
              <ProvenanceBadge state="neurosynth" />
              <ProvenanceFooter file={heroProvenance} />
            </div>
          )}
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

          {/* Passage 1 — Inferno I.1–3 (nel mezzo del cammin). PR-C:
              data-activation-id binds this section to its real
              Neurosynth-derived parcel activation. */}
          <div data-activation-id="dante_nel_mezzo">
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
              pcc: 0.7,
              precuneus: 0.65,
              dmpfc: 0.58,
              vmpfc: 0.5,
              mtg_left: 0.45,
            }}
            translationActivations={{
              ifg_left: 0.5,
              mtg_left: 0.48,
              pcc: 0.4,
              precuneus: 0.35,
            }}
            predictionDisclaimer={t("m4.predictionDisclaimer")}
            originalPredictionLabel={t("m4.originalPredictionLabel")}
            translationPredictionLabel={t("m4.translationPredictionLabel")}
          />
          </div>

          {/* Passage 2 — Paolo and Francesca (Inferno V) */}
          <div data-activation-id="dante_paolo_francesca">
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
              amyg_left: 0.78,
              amyg_right: 0.7,
              hipp_left: 0.65,
              hipp_right: 0.6,
              vmpfc: 0.55,
              pcc: 0.5,
            }}
            translationActivations={{
              amyg_left: 0.55,
              hipp_left: 0.5,
              vmpfc: 0.42,
              mtg_left: 0.38,
            }}
            predictionDisclaimer={t("m4.predictionDisclaimer")}
            originalPredictionLabel={t("m4.originalPredictionLabel")}
            translationPredictionLabel={t("m4.translationPredictionLabel")}
          />
          </div>

          {/* Passage 3 — Paradiso XXXIII.142–145 (Beatrice arc) */}
          <div data-activation-id="dante_beatrice">
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
              vmpfc: 0.55,
              pcc: 0.5,
              precuneus: 0.48,
              atl_right: 0.42,
              atl_left: 0.38,
            }}
            translationActivations={{
              ifg_left: 0.4,
              mtg_left: 0.35,
              vmpfc: 0.32,
            }}
            predictionDisclaimer={t("m4.predictionDisclaimer")}
            originalPredictionLabel={t("m4.originalPredictionLabel")}
            translationPredictionLabel={t("m4.translationPredictionLabel")}
          />
          </div>
        </section>

        <TriangulationNote
          label={tCommon("triangulation")}
          body={t("triangulation")}
        />

        <section className="mx-auto max-w-[40rem]">
          <MovementHeader
            number="V"
            label={movement}
            title={t("m5.title")}
            readingMinutes={2}
          />
          <figure className="not-prose">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm">
              <Image
                src="/plates/blake_dante.webp"
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

        <section className="mx-auto mt-32 max-w-[40rem] text-center">
          <Caption uppercase className="text-bone-cream/45 tracking-[0.18em]">
            {tCommon("companionLabel")}
          </Caption>
          <div className="mt-6">
            <Link
              href="/faust"
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
