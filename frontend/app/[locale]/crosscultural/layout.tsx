import type { Metadata } from "next";
import { generateRoomMetadata } from "@/lib/seo";

// audit-fix: Task 4. Per-room metadata for Cross-Cultural Brain.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateRoomMetadata({ locale, slug: "crosscultural" });
}

export default function CrossculturalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
