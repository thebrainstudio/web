"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Caption } from "@/components/typography/Typography";
import { easeStandard } from "@/lib/animations";
import type { NavMenuGroup } from "./navMenus";

type Props = {
  group: NavMenuGroup;
  openId: string | null;
  setOpenId: (id: string | null) => void;
};

/**
 * One panel of the nav mega-menu. Renders a single trigger button
 * with chevron + (if active) brass underline, and an
 * `AnimatePresence`-wrapped panel that opens on click. Each panel
 * shows a group tagline + the items as labeled rows with micro-
 * blurbs (the editorial sub-tagline that lives in
 * `nav.menus.<group>.blurbs.<key>`).
 *
 * Sibling panels share `openId` so only one is open at a time. The
 * parent `SiteHeader` owns that state plus the dismissal hook.
 */
export default function NavMenu({ group, openId, setOpenId }: Props) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const open = openId === group.id;

  // A panel reads as the "current page" indicator if the visitor is
  // sitting on any of its items — same heuristic as the old
  // sectionsActive check.
  const groupActive = group.items.some((item) => {
    if (item.href === "/") return pathname === "/";
    return pathname === item.href || pathname.startsWith(item.href + "/");
  });

  return (
    <li className="relative" data-nav-panel>
      <button
        type="button"
        data-hover
        onClick={() => setOpenId(open ? null : group.id)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`group relative inline-flex items-center gap-1.5 transition-colors duration-200 ${
          groupActive
            ? "text-bone-cream"
            : "text-bone-cream/85 hover:text-bone-cream"
        }`}
      >
        <Caption>{t(`menus.${group.id}.label`)}</Caption>
        <span
          aria-hidden
          className={`text-[0.6em] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
        {groupActive && (
          <motion.span
            layoutId="nav-underline"
            aria-hidden
            className="bg-brass absolute -bottom-1 left-0 h-px w-full"
            transition={{ duration: 0.35, ease: easeStandard }}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: easeStandard }}
            role="menu"
            className="bg-navy-deep/95 border-bone-cream/10 absolute right-0 top-full mt-3 w-[22rem] rounded-sm border px-3 py-4 shadow-lg backdrop-blur"
          >
            {/* Group tagline — small editorial line at the top of
                each panel so visitors know what register they're
                stepping into. */}
            <div className="border-bone-cream/10 mb-3 border-b px-2 pb-3">
              <Caption
                uppercase
                className="text-brass mb-1 block tracking-[0.18em]"
              >
                {t(`menus.${group.id}.label`)}
              </Caption>
              <span className="font-editorial text-caption text-bone-cream/75 block leading-snug">
                {t(`menus.${group.id}.tagline`)}
              </span>
            </div>

            {/* Item rows — each row is label + blurb. */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    onClick={() => setOpenId(null)}
                    role="menuitem"
                    data-hover
                    className={`block rounded-sm px-3 py-2 transition-colors duration-150 ${
                      active
                        ? "text-brass bg-bone-cream/5"
                        : "text-bone-cream/85 hover:text-brass hover:bg-bone-cream/5"
                    }`}
                  >
                    <Caption uppercase className="tracking-[0.14em]">
                      {t(item.labelKey)}
                    </Caption>
                    <span className="font-editorial text-caption text-bone-cream/50 mt-0.5 block leading-snug">
                      {t(`menus.${group.id}.blurbs.${item.blurbKey}`)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
