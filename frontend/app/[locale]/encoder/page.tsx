import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { generateRoomMetadata } from "@/lib/seo";
import {
  Body,
  Caption,
  Display,
  Heading,
  Mono,
} from "@/components/typography/Typography";
import Mandala from "@/components/decoration/Mandala";
import EncoderLab from "@/components/encoder/EncoderLab";
import fs from "node:fs";
import path from "node:path";
import type { VideoActivationFile } from "@/components/brain/VideoTimelineDriver";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateRoomMetadata({
    locale,
    slug: "encoder",
    fallback: {
      title: "Encoder Lab · The Brain Studio",
      description:
        "Watch four short clips, see what published meta-analysis predicts an average brain does while watching them. A demo built in the spirit of Meta's TRIBE v2 page.",
    },
  });
}

/**
 * Encoder Lab — interactive video gallery that drives the
 * persistent brain visualization. Loosely modeled on Meta's
 * `aidemos.atmeta.com/tribev2` demo. Four short CC-licensed clips
 * span distinct cortical systems (face/speech, music, motion,
 * nature/scene); each clip's brain timeline is a Neurosynth-derived
 * composite projected onto the HCP-MMP-360 parcellation.
 *
 * Preview path: this page ships with Neurosynth-composite
 * activations. The Colab notebook at
 * `backend/scripts/build_tribe_video_activations.ipynb` (PR-H+1)
 * uses the site author's HuggingFace `facebook/tribev2` access to
 * regenerate the same JSONs with real TRIBE v2 predictions; the
 * file path is identical so the swap requires no code change.
 *
 * No persistent brain re-anchor here — the page renders the
 * existing macro brain and overrides its parcel activations while
 * a video plays.
 */
export default async function EncoderLabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "encoder" });

  // Load every video's activation JSON at SSR; the client component
  // gets them as a prop dictionary.
  const PUBLIC_ROOT = path.join(process.cwd(), "public", "activations", "videos");
  const videoIds = ["water_lily", "piano_grieg", "waterfall", "davos_speech"];
  const files: Record<string, VideoActivationFile | null> = {};
  for (const id of videoIds) {
    const fp = path.join(PUBLIC_ROOT, `${id}.json`);
    try {
      files[id] = JSON.parse(fs.readFileSync(fp, "utf-8")) as VideoActivationFile;
    } catch {
      files[id] = null;
    }
  }

  return (
    <main className="relative min-h-screen px-6 pt-36 pb-32 md:px-10 md:pt-44">
      <Mandala
        src="/mandalas/fludd_microcosm.jpg"
        alt="Robert Fludd, De integra microcosmi harmonia"
        opacity={0.04}
        rotationSeconds={480}
        position="top-[35%] right-[5%]"
        size="w-[40rem]"
      />
      <div className="mx-auto max-w-[1200px]">
        <Caption uppercase className="text-brass">
          {t("label")}
        </Caption>
        <Display italic className="mt-10">
          {t("title")}
        </Display>
        <Body className="text-bone-cream/80 mt-10 max-w-[42rem]">
          {t("intro")}
        </Body>
        <Body italic className="text-bone-cream/75 mt-6 max-w-[42rem]">
          {t("modeledOn")}
        </Body>

        <div className="mt-20">
          <EncoderLab files={files} />
        </div>

        <div className="border-bone-cream/10 mt-32 border-t pt-10 max-w-[42rem]">
          <Caption
            uppercase
            className="text-brass mb-4 block tracking-[0.18em]"
          >
            {t("disclaimerLabel")}
          </Caption>
          <Body italic className="text-bone-cream/75 leading-relaxed">
            {t("disclaimerBody")}
          </Body>
        </div>
      </div>
    </main>
  );
}
