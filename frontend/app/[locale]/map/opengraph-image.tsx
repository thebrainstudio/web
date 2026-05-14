// PR 11: /map OG card.
import { renderRoomOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-room-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Site map — three columns showing how rooms, regions, and long-form essays cross-reference.";

export default function OG() {
  return renderRoomOgCard({
    eyebrow: "Site map · An index",
    title: "An index for the whole site.",
    subtitle: "Rooms, regions, long-form. Three columns of cross-references.",
  });
}
