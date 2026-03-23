import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { safeQuery } from "@/lib/db-safe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";

  const images = await safeQuery(
    () =>
      db.galleryImage.findMany({
        orderBy: { order: "asc" },
        include: {
          translations: { where: { language: locale } }
        }
      }),
    [],
    "api/gallery:list"
  );

  const items = images.map((img) => ({
    id: img.id,
    src: img.src,
    category: img.category,
    order: img.order,
    featured: img.featured,
    title: img.translations[0]?.title ?? "",
    description: img.translations[0]?.description ?? null
  }));

  return NextResponse.json({ items });
}
