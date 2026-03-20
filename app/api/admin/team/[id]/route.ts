// app/api/admin/team/[id]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { email, image, translations } = await req.json();

    await db.member.update({
      where: { id: params.id },
      data: { email, image }
    });

    if (translations && Array.isArray(translations)) {
      for (const t of translations) {
        await db.memberTranslation.upsert({
          where: { memberId_language: { memberId: params.id, language: t.language } },
          update: { name: t.name, role: t.role, bio: t.bio },
          create: { memberId: params.id, language: t.language, name: t.name, role: t.role, bio: t.bio }
        });
      }
    }

    const updated = await db.member.findUnique({
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
    await db.member.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
