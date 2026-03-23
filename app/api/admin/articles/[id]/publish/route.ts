import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const current = await db.article.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const nextPublished =
      typeof body.published === "boolean" ? body.published : !current.published;

    const article = await db.article.update({
      where: { id },
      data: { published: nextPublished }
    });

    revalidatePath("/[locale]/admin/articles", "layout");
    revalidatePath("/[locale]/research", "layout");
    revalidatePath("/[locale]", "layout");

    return NextResponse.json(article);
  } catch (e: any) {
    console.error("PATCH publish", e);
    return NextResponse.json({ error: e.message || "Erreur serveur" }, { status: 500 });
  }
}
