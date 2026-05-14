// audit-fix: Task 4. Per-room OG card.
import { renderRoomOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-room-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "About The Brain Studio — who built this and what TRIBE is.";

export default function OG() {
  return renderRoomOgCard({
    eyebrow: "About",
    title: "About The Brain Studio.",
    subtitle: "Who built this, what TRIBE is, and the editorial decisions behind the rooms.",
  });
}
