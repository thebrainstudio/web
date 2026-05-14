"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Caption, Mono } from "@/components/typography/Typography";
import { regions, regionById, type RegionId } from "@/lib/regions";
import {
  siteMapRooms,
  siteMapLongForm,
  type SiteMapRoomId,
  type SiteMapLongFormId,
} from "@/lib/siteMap";
import { REGION_BRIDGE_LINKS } from "@/lib/bridges";

/**
 * Three-column catalog of the site map: Rooms (left), Regions
 * (center), Long form (right). Each card lists its cross-references
 * underneath. Hovering a card lights up the related cards in the
 * other two columns.
 *
 * Deliberately not a node-link diagram. BridgesNetwork already
 * carries the network-visualization aesthetic; /map serves a
 * different purpose — a catalog you can read in order, not a
 * picture you parse at a glance. Mobile collapses to a single
 * column with the same hover/highlight contract.
 */

type Highlight =
  | { kind: "room"; id: SiteMapRoomId }
  | { kind: "region"; id: RegionId }
  | { kind: "longform"; id: SiteMapLongFormId }
  | null;

export default function SiteMapColumns() {
  const t = useTranslations("nav");
  const tRegions = useTranslations("regions");
  const [highlight, setHighlight] = useState<Highlight>(null);

  // Pre-compute cross-references so each card can render its
  // related items without rebuilding the index on every hover.
  const regionToRooms = useMemo(() => {
    const m = new Map<RegionId, SiteMapRoomId[]>();
    for (const r of siteMapRooms) {
      for (const id of r.regionIds) {
        const xs = m.get(id) ?? [];
        xs.push(r.id);
        m.set(id, xs);
      }
    }
    return m;
  }, []);

  const regionToLongForm = useMemo(() => {
    const m = new Map<RegionId, SiteMapLongFormId[]>();
    for (const p of siteMapLongForm) {
      for (const id of p.regionIds) {
        const xs = m.get(id) ?? [];
        xs.push(p.id);
        m.set(id, xs);
      }
    }
    return m;
  }, []);

  // Membership tests — given the current highlight, is a row in
  // any column "lit"?
  const isLit = (kind: "room" | "region" | "longform", id: string) => {
    if (!highlight) return false;
    if (highlight.kind === "room" && kind === "room")
      return highlight.id === id;
    if (highlight.kind === "region" && kind === "region")
      return highlight.id === id;
    if (highlight.kind === "longform" && kind === "longform")
      return highlight.id === id;
    if (highlight.kind === "room" && kind === "region")
      return (
        siteMapRooms.find((r) => r.id === highlight.id)?.regionIds.includes(
          id as RegionId,
        ) ?? false
      );
    if (highlight.kind === "longform" && kind === "region")
      return (
        siteMapLongForm
          .find((p) => p.id === highlight.id)
          ?.regionIds.includes(id as RegionId) ?? false
      );
    if (highlight.kind === "region" && kind === "room")
      return regionToRooms.get(highlight.id)?.includes(id as SiteMapRoomId) ?? false;
    if (highlight.kind === "region" && kind === "longform")
      return (
        regionToLongForm.get(highlight.id)?.includes(id as SiteMapLongFormId) ??
        false
      );
    return false;
  };

  const cardClasses = (lit: boolean) =>
    `block rounded-sm border px-4 py-3 transition-colors duration-200 ${
      lit
        ? "border-brass/60 bg-brass/5 text-bone-cream"
        : highlight
          ? "border-bone-cream/5 text-bone-cream/40"
          : "border-bone-cream/10 text-bone-cream/85 hover:border-brass/40 hover:text-bone-cream"
    }`;

  return (
    <div
      className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8"
      onMouseLeave={() => setHighlight(null)}
    >
      {/* Column 1 — Rooms */}
      <div>
        <Caption uppercase className="text-brass mb-6 block tracking-[0.18em]">
          Rooms
        </Caption>
        <ul className="space-y-3">
          {siteMapRooms.map((room) => {
            const lit = isLit("room", room.id);
            return (
              <li
                key={room.id}
                onMouseEnter={() => setHighlight({ kind: "room", id: room.id })}
              >
                <Link href={room.href} data-hover className={cardClasses(lit)}>
                  <Caption uppercase className="tracking-[0.14em]">
                    {t(room.labelKey)}
                  </Caption>
                  <Mono
                    variant="label"
                    className={`mt-1 block ${lit ? "text-brass/80" : "text-bone-cream/45"}`}
                  >
                    {room.regionIds.slice(0, 4).join(" · ")}
                    {room.regionIds.length > 4 ? " · …" : ""}
                  </Mono>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Column 2 — Regions */}
      <div>
        <Caption uppercase className="text-brass mb-6 block tracking-[0.18em]">
          Regions
        </Caption>
        <ul className="space-y-2">
          {regions.map((region) => {
            const lit = isLit("region", region.id);
            const bridgeLink = REGION_BRIDGE_LINKS[region.id];
            const label = (() => {
              try {
                return tRegions(`${region.id}.label`);
              } catch {
                return region.id;
              }
            })();
            return (
              <li
                key={region.id}
                onMouseEnter={() =>
                  setHighlight({ kind: "region", id: region.id })
                }
              >
                <Link
                  href={`/atlas/${region.id}` as never}
                  data-hover
                  className={cardClasses(lit)}
                >
                  <Caption uppercase className="tracking-[0.14em]">
                    {label}
                  </Caption>
                  {bridgeLink && (
                    <Mono
                      variant="label"
                      className={`mt-1 block ${lit ? "text-brass/80" : "text-bone-cream/45"}`}
                    >
                      → {bridgeLink.section} ({bridgeLink.strength})
                    </Mono>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Column 3 — Long form */}
      <div>
        <Caption uppercase className="text-brass mb-6 block tracking-[0.18em]">
          Long form
        </Caption>
        <ul className="space-y-3">
          {siteMapLongForm.map((page) => {
            const lit = isLit("longform", page.id);
            return (
              <li
                key={page.id}
                onMouseEnter={() =>
                  setHighlight({ kind: "longform", id: page.id })
                }
              >
                <Link href={page.href as never} data-hover className={cardClasses(lit)}>
                  <Caption uppercase className="tracking-[0.14em]">
                    {(() => {
                      try {
                        return t(page.labelKey);
                      } catch {
                        return page.id;
                      }
                    })()}
                  </Caption>
                  <Mono
                    variant="label"
                    className={`mt-1 block ${lit ? "text-brass/80" : "text-bone-cream/45"}`}
                  >
                    {page.regionIds.slice(0, 4).join(" · ")}
                    {page.regionIds.length > 4 ? " · …" : ""}
                  </Mono>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
