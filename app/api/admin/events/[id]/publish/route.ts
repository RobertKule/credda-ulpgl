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
    const current = await db.event.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const nextPublished =
      typeof body.isPublished === "boolean" ? body.isPublished : !current.isPublished;

    const event = await db.event.update({
      where: { id },
      data: { isPublished: nextPublished }
    });

    revalidatePath("/[locale]/events", "layout");
    revalidatePath("/[locale]/admin", "layout");

    return NextResponse.json(event);
  } catch (e: any) {
    console.error("PATCH event publish", e);
    return NextResponse.json({ error: e.message || "Erreur serveur" }, { status: 500 });
  }
}
