import { promises as fs } from "fs";
import path from "path";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import Mandala from "@/components/decoration/Mandala";
import AttributedImage from "@/components/content/AttributedImage";
import MandalaBrainViewer from "@/components/content/MandalaBrainViewer";
import {
  Body,
  Caption,
  Display,
  Hand,
  Heading,
  Mono,
} from "@/components/typography/Typography";
import { archetypeProse } from "@/content/archetypes/prose";

type ManifestImage = {
  src: string;
  title: string;
  artist: string;
  date: string;
  institution: string;
  license: string;
  source_url: string;
  note?: string;
};

type ManifestArchetype = {
  id: string;
  title: string;
  subtitle: string;
  shipped: boolean;
  todo_note?: string;
  primary_image: ManifestImage | null;
  prose_id?: string;
};

type ManifestMandala = {
  id: string;
  src: string;
  title: string;
  artist: string;
  date: string;
  institution: string;
  license: string;
  source_url: string;
};

type Manifest = {
  archetypes: ManifestArchetype[];
  mandalas: ManifestMandala[];
};

async function loadManifest(): Promise<Manifest> {
  const p = path.join(
    process.cwd(),
    "content",
    "archetypes",
    "manifest.json",
  );
  const raw = await fs.readFile(p, "utf-8");
  return JSON.parse(raw) as Manifest;
}

