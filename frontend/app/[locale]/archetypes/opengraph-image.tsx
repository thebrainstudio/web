// audit-fix: Task 4. Per-room OG card.
import { renderRoomOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-room-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Archetypes — patterns old enough to have names.";

export default async function OG({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return renderRoomOgCard({locale,
    eyebrow: "The Archetypes · 05",
    title: "Patterns old enough to have names.",
    subtitle: "Illustrated from the visual tradition Jung drew on.",
  });
}
