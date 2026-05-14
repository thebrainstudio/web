"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { use } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Mandala from "@/components/decoration/Mandala";
import {
  Body,
  Caption,
  Display,
  Hand,
  Heading,
} from "@/components/typography/Typography";
import ReadingTime from "@/components/typography/ReadingTime";
import { essayHippocampus } from "@/content/field-notes/hippocampus";
import { essayWhatBrainKnows } from "@/content/field-notes/what-the-brain-knows";

/**
 * Slug → essay-metadata map. Metadata (slug, wordCount, readMinutes,
 * publishedAt, citations) is invariant across locales and stays in the
 * TS file. The locale-aware bits — title, summary, paragraph bodies —
 * are pulled from the `essays.<key>` translation namespace at render time.
 */
const ESSAY_META = {
  [essayHippocampus.slug]: {
    key: "hippocampus" as const,
    wordCount: essayHippocampus.wordCount,
    readMinutes: essayHippocampus.readMinutes,
    publishedAt: essayHippocampus.publishedAt,
    /**
     * The Bridges-page section this essay sits adjacent to.
     * "memory-reconstruction" is the cleanest convergence section,
     * which is what the hippocampus essay is about.
     */
    bridgeSection: "memory-reconstruction" as const,
  },
  [essayWhatBrainKnows.slug]: {
    key: "whatBrainKnows" as const,
    wordCount: essayWhatBrainKnows.wordCount,
    readMinutes: essayWhatBrainKnows.readMinutes,
    publishedAt: essayWhatBrainKnows.publishedAt,
    bridgeSection: "implicit-cognition-unconscious" as const,
  },
};

export default function FieldNoteReader({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const meta = ESSAY_META[slug as keyof typeof ESSAY_META];
  const t = useTranslations("essays");
  const tField = useTranslations("fieldNotes");

  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (!meta) return;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max <= 0 ? 0 : window.scrollY / max;
      setReadingProgress(Math.min(1, Math.max(0, p)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [meta]);

  if (!meta) {
    notFound();
  }

  const paragraphs = t.raw(`${meta.key}.paragraphs`) as string[];

  return (
    <main className="relative min-h-screen px-6 pt-36 pb-32 md:px-10 md:pt-44">
      {/* Reading-progress bar */}
      <div
        aria-hidden
        className="bg-brass fixed inset-x-0 top-0 z-[60] h-px origin-left"
        style={{
          transform: `scaleX(${readingProgress})`,
          transition: "transform 60ms linear",
        }}
      />

      <Mandala
        src="/mandalas/hildegard_codex.jpg"
        alt="12th-century Hildegard codex"
        opacity={0.04}
        rotationSeconds={360}
        position="top-[60%] right-[-14rem]"
        size="w-[48rem]"
      />

      <article className="mx-auto max-w-[42rem]">
        <Caption uppercase className="text-brass">
          {t("fieldNote")}
        </Caption>
        <Display italic className="mt-8">
          {t(`${meta.key}.title`)}
        </Display>
        <Body italic className="text-bone-cream/60 mt-6">
          {t(`${meta.key}.summary`)}
        </Body>
        <div className="text-bone-cream/65 mt-8 block">
          {/* PR 5: shared ReadingTime component. */}
          <ReadingTime
            kind="meta"
            wordCount={meta.wordCount}
            minutes={meta.readMinutes}
            publishedAt={meta.publishedAt}
          />
        </div>

        <div className="mt-14 space-y-6">
          {paragraphs.map((p, i) => (
            <Body
              key={i}
              className={i === 0 ? "text-bone-cream/85" : "text-bone-cream/80"}
            >
              {p}
            </Body>
          ))}
        </div>

        <p className="mt-16 text-center">
          <Hand className="text-cyan-glow">{t("endOfNote")}</Hand>
        </p>

        {meta.bridgeSection && (
          <div className="border-brass/30 mx-auto mt-12 max-w-[34rem] rounded-sm border px-6 py-5 text-left">
            <Caption uppercase className="text-brass tracking-[0.18em]">
              {t("relatedBridgeLabel")}
            </Caption>
            <Link
              href={`/bridges#${meta.bridgeSection}` as never}
              prefetch
              className="hover:text-brass mt-2 inline-flex items-center gap-2 text-bone-cream/80 transition-colors duration-200"
              data-hover
            >
              <Body italic>{t("relatedBridgeOpen")}</Body>
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}

        <div className="mt-12 space-y-4 text-center">
          <div>
            <Link
              href="/field-notes"
              className="text-bone-cream/70 hover:text-brass border-bone-cream/15 hover:border-brass border-b transition-colors"
            >
              <Body italic>{t("moreFieldNotes")}</Body>
            </Link>
          </div>
          <div>
            <Link
              href="/threshold"
              className="text-bone-cream/70 hover:text-brass border-bone-cream/15 hover:border-brass border-b transition-colors"
            >
              <Body italic>{t("returnThreshold")}</Body>
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
