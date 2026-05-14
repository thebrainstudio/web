import type { Metadata } from "next";
import { generateRoomMetadata } from "@/lib/seo";

/**
 * audit-fix: Task 4. Per-room metadata for Brain Mirror. The page itself
 * is a "use client" component so metadata is exported from this layout
 * segment instead. Pass-through children — no other layout behavior.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateRoomMetadata({ locale, slug: "mirror" });
}

export default function MirrorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
