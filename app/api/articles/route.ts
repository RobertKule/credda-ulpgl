import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { safeQuery } from "@/lib/db-safe";

const PAGE_SIZE = 12;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  const [items, total] = await Promise.all([
    safeQuery(
      () =>
        db.article.findMany({
          where: { published: true },
          skip,
          take: PAGE_SIZE,
          orderBy: { createdAt: "desc" },
          include: {
            translations: { where: { language: locale } },
            category: { include: { translations: { where: { language: locale } } } }
          }
        }),
      [],
      "api/articles:list"
    ),
    safeQuery(() => db.article.count({ where: { published: true } }), 0, "api/articles:count")
  ]);

  return NextResponse.json({
    items,
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE) || 1
    }
  });
}
