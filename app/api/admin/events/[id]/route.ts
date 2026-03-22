import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const event = await db.event.findUnique({
    where: { id },
    include: { translations: true, galleryImages: true }
  });

  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(event);
}

export async function PUT(req: Request, { params }: Props) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { slug, date, location, type, coverImageUrl, isPublished, translations } = body;

    const data: Record<string, unknown> = {
      slug,
      location,
      type,
      coverImageUrl,
      isPublished
    };
    if (date) {
      data.date = new Date(date);
    }
    if (translations?.length) {
      data.translations = { deleteMany: {}, create: translations };
    }

    const event = await db.event.update({
      where: { id },
      data: data as any,
      include: { translations: true }
    });

    revalidatePath("/[locale]/events", "layout");
    revalidatePath("/[locale]/admin", "layout");

    return NextResponse.json(event);
  } catch (e: any) {
    console.error("PUT /api/admin/events/[id]", e);
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
    await db.event.delete({ where: { id } });

    revalidatePath("/[locale]/events", "layout");
    revalidatePath("/[locale]/admin", "layout");

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("DELETE /api/admin/events/[id]", e);
    return NextResponse.json({ error: e.message || "Erreur serveur" }, { status: 500 });
  }
}
