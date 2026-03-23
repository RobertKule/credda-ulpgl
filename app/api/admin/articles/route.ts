import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Domain } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const articles = await db.article.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      translations: true,
      category: { include: { translations: true } }
    }
  });
  return NextResponse.json(articles);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slug, domain, categoryId, translations, mainImage, videoUrl, published } = body;

    if (!slug || !categoryId || !translations?.length) {
      return NextResponse.json(
        { error: "slug, categoryId et translations sont requis" },
        { status: 400 }
      );
    }

    const existing = await db.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
    }

    const article = await db.article.create({
      data: {
        slug,
        domain: (domain as Domain) || "RESEARCH",
        categoryId,
        mainImage: mainImage ?? null,
        videoUrl: videoUrl ?? null,
        published: published ?? true,
        translations: { create: translations }
      },
      include: { translations: true }
    });

    revalidatePath("/[locale]/admin/articles", "layout");
    revalidatePath("/[locale]/research", "layout");
    revalidatePath("/[locale]", "layout");

    return NextResponse.json(article, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/admin/articles", e);
    return NextResponse.json({ error: e.message || "Erreur serveur" }, { status: 500 });
  }
}
