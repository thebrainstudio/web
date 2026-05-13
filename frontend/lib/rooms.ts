/**
 * Room registry. The site is a sequence of "rooms", each a distinct
 * page with its own brain anchor, atmospheric mood, and door style.
 *
 * RoomId is derived from the URL pathname (locale-stripped). The
 * orchestrator uses this to look up:
 *   - the brain anchor it should glide toward on transition entry
 *     (`lib/brainAnchors.ts`),
 *   - the persistent atmospheric layer it should morph toward
 *     (`components/atmospheric/PersistentAtmosphere.tsx`),
 *   - and the door choreography style for the navigation
 *     (`transitionStyle()` below).
 *
 * Rooms also have a notional "depth" — surface (1), depth (2), cellular
 * (3) — which decides whether a transition is a Descend (deeper) or a
 * Return to Surface (shallower). The Cellular room is special: it gets
 * a longer pre-transition window and the persistent brain is hidden
 * while it is mounted.
 */

export type RoomId =
  | "home"
  | "mirror"
  | "music"
  | "crosscultural"
  | "threshold"
  | "archetypes"
  | "cellular"
  | "about"
  | "field-notes"
  | "atlas"
  | "bridges"
  | "tours";

export const ALL_ROOM_IDS: readonly RoomId[] = [
  "home",
  "mirror",
  "music",
  "crosscultural",
  "threshold",
  "archetypes",
  "cellular",
  "about",
  "field-notes",
  "atlas",
  "bridges",
  "tours",
];

/**
 * Strip the leading locale segment, then read the first path segment.
 * `/en/mirror/foo` and `/th/mirror/foo` both → `mirror`. `/en` and `/` → `home`.
 */
export function pathToRoomId(pathname: string | null | undefined): RoomId {
  if (!pathname) return "home";
  const trimmed = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!trimmed) return "home";
  const segments = trimmed.split("/");
  // i18n's usePathname() strips the locale already. The proxy locale prefix
  // never appears here. But the root layout also mounts this for raw
  // pathnames during SSR fallbacks — be defensive about a stray locale.
  const first = segments[0];
  const localeCandidates = new Set(["en", "th", "es", "ca", "ja", "zh-CN"]);
  const candidate = localeCandidates.has(first)
    ? (segments[1] ?? "")
    : first;
  if (!candidate) return "home";
  if ((ALL_ROOM_IDS as readonly string[]).includes(candidate)) {
    return candidate as RoomId;
  }
  return "home";
}

/** Notional depth — used to pick descend vs return-to-surface choreography. */
export const ROOM_DEPTH: Record<RoomId, number> = {
  home: 0,
  mirror: 1,
  music: 1,
  crosscultural: 1,
  about: 1,
  "field-notes": 1,
  atlas: 1,
  bridges: 1,
  tours: 1,
  threshold: 2,
  archetypes: 2,
  cellular: 3,
};

export type TransitionStyle =
  | "standard"
  | "deep-descent" // Surface → Cellular: longer pre-window, particle shower
  | "return-to-surface"; // Cellular → anywhere: macro brain re-materializes

export function transitionStyle(
  from: RoomId,
  to: RoomId,
): TransitionStyle {
  if (to === "cellular") return "deep-descent";
  if (from === "cellular") return "return-to-surface";
  return "standard";
}

/**
 * Canonical hrefs for each room. The home page links use these so we
 * have one source of truth for "what URL does this room live at".
 */
export const ROOM_HREF: Record<RoomId, string> = {
  home: "/",
  mirror: "/mirror",
  music: "/music",
  crosscultural: "/crosscultural",
  threshold: "/threshold",
  archetypes: "/archetypes",
  cellular: "/cellular",
  about: "/about",
  "field-notes": "/field-notes",
  atlas: "/atlas",
  bridges: "/bridges",
  tours: "/tours",
};
