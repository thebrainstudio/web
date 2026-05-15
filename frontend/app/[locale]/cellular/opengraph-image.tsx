// audit-fix: Task 4. Per-room OG card.
import { renderRoomOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-room-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Cellular View — descend into real neuron reconstructions.";

export default async function OG({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return renderRoomOgCard({locale,
    eyebrow: "Cellular View · 06",
    title: "Where activation becomes biology.",
    subtitle: "Descend into real neuron reconstructions and watch a synapse fire.",
  });
}
