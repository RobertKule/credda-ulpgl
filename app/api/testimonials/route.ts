import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";

  try {
    const items = (await sql`
      SELECT t.*, 
        (SELECT json_agg(tr) FROM "TestimonialTranslation" tr WHERE tr."testimonialId" = t.id AND tr.language = ${locale}) as translations
      FROM "Testimonial" t
      WHERE t."isPublished" = true
      ORDER BY t."createdAt" DESC
    `) as any[];

    const formattedItems = items.map((i: any) => ({
      ...i,
      translations: i.translations || []
    }));

    return NextResponse.json({ items: formattedItems });
  } catch (error: any) {
    console.error("[API] Testimonials error:", error.message);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
