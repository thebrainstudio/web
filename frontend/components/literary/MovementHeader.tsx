import {
  Caption,
  Display,
} from "@/components/typography/Typography";
import ReadingTime from "@/components/typography/ReadingTime";

/**
 * Section header for one of the five movements in a literary room.
 *
 * The five-movement structure (Frame → Brain → Psyche → Language →
 * Image) is the same across Faust and Dante because the structure
 * IS the argument: it forces every passage to pass through all four
 * registers the site holds, plus the image. This component renders
 * the brass roman numeral, the movement title in italic Display
 * typography, and a small reading-time chip.
 *
 * PR 5: the chip used to read a hardcoded "N min" — now it routes
 * through ReadingTime kind="movement" so the "min" suffix
 * translates with the rest of the reading-time vocabulary.
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
        <span className="text-bone-cream/70 tracking-[0.18em]">
          <ReadingTime
            kind="movement"
            numberLabel=""
            minutes={readingMinutes}
          />
        </span>
      </div>
      <Display italic as="h2" className="mt-6 max-w-[36rem] !text-[2.6rem] !leading-[1.1]">
        {title}
      </Display>
    </header>
  );
}
