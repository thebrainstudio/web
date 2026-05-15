"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import {
  searchEntries,
  searchIndex,
  type SearchEntry,
  type SearchKind,
} from "@/lib/searchIndex";
import { Caption, Mono } from "@/components/typography/Typography";
import { easeStandard } from "@/lib/animations";

/**
 * Cmd/Ctrl-K search palette. Mounted once at the root shell. Opens on
 * keyboard shortcut, closes on Escape, supports arrow-key navigation
 * through filtered results, and routes to the selected entry through
 * the i18n-aware router so the result preserves the active locale.
 *
 * The palette is keyboard-first: the user can type a region name, a
 * researcher's surname, a disorder, a Jungian concept — anything in
 * `lib/searchIndex.ts`. Mouse use is supported but the visual
 * affordance leans on the keyboard interaction.
 *
 * Empty state (no query yet): show a small selection of suggested
 * entries grouped by kind, so the user can browse without typing.
 */

const KIND_LABEL: Record<SearchKind, string> = {
  room: "Room",
  region: "Region",
  bridge: "Bridge",
  essay: "Essay",
  concept: "Concept",
  tour: "Tour",
};

const KIND_ORDER: SearchKind[] = ["region", "bridge", "tour", "room", "essay", "concept"];

// Suggested entries when no query is typed. Hand-picked so the
// empty palette is a small tour of what's reachable.
const SUGGESTED_IDS = new Set([
  "room:mirror",
  "room:atlas",
  "room:bridges",
  "region:hipp_left",
  "region:pcc",
  "region:ifg_left",
  "bridge:dmn-and-self-system",
  "bridge:memory-reconstruction",
  "bridge:where-bridges-fail",
  "concept:individuation",
  "concept:numinous",
]);

function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPod|iPad/i.test(navigator.platform);
}

