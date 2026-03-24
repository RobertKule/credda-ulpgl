import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

const PAGE_SIZE = 12;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  try {
    // Fetch articles with their translations and category translations in one go (or separate for simplicity)
    const items = await sql`
      SELECT a.*, 
        (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations,
        (SELECT json_agg(ct) FROM "CategoryTranslation" ct WHERE ct."categoryId" = a."categoryId" AND ct.language = ${locale}) as category_translations
      FROM "Article" a
      WHERE a.published = true
      ORDER BY a."createdAt" DESC
      LIMIT ${PAGE_SIZE} OFFSET ${skip}
    `;

    const countResult = await sql`SELECT count(*) FROM "Article" WHERE published = true`;
    const total = parseInt(countResult[0].count, 10);

    // Map to match expected Prisma structure if needed
    const formattedItems = items.map((item: any) => ({
      ...item,
      translations: item.translations || [],
      category: item.categoryId ? {
        id: item.categoryId,
        translations: item.category_translations || []
      } : null
    }));

    return NextResponse.json({
      items: formattedItems,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE) || 1
      }
    });
  } catch (error: any) {
    console.error("[API] Articles error:", error.message);
    return NextResponse.json({ items: [], pagination: { page, total: 0 } }, { status: 500 });
  }
}
