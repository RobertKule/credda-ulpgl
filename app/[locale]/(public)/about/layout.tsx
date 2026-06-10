import type { Metadata } from "next";
import { localePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localePageMetadata(locale, "about");
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
