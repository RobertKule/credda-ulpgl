import type { Metadata } from "next";
import { getMessages } from "next-intl/server";

export type MetadataPageKey =
  | "home"
  | "about"
  | "team"
  | "research"
  | "programmes"
  | "publications"
  | "events"
  | "gallery"
  | "contact";

export async function localePageMetadata(
  locale: string,
  page: MetadataPageKey
): Promise<Metadata> {
  const messages = await getMessages({ locale });
  const meta = (messages as Record<string, unknown>).metadata as
    | Record<string, { title: string; description: string }>
    | undefined;
  const entry = meta?.[page];
  if (!entry) {
    return { title: "CREDDA-ULPGL" };
  }
  return {
    title: entry.title,
    description: entry.description
  };
}
