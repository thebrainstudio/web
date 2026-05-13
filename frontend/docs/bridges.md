# Bridges

The Bridges page is the synthesizing index between the site's neuroscience and depth-psychology layers. Eleven sections; the four-step empirical-correspondence scale; the discipline of naming what does not bridge as clearly as what does.

## The four-step strength scale

Every bridge between a neural mechanism and a depth-psychological concept is rated:

| Strength | Meaning |
|---|---|
| **tight** | Clear empirical correspondence; contemporary consensus across multiple peer-reviewed sources. |
| **partial** | Real correspondence but contested, or limited to one aspect of the depth-psychological concept. |
| **distant** | Shares territory but the mapping is loose; primarily metaphorical or phenomenological. |
| **none** | No honest empirical bridge exists; the two languages are addressing different questions. |

The rating system is enforced visually on the Bridges page (via `BridgeStrengthBadge`) and propagated through the rest of the site (the bridge cards on Atlas Thread sections). When a rating appears, it carries the same meaning everywhere.

## The eleven sections

Defined in `BRIDGE_SECTIONS` in `lib/bridges.ts`:

1. **What this page is for** — framing.
2. **The Default Mode Network and the self-representational system** — tight. The strongest bridge on the site.
3. **Implicit cognition and the unconscious** — tight. Broad empirical case for unconscious processing.
4. **Memory reconstruction and the past as remade** — tight. The cleanest convergence.
5. **The salience network and numinosity** — partial.
6. **DMN deactivation and ego dissolution / individuation** — partial. Psychedelic and contemplative neuroscience.
7. **Affective neuroscience and primary emotional systems** — partial. Panksepp and Solms.
8. **Embodied cognition and the body in depth psychology** — partial.
9. **Where the bridges fail** — none. The most important section on the page.
10. **What this means for how to read the site** — practical guide.
11. **A closing reflection** — the editorial position.

## File layout

```
content/bridges/
  sections.ts           # the 11 BridgeSectionContent records

lib/
  bridges.ts            # BridgeStrength + BRIDGE_SECTIONS + REGION_BRIDGE_LINKS
  citations.ts          # all PubMed-verified citations

components/bridges/
  BridgeStrengthBadge.tsx  # the rating badge used everywhere

app/[locale]/bridges/
  page.tsx              # the rendered Bridges page
```

## Authoring discipline

The Bridges page is the most-read content on the site. Every empirical claim cites a peer-reviewed primary source. Citations are verified against PubMed before they enter the registry — DOIs are exact, author lists complete, journal/volume/page details intact.

When you add or revise a bridge claim:

1. Find the canonical primary source for the empirical side. Prefer reviews when they exist (Buckner, Andrews-Hanna & Schacter 2008 for DMN; Patterson, Nestor & Rogers 2007 for ATL semantic hub; etc.).
2. Verify against PubMed. The mcp tool `mcp__77060d1e-…__get_article_metadata` is the standard route; it returns exact citation metadata.
3. Add the citation to `lib/citations.ts` keyed by a memorable id.
4. Add the `[cite:id]` inline marker in the prose.
5. Update the section's strength rating if the new evidence changes it.

## How to add a new bridge

A new section requires:

1. A new `BridgeSectionId` in `lib/bridges.ts`.
2. A new entry in `BRIDGE_SECTIONS` with heading, strength, optional subtitle.
3. A new entry in `bridgeSectionContent` in `content/bridges/sections.ts` with the prose blocks (text paragraphs, block-quotes, optional internal headings).
4. Optional: update `REGION_BRIDGE_LINKS` to point one or more Atlas regions at the new section.
5. Optional: update `lib/searchIndex.ts` so the new section is searchable by Cmd-K.

## Where bridges fail

Section 9 is the centerpiece of the page's intellectual honesty. The named failures (synchronicity, the strong-version collective unconscious, specific archetypal contents as neural categories, active imagination as transformative practice, Jung's late mystical-religious synthesis, the transpersonal Self) are not failures of either field. They are honest acknowledgments that depth psychology and neuroscience address overlapping but distinct domains.

The site's discipline is to name these clearly. When in doubt about whether to extend a bridge claim into territory that doesn't bridge, don't.

## Voice

The Bridges page does not write in the voice of either side. It writes from outside both, holding both languages as partial.

Avoid:
- "Neuroscience has proven Jung right …"
- "Depth psychology is just neuroscience under another name …"
- "Quantum consciousness …" / "The brain is an antenna …" / "Energy fields …"
- Hard reductionism ("you are your brain") or hard separationism ("the mind is independent of the brain").

Prefer:
- "Parts of what Jung called the Self …"
- "An empirical face for what …"
- "The bridge does not capture …" (followed by the specific limit).
- Naming the rating and explaining why.

## Cross-references this layer hosts

- Bridges → Atlas (via section-specific links to the regions each bridge engages)
- Bridges ← Atlas (via the bridge-strength cards under each Thread section)
- Bridges → Field Notes (via the "Related bridge" card on each Field Notes essay)
- Bridges → Depth Psychology long-form pages (Aion, Red Book, Gestalt link into their relevant Bridges sections)
- Bridges → Tours (the relevant tour for each tight-bridge section)
