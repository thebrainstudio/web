// PR 11: Faust OG card.
import { renderRoomOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-room-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Faust — Goethe's sixty-year question read alongside the contemporary neuroscience of prediction error.";

export default function OG() {
  return renderRoomOgCard({
    eyebrow: "Faust · The first literary room",
    title: "The pact that cannot be paid in money.",
    subtitle: "Goethe's sixty-year question, read alongside prediction error.",
  });
}
