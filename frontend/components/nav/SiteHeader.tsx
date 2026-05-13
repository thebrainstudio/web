"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Caption } from "@/components/typography/Typography";
import { easeStandard } from "@/lib/animations";

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

type NavItem = { href: string; label: string };

const navItems: NavItem[] = [
  { href: "/mirror", label: "Mirror" },
  { href: "/music", label: "Music" },
  { href: "/crosscultural", label: "Cross-Cultural" },
  { href: "/about", label: "About" },
];

function NavLink({
  href,
  label,
  active,
  className = "",
  onClick,
}: NavItem & {
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
  const [muted, setMuted] = useState(true);
  const [open, setOpen] = useState(false);

  // Close mobile sheet whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
            The Brain Studio
          </Caption>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <NavLink {...item} active={active} />
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={toggleAmbient}
              aria-label={muted ? "Unmute ambient" : "Mute ambient"}
              aria-pressed={!muted}
              className="text-bone-cream/70 transition-colors duration-200 hover:text-brass"
            >
              <MuteIcon muted={muted} />
            </button>
          </li>
          <li>
            <a
              href="https://github.com/frankcaules"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Source on GitHub"
              className="text-bone-cream/70 transition-colors duration-200 hover:text-brass"
            >
              <GithubMark />
            </a>
          </li>
        </ul>

        {/* Mobile: mute + menu */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            type="button"
            onClick={toggleAmbient}
            aria-label={muted ? "Unmute ambient" : "Mute ambient"}
            aria-pressed={!muted}
            className="text-bone-cream/70"
          >
            <MuteIcon muted={muted} />
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="text-bone-cream/85"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
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
        <ul className="bg-navy-deep/95 border-bone-cream/10 mx-6 mb-4 mt-2 space-y-3 rounded-sm border px-6 py-5 backdrop-blur">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <NavLink
                  {...item}
                  active={active}
                  className="block py-1"
                  onClick={() => setOpen(false)}
                />
              </li>
            );
          })}
          <li className="border-bone-cream/10 border-t pt-3">
            <a
              href="https://github.com/frankcaules"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone-cream/70 inline-flex items-center gap-2 transition-colors duration-200 hover:text-brass"
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
