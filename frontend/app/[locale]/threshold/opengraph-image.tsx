// audit-fix: Task 4. Per-room OG card.
import { renderRoomOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-room-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Threshold — an essay about the seam between mind and brain.";

export default function OG() {
  return renderRoomOgCard({
    eyebrow: "The Threshold · 04",
    title: "Between mind and brain.",
    subtitle: "An essay in three movements about the seam.",
  });
}