export default function SearchPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global keyboard listener for the Cmd/Ctrl-K shortcut and Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isOpenShortcut =
        (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isOpenShortcut) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Custom event so the SiteHeader button can pop the palette without
  // duplicating the open/close state. Trade-off: a single side-effect
  // boundary rather than lifting state up into a provider.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("brain-studio:open-search", onOpen);
    return () =>
      window.removeEventListener("brain-studio:open-search", onOpen);
  }, []);

  // Focus the input on open; reset state on close.
  useEffect(() => {
    if (open) {
      const handle = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(handle);
    } else {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  // Compute results. Empty query → suggested set. Non-empty → filtered.
  const results = useMemo<SearchEntry[]>(() => {
    if (query.trim().length === 0) {
      return searchIndex.filter((e) => SUGGESTED_IDS.has(e.id));
    }
    return searchEntries(query, 14);
  }, [query]);

  // Group results for the in-flight list (visually clearer than a
  // flat list when there are many kinds in play).
  const grouped = useMemo(() => {
    const map: Record<SearchKind, SearchEntry[]> = {
      region: [],
      bridge: [],
      room: [],
      essay: [],
      concept: [],
      tour: [],
    };
    for (const r of results) map[r.kind].push(r);
    return map;
  }, [results]);

  // Flat list for keyboard nav (group order matches KIND_ORDER).
  const flat = useMemo<SearchEntry[]>(() => {
    const out: SearchEntry[] = [];
    for (const k of KIND_ORDER) for (const e of grouped[k]) out.push(e);
    return out;
  }, [grouped]);

  // Keep `active` within bounds when results change.
  useEffect(() => {
    if (active >= flat.length) setActive(Math.max(0, flat.length - 1));
  }, [flat.length, active]);

  const choose = (entry: SearchEntry) => {
    setOpen(false);
    // i18n router handles locale prefix automatically.
    router.push(entry.href as never);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(flat.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const entry = flat[active];
      if (entry) choose(entry);
    }
  };

  // Scroll active entry into view.
  useEffect(() => {
    if (!open || flat.length === 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-result-index="${active}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open, flat.length]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search The Brain Studio"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: easeStandard }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh]"
        >
          {/* Scrim */}
          <button
            type="button"
            aria-label="Close search"
            className="bg-navy-deep/75 absolute inset-0 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: easeStandard }}
            className="bg-indigo-smoke/95 border-bone-cream/15 relative mx-4 w-full max-w-[44rem] rounded-sm border shadow-2xl backdrop-blur"
          >
            {/* Input row */}
            <div className="border-bone-cream/10 flex items-center gap-3 border-b px-5 py-4">
              <span aria-hidden className="text-brass text-lg leading-none">⌘K</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Region, researcher, Jungian concept, disorder…"
                className="placeholder:text-bone-cream/35 text-bone-cream w-full bg-transparent text-body outline-none font-editorial"
                aria-label="Search query"
                spellCheck={false}
                autoComplete="off"
              />
              <span className="text-bone-cream/70 hidden items-center gap-1.5 sm:flex">
                <Mono variant="label" className="border-bone-cream/15 rounded-sm border px-1.5 py-0.5">
                  Esc
                </Mono>
              </span>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="max-h-[60vh] overflow-y-auto px-2 py-3"
            >
              {query.trim().length === 0 ? (
                <Caption uppercase className="text-bone-cream/80 px-3 py-2 block tracking-[0.18em]">
                  Suggestions
                </Caption>
              ) : flat.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Caption className="text-bone-cream/85 italic block">
                    Nothing matches that yet. Try a researcher's surname, a region
                    name, or a Jungian concept.
                  </Caption>
                </div>
              ) : null}

              {KIND_ORDER.map((kind) => {
                const entries = grouped[kind];
                if (entries.length === 0) return null;
                const firstIdx = flat.indexOf(entries[0]);
                return (
                  <div key={kind} className="mb-4 last:mb-0">
                    {query.trim().length > 0 && (
                      <Caption
                        uppercase
                        className="text-bone-cream/80 px-3 py-1 block tracking-[0.18em]"
                      >
                        {KIND_LABEL[kind]}
                      </Caption>
                    )}
                    <ul role="listbox">
                      {entries.map((entry, i) => {
                        const idx = firstIdx + i;
                        const isActive = idx === active;
                        return (
                          <li key={entry.id} role="option" aria-selected={isActive}>
                            <button
                              type="button"
                              data-result-index={idx}
                              onClick={() => choose(entry)}
                              onMouseEnter={() => setActive(idx)}
                              className={`group flex w-full items-baseline gap-3 rounded-sm px-3 py-2.5 text-left transition-colors duration-100 ${
                                isActive
                                  ? "bg-brass/15 text-bone-cream"
                                  : "text-bone-cream/85 hover:bg-bone-cream/5"
                              }`}
                            >
                              <Mono
                                variant="label"
                                className={`shrink-0 ${
                                  isActive ? "text-brass" : "text-bone-cream/80"
                                }`}
                              >
                                {KIND_LABEL[entry.kind].toUpperCase()}
                              </Mono>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-baseline gap-2">
                                  <span
                                    className={`truncate ${
                                      entry.inProgress
                                        ? "text-bone-cream/85"
                                        : ""
                                    }`}
                                  >
                                    {entry.title}
                                  </span>
                                  {entry.inProgress && (
                                    <Mono variant="label" className="text-bone-cream/80 shrink-0">
                                      Under review
                                    </Mono>
                                  )}
                                </div>
                                {entry.subtitle && (
                                  <Caption className="text-bone-cream/50 mt-0.5 block truncate">
                                    {entry.subtitle}
                                  </Caption>
                                )}
                              </div>
                              <span
                                aria-hidden
                                className={`text-brass shrink-0 transition-opacity duration-100 ${
                                  isActive ? "opacity-100" : "opacity-0"
                                }`}
                              >
                                ↵
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-bone-cream/10 flex items-center justify-between gap-3 border-t px-5 py-3">
              <span className="text-bone-cream/70 inline-flex items-center gap-1.5">
                <Mono variant="label" className="border-bone-cream/15 rounded-sm border px-1.5 py-0.5">
                  ↑↓
                </Mono>
                <Caption className="text-bone-cream/50">to navigate</Caption>
                <Mono variant="label" className="border-bone-cream/15 ml-2 rounded-sm border px-1.5 py-0.5">
                  ↵
                </Mono>
                <Caption className="text-bone-cream/50">to select</Caption>
              </span>
              <Caption className="text-bone-cream/35 hidden sm:block">
                Press {isMac() ? "⌘" : "Ctrl"}+K anywhere
              </Caption>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
