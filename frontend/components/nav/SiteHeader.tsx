"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Caption } from "@/components/typography/Typography";
import { easeStandard } from "@/lib/animations";
import LanguageSelector from "@/components/nav/LanguageSelector";

function GithubMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-1.9c-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.18.91-.25 1.88-.38 2.85-.38.97 0 1.94.13 2.85.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.57.23 2.73.11 3.02.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.77 1.04.77 2.1v3.11c0 .3.21.65.8.54 4.56-1.52 7.85-5.83 7.85-10.91C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function MuteIcon({ muted, size = 16 }: { muted: boolean; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H2v6h4l5 4z" />
      {muted ? (
        <>
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </>
      )}
    </svg>
  );
}

function MenuIcon({ open, size = 18 }: { open: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden>
      <line
        x1="4"
        y1={open ? 12 : 8}
        x2="20"
        y2={open ? 12 : 8}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ transition: "all 220ms cubic-bezier(0.4,0,0.2,1)" }}
      />
      <line
        x1="4"
        y1={open ? 12 : 16}
        x2="20"
        y2={open ? 12 : 16}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ transition: "all 220ms cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
}

type NavItem = { href: string; labelKey: NavLabelKey };
type NavLabelKey =
  | "mirror"
  | "music"
  | "crosscultural"
  | "atlas"
  | "bridges"
  | "tours"
  | "threshold"
  | "archetypes"
  | "faust"
  | "dante"
  | "depthPsychology"
  | "fieldNotes"
  | "cellular"
  | "about";

// Primary nav: kept short so the top bar reads as a single
// editorial line, not a sitemap. The three TRIBE-driven rooms +
// About + the Sections dropdown.
const navItems: NavItem[] = [
  { href: "/mirror", labelKey: "mirror" },
  { href: "/music", labelKey: "music" },
  { href: "/crosscultural", labelKey: "crosscultural" },
  { href: "/about", labelKey: "about" },
];

// Sections dropdown — everything else, grouped so the menu reads
// as a layered map of the site rather than an alphabetical dump:
//   The reference layer (Atlas, Bridges, Tours)
//   The contemplative layer (Threshold, Archetypes, Depth Psychology, Field Notes)
//   The deep scale (Cellular)
type SectionGroup = {
  /** Translation key in `nav` for the group heading, or null for an
   *  ungrouped trailing item. */
  headingKey: string | null;
  items: NavItem[];
};

const sectionGroups: SectionGroup[] = [
  {
    headingKey: null,
    items: [
      { href: "/atlas", labelKey: "atlas" },
      { href: "/bridges", labelKey: "bridges" },
      { href: "/tours", labelKey: "tours" },
    ],
  },
  {
    headingKey: null,
    items: [
      { href: "/threshold", labelKey: "threshold" },
      { href: "/archetypes", labelKey: "archetypes" },
      { href: "/faust", labelKey: "faust" },
      { href: "/dante", labelKey: "dante" },
      { href: "/depth-psychology", labelKey: "depthPsychology" },
      { href: "/field-notes", labelKey: "fieldNotes" },
    ],
  },
  {
    headingKey: null,
    items: [{ href: "/cellular", labelKey: "cellular" }],
  },
];

// Flattened version for the mobile sheet (one vertical list).
const allSecondaryItems: NavItem[] = sectionGroups.flatMap((g) => g.items);

function NavLink({
  href,
  label,
  active,
  className = "",
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      prefetch
      onClick={onClick}
      className={`group relative inline-flex items-center transition-colors duration-200 ${
        active ? "text-bone-cream" : "text-bone-cream/70 hover:text-bone-cream"
      } ${className}`}
      aria-current={active ? "page" : undefined}
    >
      <Caption>{label}</Caption>
      {active && (
        <motion.span
          layoutId="nav-underline"
          aria-hidden
          className="bg-brass absolute -bottom-1 left-0 h-px w-full"
          transition={{ duration: 0.35, ease: easeStandard }}
        />
      )}
    </Link>
  );
}

