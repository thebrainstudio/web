# The Region Atlas

The Atlas is the site's reference layer. Twenty pages, one per region we
surface in the rest of the site. The data flows from a single shared
registry into every UI surface that references regions.

## The seven sections per page

Each page renders the same structure, in this order:

1. **Anatomy & landmarks** — boundaries, key gross-anatomical features, atlas indices when available.
2. **Function** — what the region is implicated in. Hedged appropriately; "involved in," not "responsible for."
3. **Cell types** — principal cellular composition with links into the Cellular View.
4. **Connections** — white-matter tracts and short-range cortical pathways with cross-reference to the Connectome layer.
5. **Clinical context** — disorders in which the region is implicated, with the careful clinical caveats.
6. **History of discovery** — a researcher, a year, a paper. The page names the human who first noticed.
7. **The thread** — the depth-psychological gloss, pulled from `lib/regions.ts`. Some regions explicitly decline this section (the auditory mechanism pages); the discipline of declining is the point.

Beneath the thread, when the region has a `REGION_BRIDGE_LINKS` mapping in `lib/bridges.ts`, a bridge-strength card appears linking the region to the matching Bridges section. The strength is one of `tight | partial | distant | none`.

The sidebar carries the Yeo network membership, adjacent regions, disorder list, cell types, the Connectome panel (toggle white-matter tracts), and the full numbered citation list for the page's prose.

## File layout

```
content/atlas/
  index.ts              # registry; imports each per-region module
  hipp_left.ts          # one file per region; exports AtlasEntry
  ifg_left.ts
  …                     # one per RegionId in lib/regions.ts

lib/
  atlas.ts              # AtlasEntry + AtlasSection types,
                        # Yeo network info, [cite:id] parser,
                        # citation aggregation helpers
  regions.ts            # 20-region registry (single source of truth)
  bridges.ts            # REGION_BRIDGE_LINKS mapping
  citations.ts          # citation registry (referenced by [cite:id])
```

## Citation discipline

Every functional claim in the Atlas prose cites a peer-reviewed primary source. Citations live in `lib/citations.ts` keyed by id, and are referenced inline in the prose with `[cite:id]` markers. The `<Prose>` renderer (`components/atlas/Prose.tsx`) parses these into numbered brass superscripts with hover popovers showing the full reference.

When you add a new functional claim:

1. Pick the canonical primary source. Reviews are acceptable; popular-press summaries are not.
2. Verify the citation against PubMed (or the original journal record) before adding to `lib/citations.ts`. The DOI must be exact.
3. Add the inline `[cite:id]` marker in the prose.

If a claim cannot be cited cleanly, drop the claim or downgrade the section's confidence ("implicated in" with no specific claim).

## The Yeo network mapping

Regions are grouped by their Yeo 7-network membership (plus a "Auditory" group we separate for clarity). The mapping drives the Atlas index page's grouping and the per-region accent color. See `lib/atlas.ts` for the `YEO_NETWORKS` registry.

## Adding a new region

The 20-region scope is intentional. Don't add a new region casually — it has to justify its existence by being central to TRIBE's prediction surface and to the depth-psychological territory the site is mapping.

If you do add one:

1. Add it to the `RegionId` union in `lib/regions.ts` and to the `regions` array with all required fields (anatomyName, scienceGloss, poeticGloss, theThread, citationIds, position).
2. Add a translation entry under `regions.<id>` in every locale message file.
3. Create `content/atlas/<id>.ts` with the full seven-section content and register it in `content/atlas/index.ts`.
4. Add a `REGION_BRIDGE_LINKS` entry in `lib/bridges.ts` if the region engages a Bridges section.
5. Add region-specific keywords to `REGION_KEYWORDS` in `lib/searchIndex.ts`.
6. Run `pnpm run build` to verify generateStaticParams picks up the new region across all locales.

## Voice and tone

The Atlas is the site's most-cited content. Voice is hedged, careful, never mystifying, never reductive. Per-region pages can be 600–900 words; the auditory-mechanism pages (HG-L, HG-R) are deliberately briefer because the mechanism is clean and the thread is declined.

Avoid:
- "The seat of …" / "responsible for …" / "the region for …"
- Pop-neuroscience tropes (lizard brain, left/right brain creativity, the amygdala as the fear center).
- Adding region-specific Jungian content that doesn't cleanly map.

Prefer:
- "Implicated in …" / "centrally involved in …" / "consistently recruited during …"
- Named researchers and named papers.
- Hedging on hemispheric asymmetries — they are real but should not be overstated.

## Status flag

Each `AtlasEntry` has a `status` field: `complete` or `in-progress`. Complete pages render their full prose with citations. In-progress pages render the architecture (sidebar, breadcrumb, network membership) with a "Under careful review" banner and empty-section placeholders.

As of the current shipping state, all 20 regions are `complete`.

## Cross-references this layer hosts

- Atlas → Cellular View (via the "Descend to cellular view" link in the Cell Types section)
- Atlas → Bridges (via the bridge-strength card under each Thread)
- Atlas → Tours (via the `relatedTours` field; surfaced in the sidebar)
- Atlas → Connectome (via the sidebar Connectome panel; tracts in `lib/tracts.ts`)
- Atlas index → grouped by Yeo network with accent colors from `YEO_NETWORKS`
