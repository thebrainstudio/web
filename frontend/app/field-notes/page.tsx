import Link from "next/link";
import Mandala from "@/components/decoration/Mandala";
import {
  Body,
  Caption,
  Display,
  Heading,
  Mono,
} from "@/components/typography/Typography";
import { essayHippocampus } from "@/content/field-notes/hippocampus";
import { essayWhatBrainKnows } from "@/content/field-notes/what-the-brain-knows";

const essays = [
  {
    slug: essayHippocampus.slug,
    title: essayHippocampus.title,
    summary: essayHippocampus.summary,
    wordCount: essayHippocampus.wordCount,
    readMinutes: essayHippocampus.readMinutes,
    publishedAt: essayHippocampus.publishedAt,
    shipped: true,
  },
  {
    slug: essayWhatBrainKnows.slug,
    title: essayWhatBrainKnows.title,
    summary: essayWhatBrainKnows.summary,
    wordCount: essayWhatBrainKnows.wordCount,
    readMinutes: essayWhatBrainKnows.readMinutes,
    publishedAt: essayWhatBrainKnows.publishedAt,
    shipped: true,
  },
  {
    slug: "sound-and-the-salience-network",
    title: "Sound and the salience network",
    summary:
      "Why particular pieces of music seem to arrive with weight — auditory cortex, default-mode involvement, and what Jung called the numinous.",
    wordCount: 1400,
    readMinutes: 8,
    publishedAt: "Forthcoming",
    shipped: false,
  },
];

export default function FieldNotesIndex() {
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
          Field Notes
        </Caption>
        <Display italic className="mt-10">
          Essays from the seam between mind and brain.
        </Display>
        <Body className="text-bone-cream/65 mt-10 max-w-[36rem]">
          Longer pieces of writing, hedged carefully, intended to be read
          rather than skimmed. Each essay holds two languages — neuroscience
          and depth psychology — in parallel, without collapsing one into
          the other.
        </Body>

        <ol className="mt-20 space-y-14">
          {essays.map((e, i) => (
            <li key={e.slug}>
              <div className="text-bone-cream/40">
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
                <Heading as="h2" className="mt-4 text-bone-cream/55">
                  {e.title}
                </Heading>
              )}
              <Body italic className="text-bone-cream/65 mt-3 max-w-[36rem]">
                {e.summary}
              </Body>
              <div className="mt-4">
                <Mono variant="label" className="text-bone-cream/45">
                  {e.wordCount.toLocaleString()} words · {e.readMinutes} min read ·{" "}
                  {e.publishedAt}
                </Mono>
              </div>
              {!e.shipped && (
                <Mono variant="label" className="text-bone-cream/35 mt-2 block">
                  Forthcoming
                </Mono>
              )}
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
