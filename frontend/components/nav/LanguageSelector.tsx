"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { locales, localeMeta, type Locale } from "@/i18n/locales";
import { Caption } from "@/components/typography/Typography";

/**
 * Language selector. Sits in the persistent nav.
 *
 *   - Collapsed: a small brass-bordered chip showing the active locale's
 *     short code (EN / ไทย / ES / CA / 日本語 / 中文).
 *   - Expanded: parchment-style dropdown with all six locales in their
 *     native script, each row tappable, current row brass-tinted, with
 *     a "review" / "reviewed" dot next to the name.
 *
 * Switching locale calls `router.replace(pathname, { locale })`, which
 * preserves the current page and updates the URL prefix. Preference is
 * cached in localStorage as `preferredLocale` so a subsequent visit to
 * `/` redirects to the chosen locale (handled in proxy fallback —
 * deferred to a future phase; for now we only persist the value).
 */
export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click / escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (next: Locale) => {
    try {
      window.localStorage.setItem("preferredLocale", next);
    } catch {
      // localStorage may be unavailable (private mode); silently ignore.
    }
    setOpen(false);
    router.replace(pathname, { locale: next });
  };

  const activeMeta = localeMeta[locale];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("languageSelector")}
        className={`border-bone-cream/20 hover:border-brass text-bone-cream/85 hover:text-brass inline-flex items-center justify-center rounded-sm border px-2.5 py-1 transition-colors duration-200 ${
          compact ? "min-w-0" : "min-w-[3.25rem]"
        }`}
        data-hover
      >
        <Caption uppercase className="tracking-[0.12em]">
          {activeMeta.code}
        </Caption>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("languageSelector")}
          className="bg-navy-deep/95 border-bone-cream/15 absolute right-0 top-full z-50 mt-2 w-[16rem] rounded-sm border p-2 shadow-lg backdrop-blur"
        >
          <ul>
            {locales.map((code) => {
              const meta = localeMeta[code];
              const active = code === locale;
              return (
                <li key={code}>
                  <button
                    type="button"
                    onClick={() => select(code)}
                    role="option"
                    aria-selected={active}
                    className={`group flex w-full items-center justify-between rounded-sm px-3 py-2 text-left transition-colors duration-150 ${
                      active
                        ? "bg-brass/10 text-brass"
                        : "text-bone-cream/85 hover:bg-bone-cream/5 hover:text-bone-cream"
                    }`}
                    data-hover
                  >
                    <span className="flex flex-col">
                      <span className="font-editorial text-[0.95rem] leading-none">
                        {meta.native}
                      </span>
                      <span className="text-bone-cream/45 mt-1 text-[0.7rem] uppercase tracking-[0.12em]">
                        {meta.english}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={`ml-3 h-1.5 w-1.5 rounded-full ${
                        meta.tier1Reviewed ? "bg-brass" : "bg-bone-cream/35"
                      }`}
                      title={
                        meta.tier1Reviewed
                          ? "Reviewed by a native speaker"
                          : "Machine-assisted; awaiting native review"
                      }
                    />
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="text-bone-cream/45 mt-2 border-t border-bone-cream/10 px-3 pt-2 text-[0.68rem] italic leading-snug">
            {t("languageSelectorFooter")}
          </p>
        </div>
      )}
    </div>
  );
}
