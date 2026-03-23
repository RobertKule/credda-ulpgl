import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { safeQuery } from "@/lib/db-safe";

type Props = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";

  const article = await safeQuery(
    () =>
      db.article.findUnique({
        where: { slug },
        include: {
          translations: { where: { language: locale } },
          category: { include: { translations: { where: { language: locale } } } },
          medias: true
        }
      }),
    null,
    "api/articles:bySlug"
  );

  if (!article || !article.published) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(article);
}
