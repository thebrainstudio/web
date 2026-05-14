import { Body, Caption } from "@/components/typography/Typography";

/**
 * Triangulation note — the room's philosophical heart in component
 * form. Rendered once per literary room between Movement 4 (the
 * language work) and Movement 5 (the image), it explicitly names:
 *
 *   1. What the three earlier movements have triangulated about the
 *      work (brain + psyche + language = three angles on one thing).
 *   2. What remains untriangulable — the part the work itself does
 *      that none of the three languages can reach alone, and that
 *      no amount of triangulation can substitute for.
 *
 * This is where the room states, in its own voice, the master
 * discipline the entire site holds: don't collapse meaning into
 * mechanism, mechanism into meaning, or either into prosody. The
 * brain regions discussed are not identical to the psychic
 * structures, and neither is identical to the lines on the page.
 */
export default function TriangulationNote({
  label,
  body,
}: {
  /** Section label — "Triangulation", "Triangulación", etc. */
  label: string;
  /** Three-paragraph note. Accepts plain string with double-newline
   *  paragraph breaks; rendered with the site's Body typography. */
  body: string;
}) {
  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  return (
    <section
      className="border-brass/30 mx-auto my-20 max-w-[44rem] border-y px-6 py-12 md:my-28 md:px-10 md:py-16"
      aria-label={label}
    >
      <Caption
        uppercase
        className="text-brass tracking-[0.28em] block text-center"
      >
        {label}
      </Caption>
      <div className="mt-10 space-y-6">
        {paragraphs.map((p, i) => (
          <Body
            key={i}
            italic={i === paragraphs.length - 1}
            className={
              i === paragraphs.length - 1
                ? "text-bone-cream/85 text-[1.08rem] leading-[1.7]"
                : "text-bone-cream/80"
            }
          >
            {p}
          </Body>
        ))}
      </div>
    </section>
  );
}
