// app/api/admin/messages/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Role } from "@/types/user";
import { contactStatusSchema } from "@/schemas/contact";
import { z } from "zod";

export const runtime = 'nodejs';

const updateMessageSchema = z.object({
  status: contactStatusSchema.optional(),
  replyContent: z.string().optional(),
  repliedAt: z.coerce.date().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== Role.ADMIN && session.user.role !== Role.SUPERADMIN)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const data = updateMessageSchema.parse(body);

    const updatePayload: any = { ...data };

    if (data.replyContent && !data.repliedAt) {
      updatePayload.repliedAt = new Date();
    }

    const message = await db.contactMessage.update({
      where: { id },
      data: updatePayload
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Erreur PATCH message:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== Role.ADMIN && session.user.role !== Role.SUPERADMIN)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    
    await db.contactMessage.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE message:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}