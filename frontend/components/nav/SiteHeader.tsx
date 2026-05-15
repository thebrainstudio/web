"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Caption } from "@/components/typography/Typography";
import { easeStandard } from "@/lib/animations";
import LanguageSelector from "@/components/nav/LanguageSelector";
import NavMenu from "@/components/nav/NavMenu";
import { useDismissable } from "@/components/nav/useDismissable";
import { navMenus, allMenuItems } from "@/components/nav/navMenus";

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
        active ? "text-bone-cream" : "text-bone-cream/85 hover:text-bone-cream"
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
 *
 * PR 4 — restructured into a mega-menu: four panel groups (Rooms,
 * Literature, Depth, Instrument) replace the old single "Sections"
 * dropdown. Each panel is its own `<NavMenu>` and they share an
 * `openId` so only one is open at a time. Dismissal (Escape +
 * click-outside) lives in `useDismissable`.
 *
 * The trio of primary buttons (Mirror, Music, Cross-Cultural) is
 * gone — those rooms moved into the Rooms panel along with
 * Cellular. About remains visible as the meta page; LanguageSelector,
 * search, mute, GitHub stay on the right.
 *
 * Mobile sheet keeps the flat-list architecture, with group-heading
 * separators between the four sections so the order is legible.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [muted, setMuted] = useState(true);
  const [open, setOpen] = useState(false);
  // The mega-menu shares a single openId so only one panel is open
  // at a time. `null` means everything closed.
  const [openId, setOpenId] = useState<string | null>(null);

  // Close mobile sheet + any open panel whenever the route changes.
  useEffect(() => {
    setOpen(false);
    setOpenId(null);
  }, [pathname]);

  // One dismissal listener for all four panels — each NavMenu marks
  // itself with `data-nav-panel` so clicks inside any of them count
  // as "inside".
  useDismissable(openId !== null, () => setOpenId(null));

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

  const aboutActive =
    pathname === "/about" || pathname.startsWith("/about/");

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 backdrop-blur-md"
      data-museum-chrome
    >
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

        {/* Desktop nav — four grouped panels + About + utilities. */}
        <ul className="ml-auto hidden items-center gap-x-7 md:flex">
          {navMenus.map((group) => (
            <NavMenu
              key={group.id}
              group={group}
              openId={openId}
              setOpenId={setOpenId}
            />
          ))}

          {/* About — kept visible because it's the meta page anyone
              new to the site will hit first. */}
          <li>
            <NavLink href="/about" label={t("about")} active={aboutActive} />
          </li>

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
              className="text-bone-cream/85 transition-colors duration-200 hover:text-brass"
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
              className="text-bone-cream/85 transition-colors duration-200 hover:text-brass"
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
              className="text-bone-cream/85 transition-colors duration-200 hover:text-brass"
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
            className="text-bone-cream/85"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            onClick={toggleAmbient}
            aria-label={muted ? t("unmuteAria") : t("muteAria")}
            aria-pressed={!muted}
            className="text-bone-cream/85"
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

      {/* Mobile sheet — flat list of every menu item, with group
          heading separators between the four panels. The sheet has
          scroll room; clutter isn't an issue here. */}
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
        <ul className="bg-navy-deep/95 border-bone-cream/10 mx-6 mb-4 mt-2 max-h-[80vh] space-y-1 overflow-y-auto rounded-sm border px-6 py-5 backdrop-blur">
          {navMenus.map((group, gi) => (
            <div key={group.id}>
              <li
                className={
                  gi === 0
                    ? ""
                    : "border-bone-cream/10 mt-3 border-t pt-3"
                }
              >
                <Caption
                  uppercase
                  className="text-brass mb-2 block tracking-[0.18em]"
                >
                  {t(`menus.${group.id}.label`)}
                </Caption>
              </li>
              {group.items.map((item) => {
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
            </div>
          ))}

          {/* About + GitHub trailing */}
          <li className="border-bone-cream/10 mt-3 border-t pt-3">
            <NavLink
              href="/about"
              label={t("about")}
              active={aboutActive}
              className="block py-2"
              onClick={() => setOpen(false)}
            />
          </li>
          <li>
            <a
              href="https://github.com/dreamsmanifested6666-dotcom/brain-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone-cream/85 inline-flex items-center gap-2 py-2 transition-colors duration-200 hover:text-brass"
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

/** Kept in module scope so external consumers can introspect the
 *  current menu surface — used by the Cmd-K palette indexer in
 *  PR 11. Right now unused, but importing this from the search
 *  component is cheaper than re-deriving the route list. */
export { allMenuItems };
