import {
  Caption,
  Display,
  Mono,
} from "@/components/typography/Typography";

/**
 * Section header for one of the five movements in a literary room.
 *
 * The five-movement structure (Frame → Brain → Psyche → Language →
 * Image) is the same across Faust and Dante because the structure
 * IS the argument: it forces every passage to pass through all four
 * registers the site holds, plus the image. This component renders
 * the brass roman numeral, the movement title in italic Display
 * typography, and a small reading-time chip.
 */
export default function MovementHeader({
  number,
  label,
  title,
  readingMinutes,
}: {
  /** I, II, III, IV, V — already pre-numeralised by the caller. */
  number: string;
  /** Short label: "Movement", "Movimento", "บท", etc. */
  label: string;
  /** Movement title, e.g. "The frame", "The brain". */
  title: string;
  /** Estimated reading time in minutes for this movement only. */
  readingMinutes: number;
}) {
  return (
    <header className="mb-12">
      <div className="flex items-baseline gap-4">
        <Caption uppercase className="text-brass tracking-[0.28em]">
          {label} {number}
        </Caption>
        <span aria-hidden className="bg-bone-cream/15 h-px flex-1" />
        <Mono variant="label" className="text-bone-cream/45 tracking-[0.18em]">
          {readingMinutes} min
        </Mono>
      </div>
      <Display italic as="h2" className="mt-6 max-w-[36rem] !text-[2.6rem] !leading-[1.1]">
        {title}
      </Display>
    </header>
  );
}