export default async function ArchetypesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "archetypes" });
  const manifest = await loadManifest();
  const shipped = manifest.archetypes.filter((a) => a.shipped);
  const upcoming = manifest.archetypes.filter((a) => !a.shipped);

  return (
    <>
      {/* Opening */}
      <section className="relative flex min-h-[90vh] items-center justify-center px-6 pt-36 md:px-10 md:pt-44">
        <Mandala
          src="/mandalas/hildegard_codex.jpg"
          alt="12th-century Hildegard codex illumination"
          opacity={0.07}
          rotationSeconds={300}
          position="top-[20%] left-1/2 -translate-x-1/2"
          size="w-[50rem]"
        />
        <div className="mx-auto max-w-[44rem] text-center">
          <Caption uppercase className="text-brass">
            {t("label")}
          </Caption>
          <Display italic className="mt-10">
            {t("opening")}
          </Display>
          <Body className="text-bone-cream/65 mt-10">
            {t("openingBody")}
          </Body>
        </div>
      </section>

      {/* Shipped archetypes */}
      {shipped.map((arch, i) => (
        <ArchetypeScene
          key={arch.id}
          archetype={arch}
          title={readArchetypeProse(t, arch).title}
          subtitle={readArchetypeProse(t, arch).subtitle}
          paragraphs={readArchetypeProse(t, arch).paragraphs}
          flip={i % 2 === 1}
          mandalaSrc={
            i % 2 === 0
              ? "/mandalas/fludd_microcosm.jpg"
              : "/mandalas/hildegard_codex.jpg"
          }
        />
      ))}

      {/* Upcoming archetypes (TODO_IMAGE) */}
      {upcoming.length > 0 && (
        <section className="relative px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-[44rem]">
            <Caption uppercase className="text-brass">
              {t("upcomingLabel")}
            </Caption>
            <Heading className="mt-6 font-[200]">{t("upcomingHeading")}</Heading>
            <Body className="text-bone-cream/65 mt-6">
              {t("upcomingBody")}
            </Body>
            <ul className="mt-10 space-y-8">
              {upcoming.map((a) => (
                <li key={a.id}>
                  <Caption uppercase className="text-brass">
                    {a.title}
                  </Caption>
                  <Body italic className="text-bone-cream/75 mt-2">
                    {a.subtitle}
                  </Body>
                  <Mono variant="label" className="text-bone-cream/45 mt-3 block">
                    {t("todoImage")} · {a.todo_note}
                  </Mono>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* On Mandalas — full essay section before the closing meditation */}
      <section className="relative px-6 py-32 md:px-10 md:py-48">
        <Mandala
          src="/mandalas/fludd_microcosm.jpg"
          alt="Robert Fludd, De integra microcosmi harmonia, 1619, Wellcome Collection"
          opacity={0.07}
          rotationSeconds={360}
          position="top-[15%] left-1/2 -translate-x-1/2"
          size="w-[44rem]"
        />
        <div className="mx-auto max-w-[42rem]">
          <Caption uppercase className="text-brass">
            {t("mandalasLabel")}
          </Caption>
          <Display italic className="mt-10">
            {t("mandalasDisplay")}
          </Display>

          <Body className="text-bone-cream/85 mt-12">
            {t("mandalasBody1")}
          </Body>
          <Body className="text-bone-cream/85 mt-6">
            {t("mandalasBody2")}
          </Body>

          {/* Two mandalas, side by side, with their full provenance */}
          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
            <AttributedImage
              prov={{
                src: "/mandalas/fludd_microcosm.jpg",
                title: "De integra microcosmi harmonia",
                artist: "Robert Fludd",
                date: "1619",
                institution: "Wellcome Collection, London",
                license: "Public domain (PD-old, pre-1929)",
                source_url:
                  "https://commons.wikimedia.org/wiki/File:De_integra_microcosmi_harmonia..._Fludd,_1619_Wellcome_L0016204.jpg",
                note: "An alchemical mandala of the harmony of the microcosm.",
              }}
              width={1116}
              height={1734}
            />
            <AttributedImage
              prov={{
                src: "/mandalas/hildegard_codex.jpg",
                title: "Hildegardis-Codex illumination",
                artist: "12th-century manuscript illuminator",
                date: "12th century",
                institution: "Biblioteca Statale di Lucca",
                license: "Public domain (PD-old, medieval manuscript)",
                source_url:
                  "https://commons.wikimedia.org/wiki/File:Meister_des_Hildegardis-Codex_001.jpg",
                note: "A medieval Christian cosmic mandala, four centuries before Jung wrote about them.",
              }}
              width={1000}
              height={1287}
            />
          </div>

          <Heading className="text-brass mt-20 font-[200]">
            {t("howToLookHeading")}
          </Heading>
          <Body className="text-bone-cream/85 mt-8">
            {t("howToLookBody")}
          </Body>
          <ol className="mt-8 space-y-6 [counter-reset:mandala]">
            {([
              ["01", t("look1Title"), t("look1")],
              ["02", t("look2Title"), t("look2")],
              ["03", t("look3Title"), t("look3")],
              ["04", t("look4Title"), t("look4")],
            ] as const).map(([n, title, body]) => (
              <li key={n} className="grid grid-cols-[3rem_1fr] items-baseline gap-4">
                <Mono variant="label" className="text-brass">{n}</Mono>
                <Body className="text-bone-cream/85">
                  <span className="text-brass font-[400]">{title}</span> {body}
                </Body>
              </li>
            ))}
          </ol>

          <Heading className="text-brass mt-20 font-[200]">
            {t("whyHeading")}
          </Heading>
          <Body className="text-bone-cream/85 mt-8">{t("whyBody1")}</Body>
          <Body className="text-bone-cream/85 mt-6">{t("whyBody2")}</Body>
          <Body className="text-bone-cream/85 mt-6">{t("whyBody3")}</Body>
          <Body italic className="text-bone-cream/80 mt-10 text-lg leading-[1.6]">
            {t("mandalasItalic")}
          </Body>
          <Mono variant="label" className="text-bone-cream/40 mt-14 block">
            {t("mandalasMeta")}
          </Mono>
        </div>
      </section>

      {/* Mandalas from many traditions + brain viewer */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <Caption uppercase className="text-brass">
            {t("manyLabel")}
          </Caption>
          <Heading className="mt-6 font-[200]">
            {t("manyHeading")}
          </Heading>
          <Body className="text-bone-cream/65 mt-6 max-w-[42rem]">
            {t("manyBody")}
          </Body>

          <div className="mt-16">
            <MandalaBrainViewer />
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="relative flex min-h-[80vh] items-center px-6 pb-24 pt-32 md:px-10">
        <AtmosphericGlow preset="amber-lamp" position="bottom" intensity="subtle" />
        <Mandala
          src="/mandalas/fludd_microcosm.jpg"
          alt="Robert Fludd, De integra microcosmi harmonia"
          opacity={0.06}
          rotationSeconds={300}
          position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          size="w-[42rem]"
        />
        <div className="mx-auto max-w-[40rem]">
          <Body className="text-bone-cream/80">{t("closing1")}</Body>
          <Body className="text-bone-cream/75 mt-6">{t("closing2")}</Body>
          <Body italic className="text-bone-cream/85 mt-8 text-lg">
            {t("closingItalic")}
          </Body>
          <div className="mt-14 space-y-4">
            <div>
              <Link
                href="/threshold"
                className="text-bone-cream/70 hover:text-brass border-bone-cream/15 hover:border-brass border-b transition-colors"
              >
                <Body italic>{t("linkThreshold")}</Body>
              </Link>
            </div>
            <div>
              <Link
                href="/field-notes"
                className="text-bone-cream/70 hover:text-brass border-bone-cream/15 hover:border-brass border-b transition-colors"
              >
                <Body italic>{t("linkFieldNotes")}</Body>
              </Link>
            </div>
            <div>
              <Link
                href="/"
                className="text-bone-cream/70 hover:text-brass border-bone-cream/15 hover:border-brass border-b transition-colors"
              >
                <Body italic>{t("linkHome")}</Body>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-bone-cream/10 px-6 py-12 text-center md:px-10">
        <Caption uppercase className="text-bone-cream/40">
          {t("footer")}
        </Caption>
      </footer>
    </>
  );
}

function ArchetypeScene({
  archetype,
  title,
  subtitle,
  paragraphs,
  flip,
  mandalaSrc,
}: {
  archetype: ManifestArchetype;
  title: string;
  subtitle: string;
  paragraphs: string[] | null;
  flip: boolean;
  mandalaSrc: string;
}) {
  const prose = archetypeProse[archetype.prose_id ?? archetype.id];
  const ps = paragraphs ?? prose?.paragraphs ?? [];
  const img = archetype.primary_image!;
  return (
    <section className="relative px-6 py-28 md:px-10 md:py-40">
      <Mandala
        src={mandalaSrc}
        alt="Mandala decoration"
        opacity={0.05}
        rotationSeconds={300}
        position={flip ? "top-[20%] left-[-12rem]" : "top-[20%] right-[-12rem]"}
        size="w-[40rem]"
      />
      <div
        className={`mx-auto grid max-w-[1280px] grid-cols-1 gap-12 md:grid-cols-12 md:gap-16 ${
          flip ? "md:[direction:rtl]" : ""
        }`}
      >
        <div className="md:col-span-5 md:[direction:ltr]">
          <AttributedImage
            prov={img}
            width={1200}
            height={1600}
            priority={archetype.id === "shadow"}
          />
        </div>
        <div className="md:col-span-7 md:[direction:ltr]">
          <Caption uppercase className="text-brass">
            {title}
          </Caption>
          <Display
            italic
            as="h2"
            className="mt-8 md:!text-[3rem] md:!leading-[1.1]"
          >
            {subtitle}
          </Display>
          <div className="mt-10 space-y-6">
            {ps.map((p, i) => (
              <Body key={i} className={i === 0 ? "" : "text-bone-cream/80"}>
                {p}
              </Body>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Look up locale-aware title/subtitle/paragraphs for an archetype.
 * Falls back to the manifest data when the translation namespace
 * doesn't define the key.
 */
function readArchetypeProse(
  t: Awaited<ReturnType<typeof getTranslations<"archetypes">>>,
  arch: ManifestArchetype,
): { title: string; subtitle: string; paragraphs: string[] | null } {
  const proseKey = arch.prose_id ?? arch.id;
  let title = arch.title;
  let subtitle = arch.subtitle;
  let paragraphs: string[] | null = null;
  try {
    title = t(`prose.${proseKey}.title`);
    subtitle = t(`prose.${proseKey}.subtitle`);
    const p = t.raw(`prose.${proseKey}.paragraphs`);
    if (Array.isArray(p)) paragraphs = p as string[];
  } catch {
    /* fallback */
  }
  return { title, subtitle, paragraphs };
}
