import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Caption } from "@/components/typography/Typography";

/**
 * PR 9 — shared site footer.
 *
 * Three rows of small Caption text:
 *   1. Room links — 8 rooms + 5 reference/longform routes,
 *      separated by middle-dots. Wraps gracefully.
 *   2. Built-with line — "Built with Claude · JIPP Chulalongkorn".
 *   3. Version + GitHub.
 *
 * The home page's previous footer (built / encoder / about) was
 * minimal and inconsistent with what lives on other pages. This
 * component is the canonical footer; pages mount it as their
 * trailing element.
 *
 * Strings come from the shared `footer` namespace introduced in
 * PR 9 so each row can be localized. Room link labels reuse the
 * existing `nav.<key>` flat namespace.
 */

type FooterLink = { href: string; labelKey: string };

const ROOM_LINKS: FooterLink[] = [
  { href: "/mirror", labelKey: "mirror" },
  { href: "/music", labelKey: "music" },
  { href: "/crosscultural", labelKey: "crosscultural" },
  { href: "/cellular", labelKey: "cellular" },
  { href: "/threshold", labelKey: "threshold" },
  { href: "/archetypes", labelKey: "archetypes" },
  { href: "/faust", labelKey: "faust" },
  { href: "/dante", labelKey: "dante" },
];

const REFERENCE_LINKS: FooterLink[] = [
  { href: "/atlas", labelKey: "atlas" },
  { href: "/bridges", labelKey: "bridges" },
  { href: "/tours", labelKey: "tours" },
  { href: "/depth-psychology", labelKey: "depthPsychology" },
  { href: "/field-notes", labelKey: "fieldNotes" },
  { href: "/map", labelKey: "siteMap" },
  { href: "/about", labelKey: "about" },
];

export default function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const Dot = () => (
    <Caption className="text-bone-cream/30 mx-2.5 inline" aria-hidden>
      ·
    </Caption>
  );

  return (
    <footer className="border-bone-cream/10 relative border-t px-6 py-14 text-center md:px-10">
      <div className="mx-auto max-w-[1100px] space-y-5">
        {/* Row 1 — 8 rooms */}
        <div className="text-bone-cream/80">
          {ROOM_LINKS.map((link, i) => (
            <span key={link.href}>
              <Link
                href={link.href}
                data-hover
                className="hover:text-brass transition-colors duration-200"
              >
                <Caption uppercase>{tNav(link.labelKey)}</Caption>
              </Link>
              {i < ROOM_LINKS.length - 1 && <Dot />}
            </span>
          ))}
        </div>

        {/* Row 2 — reference layer + longform + about */}
        <div className="text-bone-cream/75">
          {REFERENCE_LINKS.map((link, i) => (
            <span key={link.href}>
              <Link
                href={link.href}
                data-hover
                className="hover:text-brass transition-colors duration-200"
              >
                <Caption uppercase>{tNav(link.labelKey)}</Caption>
              </Link>
              {i < REFERENCE_LINKS.length - 1 && <Dot />}
            </span>
          ))}
        </div>

        {/* Row 3 — built / institutional credit */}
        <div className="text-bone-cream/50 pt-3">
          <Caption uppercase>{t("built")}</Caption>
          <Dot />
          <Caption uppercase>{t("encoder")}</Caption>
        </div>

        {/* Row 4 — version + github */}
        <div className="text-bone-cream/40">
          <Caption uppercase>{t("version")}</Caption>
          <Dot />
          <a
            href="https://github.com/dreamsmanifested6666-dotcom/brain-studio"
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            className="hover:text-brass transition-colors duration-200"
          >
            <Caption uppercase>{t("github")}</Caption>
          </a>
        </div>
      </div>
    </footer>
  );
}
