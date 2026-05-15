// PR 11: Dante OG card.
import { renderRoomOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-room-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Dante — the Commedia as an architecture built for the default-mode network.";

export default async function OG({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; return renderRoomOgCard({locale,
    eyebrow: "Dante · The second literary room",
    title: "An architecture for the default-mode network.",
    subtitle: "The Commedia, read alongside embodied cognition and moral attention.",
  });
}
