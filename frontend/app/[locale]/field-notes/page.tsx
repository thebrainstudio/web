import { Link } from "@/i18n/navigation";
import Mandala from "@/components/decoration/Mandala";
import {
  Body,
  Caption,
  Display,
  Heading,
  Mono,
} from "@/components/typography/Typography";
import ReadingTime from "@/components/typography/ReadingTime";
import { essayHippocampus } from "@/content/field-notes/hippocampus";
import { essayWhatBrainKnows } from "@/content/field-notes/what-the-brain-knows";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function FieldNotesIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "fieldNotes" });
  const tEssays = await getTranslations({ locale, namespace: "essays" });

  const essays = [
    {
      slug: essayHippocampus.slug,
      title: tEssays("hippocampus.title"),
      summary: tEssays("hippocampus.summary"),
      wordCount: essayHippocampus.wordCount,
      readMinutes: essayHippocampus.readMinutes,
      publishedAt: essayHippocampus.publishedAt,
      shipped: true,
    },
    {
      slug: essayWhatBrainKnows.slug,
      title: tEssays("whatBrainKnows.title"),
      summary: tEssays("whatBrainKnows.summary"),
      wordCount: essayWhatBrainKnows.wordCount,
      readMinutes: essayWhatBrainKnows.readMinutes,
      publishedAt: essayWhatBrainKnows.publishedAt,
      shipped: true,
    },
    {
      slug: "sound-and-the-salience-network",
      title: t("essay3.title"),
      summary: t("essay3.summary"),
      wordCount: 1400,
      readMinutes: 8,
      publishedAt: t("forthcoming"),
      shipped: false,
    },
  ];

  return (
    <main className="relative min-h-screen px-6 pt-36 pb-32 md:px-10 md:pt-44">
      <Mandala
        src="/mandalas/fludd_microcosm.jpg"
        alt="Robert Fludd, De integra microcosmi harmonia"
        opacity={0.04}
        rotationSeconds={360}
        position="top-[40%] left-1/2 -translate-x-1/2"
        size="w-[60rem]"
      />
      <div className="mx-auto max-w-[44rem]">
        <Caption uppercase className="text-brass">
          {t("label")}
        </Caption>
        <Display italic className="mt-10">
          {t("display")}
        </Display>
        <Body className="text-bone-cream/65 mt-10 max-w-[36rem]">
          {t("intro")}
        </Body>

        <ol className="mt-20 space-y-14">
          {essays.map((e, i) => (
            <li key={e.slug}>
              <div className="text-bone-cream/65">
                <Mono variant="label">0{i + 1}</Mono>
              </div>
              {e.shipped ? (
                <Link
                  href={`/field-notes/${e.slug}`}
                  className="group block"
                  data-hover
                >
                  <Heading
                    as="h2"
                    className="mt-4 group-hover:text-brass transition-colors duration-300"
                  >
                    {e.title}
                  </Heading>
                </Link>
              ) : (
                <Heading as="h2" className="mt-4 text-bone-cream/70">
                  {e.title}
                </Heading>
              )}
              <Body italic className="text-bone-cream/65 mt-3 max-w-[36rem]">
                {e.summary}
              </Body>
              <div className="mt-4 text-bone-cream/45">
                {/* PR 5: shared <ReadingTime kind="meta" /> render.
                    Reads `reading.words` / `reading.minutesShort`
                    from the shared namespace instead of the local
                    `fieldNotes` keys, so the chip is consistent
                    everywhere it appears on the site. */}
                <ReadingTime
                  kind="meta"
                  wordCount={e.wordCount}
                  minutes={e.readMinutes}
                  publishedAt={e.publishedAt}
                />
              </div>
              {/* PR 1 / 4b: the duplicate <Mono>{t("forthcoming")}</Mono>
                  that used to sit here is removed. `e.publishedAt`
                  already renders `t("forthcoming")` for unshipped
                  essays — having both rendered the tag twice on the
                  same card. The inline placement in the meta line is
                  the more legible spot. */}
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
