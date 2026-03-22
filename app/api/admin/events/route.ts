import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await db.event.findMany({
    orderBy: { date: "desc" },
    include: { translations: true, galleryImages: true }
  });
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slug, date, location, type, coverImageUrl, isPublished, translations } = body;

    if (!slug || !date || !location || !type || !translations?.length) {
      return NextResponse.json(
        { error: "slug, date, location, type et translations sont requis" },
        { status: 400 }
      );
    }

    const existing = await db.event.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
    }

    const event = await db.event.create({
      data: {
        slug,
        date: new Date(date),
        location,
        type,
        coverImageUrl: coverImageUrl ?? null,
        isPublished: isPublished ?? false,
        translations: { create: translations }
      },
      include: { translations: true }
    });

    revalidatePath("/[locale]/admin", "layout");
    revalidatePath("/[locale]/events", "layout");

    return NextResponse.json(event, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/admin/events", e);
    return NextResponse.json({ error: e.message || "Erreur serveur" }, { status: 500 });
  }
}