/**
 * Sticky persistent nav.
 *  - Brass Fraunces wordmark, top-left
 *  - Active-route underline animates between items via Framer Motion's
 *    layoutId (the underline glides from old to new active item)
 *  - Mobile: a hamburger toggle reveals a full-width sheet with the same
 *    items (Cross-Cultural is no longer hidden on small screens)
 *  - Mute + GitHub icons remain on the right
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [muted, setMuted] = useState(true);
  const [open, setOpen] = useState(false);
  // Sections dropdown — small popover under the "Sections" trigger.
  const [sectionsOpen, setSectionsOpen] = useState(false);

  // Close mobile sheet whenever the route changes.
  useEffect(() => {
    setOpen(false);
    setSectionsOpen(false);
  }, [pathname]);

  // Close sections dropdown on Escape or click-outside.
  useEffect(() => {
    if (!sectionsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSectionsOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && !target.closest("[data-sections-menu]")) {
        setSectionsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [sectionsOpen]);

  // Compute whether any secondary route is currently active so the
  // Sections button reads as the "current page" indicator when the
  // reader is somewhere inside one of those pages.
  const sectionsActive = allSecondaryItems.some((item) => {
    if (item.href === "/") return pathname === "/";
    return pathname === item.href || pathname.startsWith(item.href + "/");
  });

  useEffect(() => {
    const sync = (e: Event) => {
      const detail = (e as CustomEvent<{ muted: boolean }>).detail;
      setMuted(detail.muted);
    };
    window.addEventListener("brain-studio:ambient-state", sync);
    return () =>
      window.removeEventListener("brain-studio:ambient-state", sync);
  }, []);

  const toggleAmbient = () =>
    window.dispatchEvent(new CustomEvent("brain-studio:toggle-ambient"));

  return (
    <header className="fixed inset-x-0 top-0 z-40 backdrop-blur-md">
      <div className="absolute inset-0 -z-10 bg-navy-deep/70" aria-hidden />
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="text-brass"
          aria-label="The Brain Studio — home"
        >
          <Caption uppercase className="text-brass tracking-[0.22em]">
            {t("siteTitle")}
          </Caption>
        </Link>

        {/* Desktop nav — three primary rooms + a Sections dropdown
            that holds the rest, so the top bar reads as a single
            editorial line rather than a sitemap dump. */}
        <ul className="ml-auto hidden items-center gap-x-7 md:flex">
          {navItems.slice(0, 3).map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <NavLink href={item.href} label={t(item.labelKey)} active={active} />
              </li>
            );
          })}

          {/* Sections dropdown trigger */}
          <li className="relative" data-sections-menu>
            <button
              type="button"
              data-hover
              onClick={() => setSectionsOpen((v) => !v)}
              aria-expanded={sectionsOpen}
              aria-haspopup="menu"
              className={`group relative inline-flex items-center gap-1.5 transition-colors duration-200 ${
                sectionsActive
                  ? "text-bone-cream"
                  : "text-bone-cream/70 hover:text-bone-cream"
              }`}
            >
              <Caption>Sections</Caption>
              <span
                aria-hidden
                className={`text-[0.6em] transition-transform duration-200 ${
                  sectionsOpen ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
              {sectionsActive && (
                <motion.span
                  layoutId="nav-underline"
                  aria-hidden
                  className="bg-brass absolute -bottom-1 left-0 h-px w-full"
                  transition={{ duration: 0.35, ease: easeStandard }}
                />
              )}
            </button>

            <AnimatePresence>
              {sectionsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: easeStandard }}
                  role="menu"
                  className="bg-navy-deep/95 border-bone-cream/10 absolute right-0 top-full mt-3 w-[15rem] rounded-sm border px-1.5 py-2 shadow-lg backdrop-blur"
                >
                  {sectionGroups.map((group, gi) => (
                    <div
                      key={gi}
                      className={
                        gi > 0
                          ? "border-bone-cream/10 mt-1 border-t pt-1"
                          : ""
                      }
                    >
                      {group.items.map((item) => {
                        const active =
                          pathname === item.href ||
                          pathname.startsWith(item.href + "/");
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            prefetch
                            onClick={() => setSectionsOpen(false)}
                            role="menuitem"
                            data-hover
                            className={`block rounded-sm px-3 py-2 transition-colors duration-150 ${
                              active
                                ? "text-brass bg-bone-cream/5"
                                : "text-bone-cream/80 hover:text-brass hover:bg-bone-cream/5"
                            }`}
                          >
                            <Caption uppercase className="tracking-[0.14em]">
                              {t(item.labelKey)}
                            </Caption>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {/* About — kept visible because it's the meta page anyone
              new to the site will hit first. */}
          {(() => {
            const aboutItem = navItems[3];
            const active =
              pathname === aboutItem.href ||
              pathname.startsWith(aboutItem.href + "/");
            return (
              <li>
                <NavLink
                  href={aboutItem.href}
                  label={t(aboutItem.labelKey)}
                  active={active}
                />
              </li>
            );
          })()}

          <li className="ml-2">
            <LanguageSelector />
          </li>
          <li>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("brain-studio:open-search"))
              }
              aria-label="Search The Brain Studio (Ctrl-K)"
              data-hover
              className="text-bone-cream/70 transition-colors duration-200 hover:text-brass"
            >
              <SearchIcon />
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={toggleAmbient}
              aria-label={muted ? t("unmuteAria") : t("muteAria")}
              aria-pressed={!muted}
              className="text-bone-cream/70 transition-colors duration-200 hover:text-brass"
            >
              <MuteIcon muted={muted} />
            </button>
          </li>
          <li>
            <a
              href="https://github.com/dreamsmanifested6666-dotcom/brain-studio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("githubAria")}
              className="text-bone-cream/70 transition-colors duration-200 hover:text-brass"
            >
              <GithubMark />
            </a>
          </li>
        </ul>

        {/* Mobile: language + search + mute + menu */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSelector compact />
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("brain-studio:open-search"))
            }
            aria-label="Search The Brain Studio (Ctrl-K)"
            className="text-bone-cream/70"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            onClick={toggleAmbient}
            aria-label={muted ? t("unmuteAria") : t("muteAria")}
            aria-pressed={!muted}
            className="text-bone-cream/70"
          >
            <MuteIcon muted={muted} />
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            className="text-bone-cream/85"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </nav>

      {/* Mobile sheet — shows the full route map as a vertical list,
          grouped the same way the desktop Sections dropdown groups
          them. The sheet has scroll room; clutter isn't an issue here. */}
      <motion.div
        id="mobile-nav"
        initial={false}
        animate={{
          opacity: open ? 1 : 0,
          y: open ? 0 : -8,
          pointerEvents: open ? "auto" : "none",
        }}
        transition={{ duration: 0.22, ease: easeStandard }}
        className="md:hidden"
      >
        <ul className="bg-navy-deep/95 border-bone-cream/10 mx-6 mb-4 mt-2 max-h-[80vh] space-y-1.5 overflow-y-auto rounded-sm border px-6 py-5 backdrop-blur">
          {/* Primary trio */}
          {navItems.slice(0, 3).map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  label={t(item.labelKey)}
                  active={active}
                  className="block py-2"
                  onClick={() => setOpen(false)}
                />
              </li>
            );
          })}

          {/* Sections — flat list with a small heading separator */}
          <li className="border-bone-cream/10 mt-3 border-t pt-3">
            <Caption
              uppercase
              className="text-bone-cream/40 mb-2 block tracking-[0.18em]"
            >
              Sections
            </Caption>
          </li>
          {allSecondaryItems.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  label={t(item.labelKey)}
                  active={active}
                  className="block py-2"
                  onClick={() => setOpen(false)}
                />
              </li>
            );
          })}

          {/* About + GitHub */}
          <li className="border-bone-cream/10 mt-3 border-t pt-3">
            <NavLink
              href={navItems[3].href}
              label={t(navItems[3].labelKey)}
              active={
                pathname === navItems[3].href ||
                pathname.startsWith(navItems[3].href + "/")
              }
              className="block py-2"
              onClick={() => setOpen(false)}
            />
          </li>
          <li>
            <a
              href="https://github.com/dreamsmanifested6666-dotcom/brain-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone-cream/70 inline-flex items-center gap-2 py-2 transition-colors duration-200 hover:text-brass"
            >
              <GithubMark />
              <Caption>GitHub</Caption>
            </a>
          </li>
        </ul>
      </motion.div>
    </header>
  );
}
