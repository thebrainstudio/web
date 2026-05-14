// audit-fix: Task 4. Per-room OG card.
import { renderRoomOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-room-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "NeuroMusic Lab — hear how sound moves the same regions that move you.";

export default function OG() {
  return renderRoomOgCard({
    eyebrow: "NeuroMusic Lab · 02",
    title: "Hear what your brain hears.",
    subtitle: "How sound moves the same regions that move you.",
  });
}
