import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Domain } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const article = await db.article.findUnique({
    where: { id },
    include: {
      translations: true,
      category: { include: { translations: true } },
      medias: true
    }
  });

  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PUT(req: Request, { params }: Props) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { slug, domain, categoryId, translations, mainImage, videoUrl, published } = body;

    const article = await db.article.update({
      where: { id },
      data: {
        slug,
        domain: domain as Domain,
        categoryId,
        videoUrl,
        mainImage,
        published,
        translations: {
          deleteMany: {},
          create: translations
        }
      },
      include: { translations: true }
    });

    revalidatePath("/[locale]/admin/articles", "layout");
    revalidatePath("/[locale]/research", "layout");
    revalidatePath("/[locale]", "layout");

    return NextResponse.json(article);
  } catch (e: any) {
    console.error("PUT /api/admin/articles/[id]", e);
    return NextResponse.json({ error: e.message || "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await db.article.delete({ where: { id } });

    revalidatePath("/[locale]/admin/articles", "layout");
    revalidatePath("/[locale]/research", "layout");
    revalidatePath("/[locale]", "layout");

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("DELETE /api/admin/articles/[id]", e);
    return NextResponse.json({ error: e.message || "Erreur serveur" }, { status: 500 });
  }
}
