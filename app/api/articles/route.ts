import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ArticleWithTranslations } from "@/types/article";

const PAGE_SIZE = 12;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  try {
    const [items, total] = await Promise.all([
      db.article.findMany({
        where: { published: true },
        include: {
          translations: {
            where: { language: locale }
          },
          category: {
            include: {
              translations: {
                where: { language: locale }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" },
        take: PAGE_SIZE,
        skip: skip
      }),
      db.article.count({ where: { published: true } })
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[API] Articles error:", errorMessage);
    return NextResponse.json({ items: [], pagination: { page, total: 0 } }, { status: 500 });
  }
}
