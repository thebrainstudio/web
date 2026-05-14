// audit-fix: Task 4. Per-room OG card.
import { renderRoomOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-room-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Brain Mirror — paste any text and watch the predicted activation.";

export default function OG() {
  return renderRoomOgCard({
    eyebrow: "Brain Mirror · 01",
    title: "Paste any text.",
    subtitle: "Watch what your writing looks like underneath.",
  });
}
