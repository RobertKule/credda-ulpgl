import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";

  try {
    interface GalleryImageSqlResult {
      id: string;
      src: string;
      category: string;
      order: number;
      featured: boolean;
      translations: { title: string; description?: string | null }[];
    }

    const images = (await sql`
      SELECT gi.*, 
        (SELECT json_agg(t) FROM "GalleryImageTranslation" t WHERE t."galleryImageId" = gi.id AND t.language = ${locale}) as translations
      FROM "GalleryImage" gi
      ORDER BY gi."order" ASC
    `) as GalleryImageSqlResult[];

    const items = images.map((img) => ({
      id: img.id,
      src: img.src,
      category: img.category,
      order: img.order,
      featured: img.featured,
      title: img.translations?.[0]?.title ?? "",
      description: img.translations?.[0]?.description ?? null
    }));

    return NextResponse.json({ items });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API] Gallery error:", err.message);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
