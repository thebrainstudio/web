"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BRIDGE_SECTIONS,
  BRIDGE_STRENGTHS,
  REGION_BRIDGE_LINKS,
  type BridgeStrength,
  type BridgeSectionId,
} from "@/lib/bridges";
import { regions, regionById, type RegionId } from "@/lib/regions";
import { YEO_NETWORKS } from "@/lib/atlas";
import { Caption, Heading, Mono } from "@/components/typography/Typography";
import { easeStandard } from "@/lib/animations";

/**
 * Pure-SVG node-link diagram summarizing every region → bridge-section
 * mapping at a glance.
 *
 *   Left column   — 20 regions, grouped vertically by Yeo network.
 *   Right column  — the Bridges sections that any region points into,
 *                   in the canonical section order.
 *   Edges         — one per region, weighted and colored by strength.
 *                   tight: brass, full opacity, thicker, solid
 *                   partial: bone-cream, 70% opacity, thinner, solid
 *                   distant: bone-cream, 30% opacity, dashed
 *                   none: not rendered (the absence is the statement)
 *
 *   Hover an edge → highlight the connected region + section nodes.
 *   Hover a node  → highlight all connected edges and the other side.
 *   Click an edge → navigate to the target Bridges section.
 *
 * No D3 dependency. Layout is fixed (vertical lists with computed y
 * positions); curves are quadratic Bezier with control points offset
 * horizontally toward the middle of the diagram.
 */

// Layout constants — tuned for legibility at the widths the Bridges
// page and depth-psychology landing use.
const SVG_WIDTH = 880;
const NODE_HEIGHT = 26;
const NODE_GAP = 4;
const NETWORK_GAP = 18; // extra space between Yeo network groups
const COLUMN_PAD_X = 220; // text width for node labels
const SECTION_LABEL_WIDTH = 320;

type StrengthFilter = "all" | "tight" | "partial-plus" | "weak-only";

