// app/api/admin/testimonials/[id]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { authorName, authorRole, isPublished, translations } = await req.json();

    // Update main fields
    await db.testimonial.update({
      where: { id: params.id },
      data: { authorName, authorRole, isPublished }
    });

    // Update translations (upsert logic)
    if (translations && Array.isArray(translations)) {
      for (const t of translations) {
        await db.testimonialTranslation.upsert({
          where: { testimonialId_language: { testimonialId: params.id, language: t.language } },
          update: { quote: t.quote },
          create: { testimonialId: params.id, language: t.language, quote: t.quote }
        });
      }
    }

    const updated = await db.testimonial.findUnique({
      where: { id: params.id },
      include: { translations: true }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await db.testimonial.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
