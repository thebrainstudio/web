// audit-fix: Task 4. Per-room OG card.
import { renderRoomOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-room-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Cross-Cultural Brain — where the model breaks down across languages.";

export default function OG() {
  return renderRoomOgCard({
    eyebrow: "Cross-Cultural · 03",
    title: "What it can't translate is itself a finding.",
    subtitle: "Where the model breaks down across languages.",
  });
}
