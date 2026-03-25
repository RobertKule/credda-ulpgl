import type { Metadata } from "next";
import { localePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localePageMetadata(locale, "contact");
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}