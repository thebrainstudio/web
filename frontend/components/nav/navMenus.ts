/**
 * Nav mega-menu data — four grouped panels that replace the old
 * single "Sections" dropdown. Each group has its own identity and
 * tagline so the menu reads as a layered map of the site rather
 * than an alphabetical dump.
 *
 *   rooms       — encoder rooms (live brain reacting)
 *   literature  — depth-psychology + canonical literary rooms
 *   depth       — long-form essays + bridges + depth-psychology subpages
 *   instrument  — reference layer (atlas + tours)
 *
 * `labelKey` reads from the existing flat `nav.<key>` namespace so
 * we don't duplicate "Mirror"/"Music"/etc strings. `blurbKey` reads
 * from `nav.menus.<groupId>.blurbs.<key>` — the per-item micro-
 * tagline shown inside the panel.
 */

export type NavMenuItem = {
  href: string;
  labelKey: string;
  blurbKey: string;
};

export type NavMenuGroupId = "rooms" | "literature" | "depth" | "instrument";

export type NavMenuGroup = {
  id: NavMenuGroupId;
  items: NavMenuItem[];
};

export const navMenus: NavMenuGroup[] = [
  {
    id: "rooms",
    items: [
      { href: "/mirror", labelKey: "mirror", blurbKey: "mirror" },
      { href: "/music", labelKey: "music", blurbKey: "music" },
      {
        href: "/crosscultural",
        labelKey: "crosscultural",
        blurbKey: "crosscultural",
      },
      { href: "/cellular", labelKey: "cellular", blurbKey: "cellular" },
    ],
  },
  {
    id: "literature",
    items: [
      { href: "/threshold", labelKey: "threshold", blurbKey: "threshold" },
      { href: "/archetypes", labelKey: "archetypes", blurbKey: "archetypes" },
      { href: "/faust", labelKey: "faust", blurbKey: "faust" },
      { href: "/dante", labelKey: "dante", blurbKey: "dante" },
    ],
  },
  {
    id: "depth",
    items: [
      { href: "/bridges", labelKey: "bridges", blurbKey: "bridges" },
      {
        href: "/field-notes",
        labelKey: "fieldNotes",
        blurbKey: "fieldNotes",
      },
      {
        href: "/depth-psychology",
        labelKey: "depthPsychology",
        blurbKey: "depthPsychology",
      },
      {
        href: "/depth-psychology/aion",
        labelKey: "aion",
        blurbKey: "aion",
      },
      {
        href: "/depth-psychology/red-book",
        labelKey: "redBook",
        blurbKey: "redBook",
      },
      {
        href: "/depth-psychology/gestalt",
        labelKey: "gestalt",
        blurbKey: "gestalt",
      },
    ],
  },
  {
    id: "instrument",
    items: [
      { href: "/atlas", labelKey: "atlas", blurbKey: "atlas" },
      { href: "/tours", labelKey: "tours", blurbKey: "tours" },
      // Encoder Lab is a TRIBE-demo room, not one of the eight numbered
      // cinematic rooms — it belongs in the reference layer alongside
      // Atlas + Tours + Site Map.
      { href: "/encoder", labelKey: "encoder", blurbKey: "encoder" },
      // PR 7: the /map page sits in the Instrument group — same
      // register as Atlas + Tours, the reference layer.
      { href: "/map", labelKey: "siteMap", blurbKey: "siteMap" },
    ],
  },
];

/** Flat list of all menu items (mobile sheet uses this). */
export const allMenuItems: NavMenuItem[] = navMenus.flatMap((g) => g.items);
