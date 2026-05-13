import { promises as fs } from "fs";
import path from "path";
import { Link } from "@/i18n/navigation";
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

export default async function ArchetypesPage() {
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
            The Archetypes
          </Caption>
          <Display italic className="mt-10">
            There are figures in the psyche that are not you.
          </Display>
          <Body className="text-bone-cream/65 mt-10">
            Carl Jung gave them names. Six are shown here, each illustrated
            with a real artifact from the visual tradition Jung drew on —
            paintings and manuscripts whose creators died long before he
            did. None of the images are Jung&apos;s own work.
          </Body>
        </div>
      </section>

      {/* Shipped archetypes */}
      {shipped.map((arch, i) => (
        <ArchetypeScene
          key={arch.id}
          archetype={arch}
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
              Coming to this room
            </Caption>
            <Heading className="mt-6 font-[200]">Three more archetypes are scheduled.</Heading>
            <Body className="text-bone-cream/65 mt-6">
              Each of the following needs a verified public-domain artwork
              sourced before it can ship. The discipline of this room is
              that no archetype enters without an artifact whose
              provenance is documented and visible.
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
                    TODO_IMAGE · {a.todo_note}
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
            On mandalas
          </Caption>
          <Display italic className="mt-10">
            How to look at a circle that is also a portrait of a psyche.
          </Display>

          <Body className="text-bone-cream/85 mt-12">
            Jung started painting mandalas before he had a theory of them.
            Through the years of his break with Freud and his slow descent
            into what he later called his confrontation with the
            unconscious, circular images appeared in his notebooks — first
            as something he was compelled to draw, then as something his
            patients independently produced during periods of psychic
            upheaval, and finally as something he recognized across the
            visual traditions of medieval Europe, Tibetan Buddhism,
            alchemical manuscripts, Hindu yantras, Hildegard&apos;s
            illuminations, and the rose windows of cathedrals he had
            never planned to study.
          </Body>
          <Body className="text-bone-cream/85 mt-6">
            What he came to believe, with appropriate hedging, was that
            the mandala is the symbolic expression of what he called the
            Self — the whole psyche of which the conscious ego is a small
            part. Not the metaphysical Self of any one tradition, but a
            pattern the psyche reaches for when it needs to organize
            itself: a center, a containment, a quaternity, an integration
            of opposites held in a single field.
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
            How to look at one.
          </Heading>
          <Body className="text-bone-cream/85 mt-8">
            Jung had a practical method for looking at a mandala, his
            patients&apos; or his own. The point was not interpretation in
            the usual sense — not a key that decodes the image — but a
            slower attending that lets the image do its work. Four
            questions, asked roughly in order:
          </Body>
          <ol className="mt-8 space-y-6 [counter-reset:mandala]">
            <li className="grid grid-cols-[3rem_1fr] items-baseline gap-4">
              <Mono variant="label" className="text-brass">
                01
              </Mono>
              <Body className="text-bone-cream/85">
                <span className="text-brass font-[400]">What is at the center?</span>{" "}
                Sometimes a figure, sometimes a flame, sometimes an empty
                point, sometimes nothing identifiable at all. The center
                is what the rest of the image is organized around. Whether
                it is occupied or empty, occupied by what, empty in what
                way — these matter.
              </Body>
            </li>
            <li className="grid grid-cols-[3rem_1fr] items-baseline gap-4">
              <Mono variant="label" className="text-brass">
                02
              </Mono>
              <Body className="text-bone-cream/85">
                <span className="text-brass font-[400]">What four things are around the center?</span>{" "}
                Mandalas across traditions tend toward quaternity — four
                directions, four elements, four evangelists, four
                functions of consciousness in Jung&apos;s own typology.
                The four are not arbitrary; they are the rhythm by which
                the center is mapped into the field. Notice whether the
                four are balanced or one is heavier, whether one is
                missing, whether they repeat into eight or sixteen.
              </Body>
            </li>
            <li className="grid grid-cols-[3rem_1fr] items-baseline gap-4">
              <Mono variant="label" className="text-brass">
                03
              </Mono>
              <Body className="text-bone-cream/85">
                <span className="text-brass font-[400]">What contains it?</span>{" "}
                Mandalas have boundaries — circles, walls, gates, sacred
                precincts. The boundary holds energy that would otherwise
                disperse. In the felt experience of looking, the
                containment is what makes the center possible. Without
                edge there is no center.
              </Body>
            </li>
            <li className="grid grid-cols-[3rem_1fr] items-baseline gap-4">
              <Mono variant="label" className="text-brass">
                04
              </Mono>
              <Body className="text-bone-cream/85">
                <span className="text-brass font-[400]">Where does it break?</span>{" "}
                A working mandala is almost never perfectly symmetric. A
                crack in the boundary, a missing quadrant, a figure
                pulling sideways out of the frame. Jung paid close
                attention to these — not as flaws but as the place where
                the integration is incomplete and where the next work is
                waiting.
              </Body>
            </li>
          </ol>

          <Heading className="text-brass mt-20 font-[200]">
            Why Jung kept coming back.
          </Heading>
          <Body className="text-bone-cream/85 mt-8">
            What Jung claimed about mandalas, and what he hedged about
            them, are worth separating. He claimed that mandalas appear
            spontaneously when the psyche is reorganizing itself — that
            they are part of the actual work of individuation, not just
            illustrations of it. He claimed that drawing them was a way
            to participate in that reorganization. He claimed the
            quaternity structure was not random but expressed something
            structural about how consciousness orients itself.
          </Body>
          <Body className="text-bone-cream/85 mt-6">
            What he hedged was metaphysics. He did not claim the mandala
            was a portal to anything. He did not claim it was magical, or
            that drawing one would heal you. He treated mandalas as
            clinical data — observed reliably enough across patients and
            traditions to deserve careful description, and reserved
            judgment about anything beyond that. The wellness industry,
            in its appropriation, has dropped the hedge and kept the
            mystery, which is the wrong half to keep.
          </Body>
          <Body className="text-bone-cream/85 mt-6">
            Looking at Fludd&apos;s engraving above or the Hildegard
            codex beside it, both made centuries before Jung was born,
            you can see what he was pointing at without endorsing the
            cosmologies they came from. A center. A quaternity. A
            containment. A break in the symmetry somewhere that lets the
            life of the image stay alive. The work of looking is real
            even when the metaphysics is contested.
          </Body>
          <Body italic className="text-bone-cream/80 mt-10 text-lg leading-[1.6]">
            A mandala is not a picture of a finished self. It is a picture
            of a self being worked on, sometimes by hands that did not
            know what they were drawing until it was drawn.
          </Body>
          <Mono variant="label" className="text-bone-cream/40 mt-14 block">
            On Mandalas · ~700 words · 4 min read
          </Mono>
        </div>
      </section>

      {/* Mandalas from many traditions + brain viewer */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <Caption uppercase className="text-brass">
            Mandalas from many traditions
          </Caption>
          <Heading className="mt-6 font-[200]">
            Same shape, different vocabularies.
          </Heading>
          <Body className="text-bone-cream/65 mt-6 max-w-[42rem]">
            Jung observed that mandalic forms recur across cultures with
            no plausible chain of transmission between them. Medieval
            Christian rose windows. Tibetan dependent-origination wheels.
            The Sri Yantra. The Mexica Sun Stone. European alchemical
            engravings. Same shape, organized differently, used for
            different work. The convergence interested him for the rest
            of his life. Below are seven, with what depth psychology
            sees in each — and what published neuroimaging literature
            would predict your brain to do while looking at them.
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
          <Body className="text-bone-cream/80">
            These are not parts of the brain. They are not regions on a
            scan. They are patterns in the felt life of being a self —
            patterns old enough to have shown up in every culture&apos;s
            mythology, recurring enough to have made one psychologist try
            to give them names.
          </Body>
          <Body className="text-bone-cream/75 mt-6">
            Some of what Jung saw has been confirmed in different language
            by neuroscience. Some has not. Much of it lives in a register
            where neither neuroscience nor depth psychology can fully
            claim the territory.
          </Body>
          <Body italic className="text-bone-cream/85 mt-8 text-lg">
            This is what makes them worth keeping both languages alive for.
          </Body>
          <div className="mt-14 space-y-4">
            <div>
              <Link
                href="/threshold"
                className="text-bone-cream/70 hover:text-brass border-bone-cream/15 hover:border-brass border-b transition-colors"
              >
                <Body italic>Return to the threshold</Body>
              </Link>
            </div>
            <div>
              <Link
                href="/field-notes"
                className="text-bone-cream/70 hover:text-brass border-bone-cream/15 hover:border-brass border-b transition-colors"
              >
                <Body italic>Read the field notes</Body>
              </Link>
            </div>
            <div>
              <Link
                href="/"
                className="text-bone-cream/70 hover:text-brass border-bone-cream/15 hover:border-brass border-b transition-colors"
              >
                <Body italic>Return to the surface</Body>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-bone-cream/10 px-6 py-12 text-center md:px-10">
        <Caption uppercase className="text-bone-cream/40">
          Sources · all artworks public domain · provenance under each ⓘ
        </Caption>
      </footer>
    </>
  );
}

function ArchetypeScene({
  archetype,
  flip,
  mandalaSrc,
}: {
  archetype: ManifestArchetype;
  flip: boolean;
  mandalaSrc: string;
}) {
  const prose = archetypeProse[archetype.prose_id ?? archetype.id];
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
            {archetype.title}
          </Caption>
          <Display
            italic
            as="h2"
            className="mt-8 md:!text-[3rem] md:!leading-[1.1]"
          >
            {archetype.subtitle}
          </Display>
          <div className="mt-10 space-y-6">
            {prose?.paragraphs.map((p, i) => (
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