export default function BridgesNetwork({
  variant = "full",
}: {
  variant?: "full" | "compact";
}) {
  const t = useTranslations("bridges");
  const tRegions = useTranslations("regions");
  const router = useRouter();

  const [filter, setFilter] = useState<StrengthFilter>("all");
  const [hoveredRegion, setHoveredRegion] = useState<RegionId | null>(null);
  const [hoveredSection, setHoveredSection] =
    useState<BridgeSectionId | null>(null);

  // Build the edge list once. Each region has at most one bridge link;
  // we filter by the strength selection below.
  const edges = useMemo(() => {
    const out: Array<{
      regionId: RegionId;
      sectionId: BridgeSectionId;
      strength: BridgeStrength;
    }> = [];
    for (const r of regions) {
      const link = REGION_BRIDGE_LINKS[r.id];
      if (!link) continue;
      if (link.strength === "none") continue;
      out.push({ regionId: r.id, sectionId: link.section, strength: link.strength });
    }
    return out;
  }, []);

  // The right column only shows sections that at least one region
  // currently points to under the active filter. Keeps the diagram
  // tight and prevents orphan section nodes.
  const visibleEdges = useMemo(() => {
    return edges.filter((e) => matchesFilter(e.strength, filter));
  }, [edges, filter]);

  const visibleSectionIds = useMemo(() => {
    const seen = new Set<BridgeSectionId>();
    for (const e of visibleEdges) seen.add(e.sectionId);
    return BRIDGE_SECTIONS.map((s) => s.id).filter((id) => seen.has(id));
  }, [visibleEdges]);

  // Compute layout positions for region nodes (left) grouped by Yeo
  // network, and section nodes (right) in canonical order. Returns a
  // map from id → { x, y } so the renderer can read them out.
  const layout = useMemo(() => {
    // Group regions by Yeo network so each network's regions sit
    // together visually. Order networks as they appear in the Atlas
    // index page.
    const networkOrder = [
      "FrontoparietalControl",
      "Auditory",
      "DefaultMode",
      "Limbic",
      "VentralAttention",
      "DorsalAttention",
      "Somatomotor",
      "Visual",
    ] as const;
    const byNetwork: Record<string, RegionId[]> = {};
    for (const r of regions) {
      const network = networkFor(r.id);
      byNetwork[network] ??= [];
      byNetwork[network].push(r.id);
    }
    const regionPositions: Record<RegionId, { x: number; y: number }> = {} as Record<
      RegionId,
      { x: number; y: number }
    >;
    let y = 28;
    for (const net of networkOrder) {
      const list = byNetwork[net];
      if (!list || list.length === 0) continue;
      for (const id of list) {
        regionPositions[id] = { x: COLUMN_PAD_X, y };
        y += NODE_HEIGHT + NODE_GAP;
      }
      y += NETWORK_GAP;
    }
    const leftColumnHeight = y;

    // Distribute the visible sections vertically with even spacing
    // across the same total height. Sections do not need to align
    // with regions — the curves arc between them.
    const sectionPositions: Record<string, { x: number; y: number }> = {};
    const sectionCount = visibleSectionIds.length;
    const usableHeight = leftColumnHeight - 32;
    const sectionStep =
      sectionCount > 1 ? usableHeight / (sectionCount - 1) : 0;
    visibleSectionIds.forEach((id, i) => {
      sectionPositions[id] = {
        x: SVG_WIDTH - SECTION_LABEL_WIDTH - 16,
        y: 28 + i * sectionStep,
      };
    });

    return {
      regions: regionPositions,
      sections: sectionPositions,
      networkOrder,
      byNetwork,
      totalHeight: leftColumnHeight,
    };
  }, [visibleSectionIds]);

  const isEdgeHighlighted = (e: typeof edges[number]): boolean => {
    if (!hoveredRegion && !hoveredSection) return false;
    return e.regionId === hoveredRegion || e.sectionId === hoveredSection;
  };

  const isAnythingHovered = hoveredRegion !== null || hoveredSection !== null;

  const filterButtons: Array<{ id: StrengthFilter; labelKey: string }> = [
    { id: "all", labelKey: "network.filter.all" },
    { id: "tight", labelKey: "network.filter.tightOnly" },
    { id: "partial-plus", labelKey: "network.filter.tightAndPartial" },
    { id: "weak-only", labelKey: "network.filter.distantOnly" },
  ];

  return (
    <section className="relative">
      <div className="mx-auto max-w-[1100px]">
        {variant === "full" && (
          <>
            <Caption uppercase className="text-brass tracking-[0.22em]">
              {t("network.label")}
            </Caption>
            <Heading as="h2" className="mt-4 font-[200] max-w-[36rem]">
              {t("network.heading")}
            </Heading>
            <Caption italic className="text-bone-cream/55 mt-4 block max-w-[42rem]">
              {t("network.intro")}
            </Caption>
          </>
        )}
        {variant === "compact" && (
          <>
            <Caption uppercase className="text-brass tracking-[0.22em]">
              {t("network.label")}
            </Caption>
            <Caption italic className="text-bone-cream/55 mt-2 block max-w-[36rem]">
              {t("network.compactIntro")}
            </Caption>
          </>
        )}

        {/* Strength legend + filter */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            {(["tight", "partial", "distant"] as const).map((s) => (
              <span key={s} className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block"
                  style={{
                    width: 18,
                    height: 2,
                    background: edgeColor(s),
                    opacity: edgeOpacity(s),
                    borderStyle: s === "distant" ? "dashed" : undefined,
                  }}
                />
                <Caption className="text-bone-cream/60">
                  {BRIDGE_STRENGTHS[s].label}
                </Caption>
              </span>
            ))}
          </div>
          <span className="text-bone-cream/15 hidden sm:inline">|</span>
          <div className="flex flex-wrap items-center gap-3">
            {filterButtons.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setFilter(b.id)}
                data-hover
                className={`rounded-sm border px-3 py-1 transition-colors duration-150 ${
                  filter === b.id
                    ? "border-brass text-brass"
                    : "border-bone-cream/15 text-bone-cream/60 hover:text-bone-cream/85"
                }`}
              >
                <Mono variant="label" className="tracking-[0.18em]">
                  {t(b.labelKey)}
                </Mono>
              </button>
            ))}
          </div>
        </div>

        {/* Diagram */}
        <div className="relative mt-10 overflow-x-auto">
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${layout.totalHeight}`}
            width="100%"
            height={layout.totalHeight}
            role="img"
            aria-label={t("network.svgLabel")}
            className="block"
          >
            {/* Edges first, so labels render over them */}
            <g aria-hidden>
              {edges.map((e) => {
                const visible = matchesFilter(e.strength, filter);
                const highlighted = isEdgeHighlighted(e);
                const dimmed =
                  isAnythingHovered && !highlighted && visible;
                const start = layout.regions[e.regionId];
                const end = layout.sections[e.sectionId];
                if (!start || !end) return null;
                const d = edgePath(start, end);
                const baseOpacity = edgeOpacity(e.strength);
                const opacity = !visible
                  ? 0
                  : dimmed
                    ? baseOpacity * 0.18
                    : highlighted
                      ? Math.min(1, baseOpacity + 0.35)
                      : baseOpacity;
                return (
                  <motion.path
                    key={`${e.regionId}::${e.sectionId}`}
                    d={d}
                    stroke={edgeColor(e.strength)}
                    strokeWidth={
                      e.strength === "tight"
                        ? highlighted
                          ? 2.5
                          : 1.6
                        : e.strength === "partial"
                          ? highlighted
                            ? 1.8
                            : 1.1
                          : highlighted
                            ? 1.4
                            : 0.9
                    }
                    fill="none"
                    strokeDasharray={
                      e.strength === "distant" ? "5 4" : undefined
                    }
                    initial={false}
                    animate={{ opacity }}
                    transition={{ duration: 0.22, ease: easeStandard }}
                    style={{ cursor: visible ? "pointer" : "default" }}
                    onMouseEnter={() => {
                      if (!visible) return;
                      setHoveredRegion(e.regionId);
                      setHoveredSection(e.sectionId);
                    }}
                    onMouseLeave={() => {
                      setHoveredRegion(null);
                      setHoveredSection(null);
                    }}
                    onClick={() => {
                      if (!visible) return;
                      router.push(`/bridges#${e.sectionId}` as never);
                    }}
                  />
                );
              })}
            </g>

            {/* Left column — regions */}
            {Object.entries(layout.regions).map(([rid, pos]) => {
              const regionId = rid as RegionId;
              const region = regionById[regionId];
              const link = REGION_BRIDGE_LINKS[regionId];
              const strength = link?.strength ?? "none";
              const visibleInFilter =
                strength !== "none" && matchesFilter(strength, filter);
              const highlighted = hoveredRegion === regionId;
              const dimmed =
                (hoveredRegion !== null && hoveredRegion !== regionId) ||
                !visibleInFilter;
              return (
                <g
                  key={`r:${regionId}`}
                  onMouseEnter={() => setHoveredRegion(regionId)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  style={{ cursor: "pointer" }}
                >
                  <Link href={`/atlas/${regionId}` as never} prefetch>
                    <g>
                      <circle
                        cx={pos.x + 4}
                        cy={pos.y}
                        r={4}
                        fill={
                          strength === "tight"
                            ? "#c9a961"
                            : strength === "partial"
                              ? "rgba(240, 232, 216, 0.6)"
                              : "rgba(240, 232, 216, 0.3)"
                        }
                        opacity={dimmed ? 0.35 : 1}
                      />
                      <text
                        x={pos.x - 8}
                        y={pos.y + 4}
                        textAnchor="end"
                        fontFamily="serif"
                        fontSize={12}
                        fill={
                          highlighted ? "#c9a961" : "rgba(240, 232, 216, 0.78)"
                        }
                        opacity={dimmed ? 0.45 : 1}
                        className="font-editorial"
                      >
                        {tRegions(`${regionId}.displayName`)}
                      </text>
                    </g>
                  </Link>
                </g>
              );
            })}

            {/* Right column — sections */}
            {visibleSectionIds.map((sid) => {
              const pos = layout.sections[sid];
              const section = BRIDGE_SECTIONS.find((s) => s.id === sid);
              if (!pos || !section) return null;
              const highlighted = hoveredSection === sid;
              const dimmed =
                hoveredSection !== null && hoveredSection !== sid;
              return (
                <g
                  key={`s:${sid}`}
                  onMouseEnter={() => setHoveredSection(sid)}
                  onMouseLeave={() => setHoveredSection(null)}
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/bridges#${sid}` as never)}
                >
                  <circle
                    cx={pos.x - 4}
                    cy={pos.y}
                    r={5}
                    fill={
                      section.strength === "tight"
                        ? "#c9a961"
                        : section.strength === "partial"
                          ? "rgba(240, 232, 216, 0.65)"
                          : section.strength === "distant"
                            ? "rgba(240, 232, 216, 0.35)"
                            : "rgba(139, 58, 58, 0.65)"
                    }
                    opacity={dimmed ? 0.35 : 1}
                  />
                  <text
                    x={pos.x + 8}
                    y={pos.y + 4}
                    fontFamily="serif"
                    fontSize={12}
                    fill={
                      highlighted ? "#c9a961" : "rgba(240, 232, 216, 0.82)"
                    }
                    opacity={dimmed ? 0.45 : 1}
                    className="font-editorial"
                  >
                    {truncateLabel(section.heading)}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip for the currently hovered edge */}
          <AnimatePresence>
            {hoveredRegion && hoveredSection && (
              <EdgeTooltip
                regionId={hoveredRegion}
                sectionId={hoveredSection}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function EdgeTooltip({
  regionId,
  sectionId,
}: {
  regionId: RegionId;
  sectionId: BridgeSectionId;
}) {
  const tRegions = useTranslations("regions");
  const section = BRIDGE_SECTIONS.find((s) => s.id === sectionId);
  const link = REGION_BRIDGE_LINKS[regionId];
  if (!section || !link) return null;
  const strengthInfo = BRIDGE_STRENGTHS[link.strength];
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18, ease: easeStandard }}
      className="bg-navy-deep/95 border-bone-cream/15 pointer-events-none absolute left-1/2 top-2 z-[10] mx-auto block w-[24rem] max-w-[80%] -translate-x-1/2 rounded-sm border px-4 py-3 shadow-xl backdrop-blur"
    >
      <Mono variant="label" className="text-brass tracking-[0.18em] block">
        {strengthInfo.label.toUpperCase()}
      </Mono>
      <Caption className="text-bone-cream/90 mt-1 block">
        {tRegions(`${regionId}.displayName`)}
        <span className="text-bone-cream/50"> · </span>
        {section.heading}
      </Caption>
      <Caption italic className="text-bone-cream/60 mt-1 block">
        {strengthInfo.description}
      </Caption>
    </motion.div>
  );
}

function networkFor(regionId: RegionId): string {
  // Read directly from the Atlas entries' Yeo network mapping. Avoid
  // pulling in the full atlas module here — duplicate the small table
  // to keep this component dependency-light.
  return REGION_NETWORK[regionId] ?? "DefaultMode";
}

const REGION_NETWORK: Partial<Record<RegionId, string>> = {
  ifg_left: "FrontoparietalControl",
  ifg_right: "FrontoparietalControl",
  dmpfc: "FrontoparietalControl",
  pstg_left: "Auditory",
  pstg_right: "Auditory",
  hg_left: "Auditory",
  hg_right: "Auditory",
  mtg_left: "DefaultMode",
  mtg_right: "DefaultMode",
  atl_left: "DefaultMode",
  atl_right: "DefaultMode",
  agl_left: "DefaultMode",
  agl_right: "DefaultMode",
  vmpfc: "DefaultMode",
  pcc: "DefaultMode",
  precuneus: "DefaultMode",
  amyg_left: "Limbic",
  amyg_right: "Limbic",
  hipp_left: "Limbic",
  hipp_right: "Limbic",
};

function edgePath(
  start: { x: number; y: number },
  end: { x: number; y: number },
): string {
  const midX = (start.x + end.x) / 2;
  // Use cubic Bezier with horizontal control segments so the curve
  // leaves the left column going right and enters the right column
  // coming from the left.
  return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
}

function edgeColor(strength: BridgeStrength): string {
  switch (strength) {
    case "tight":
      return "#c9a961";
    case "partial":
      return "#f0e8d8";
    case "distant":
      return "#f0e8d8";
    default:
      return "#8b3a3a";
  }
}

function edgeOpacity(strength: BridgeStrength): number {
  switch (strength) {
    case "tight":
      return 0.9;
    case "partial":
      return 0.55;
    case "distant":
      return 0.3;
    default:
      return 0;
  }
}

function matchesFilter(strength: BridgeStrength, filter: StrengthFilter): boolean {
  if (strength === "none") return false;
  if (filter === "all") return true;
  if (filter === "tight") return strength === "tight";
  if (filter === "partial-plus") return strength === "tight" || strength === "partial";
  if (filter === "weak-only") return strength === "distant";
  return true;
}

function truncateLabel(label: string, max = 38): string {
  if (label.length <= max) return label;
  return label.slice(0, max - 1) + "…";
}
