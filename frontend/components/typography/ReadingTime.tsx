import { useTranslations } from "next-intl";
import { Mono } from "@/components/typography/Typography";

/**
 * Shared reading-time chip. Discriminated union so each variant
 * gets exactly the props it needs and no more — and so a single
 * grep for `<ReadingTime` surfaces every reading-time render on
 * the site.
 *
 * Variants:
 *  - "essay"     — short chip:        "8 min read"
 *  - "meta"      — essay-index meta:  "1,800 words · 8 min · 2025-09-04"
 *  - "movement"  — five-movement:     "Movement one · 2 min"
 *  - "tour"      — tours MM:SS:       "12:30"
 *
 * The strings "words", "min", "min read" come from the shared
 * `reading` i18n namespace so the chip translates everywhere it
 * appears.
 */

type Common = {
  className?: string;
};

type EssayProps = Common & {
  kind: "essay";
  minutes: number;
};

type MetaProps = Common & {
  kind: "meta";
  wordCount: number;
  minutes: number;
  /** Date string or forthcoming-tag — caller pre-localizes. */
  publishedAt: string;
};

type MovementProps = Common & {
  kind: "movement";
  /** Pre-localized: "Movement one", "Movimento uno", "บทที่ 1", etc. */
  numberLabel: string;
  minutes: number;
};

type TourProps = Common & {
  kind: "tour";
  /** Already in MM:SS format — tours have hand-authored durations. */
  duration: string;
};

type Props = EssayProps | MetaProps | MovementProps | TourProps;

export default function ReadingTime(props: Props) {
  const t = useTranslations("reading");

  if (props.kind === "essay") {
    return (
      <Mono variant="label" className={props.className}>
        {props.minutes} {t("minRead")}
      </Mono>
    );
  }

  if (props.kind === "meta") {
    return (
      <Mono variant="label" className={props.className}>
        {props.wordCount.toLocaleString()} {t("words")} · {props.minutes}{" "}
        {t("minutesShort")} · {props.publishedAt}
      </Mono>
    );
  }

  if (props.kind === "movement") {
    // numberLabel can be empty when the caller already renders the
    // movement title separately (e.g. MovementHeader has its own
    // "Movement I" caption). In that case we drop the bullet and
    // render just the minutes chip.
    return (
      <Mono variant="label" className={props.className}>
        {props.numberLabel ? `${props.numberLabel} · ` : ""}
        {props.minutes} {t("minutesShort")}
      </Mono>
    );
  }

  // tour
  return (
    <Mono variant="label" className={props.className}>
      {props.duration}
    </Mono>
  );
}
