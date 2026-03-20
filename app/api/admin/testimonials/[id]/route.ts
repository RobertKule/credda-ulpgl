// app/api/admin/testimonials/[id]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { authorName, authorRole, isPublished, translations } = await req.json();

    // Update main fields
    await db.testimonial.update({
      where: { id },
      data: { authorName, authorRole, isPublished }
    });

    // Update translations (upsert logic)
    if (translations && Array.isArray(translations)) {
      for (const t of translations) {
        await db.testimonialTranslation.upsert({
          where: { testimonialId_language: { testimonialId: id, language: t.language } },
          update: { quote: t.quote },
          create: { testimonialId: id, language: t.language, quote: t.quote }
        });
      }
    }

    const updated = await db.testimonial.findUnique({
      where: { id },
      include: { translations: true }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await db.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
