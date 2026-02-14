// app/api/admin/messages/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
export const runtime = 'nodejs';
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ CORRIGÉ: Promise
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params; // ✅ CORRIGÉ: await params
    const body = await req.json();
    
    const allowedFields = ["status", "replyContent", "repliedAt"];
    const data: any = {};
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        data[field] = body[field];
      }
    }

    if (body.replyContent && !body.repliedAt) {
      data.repliedAt = new Date();
    }

    const message = await db.contactMessage.update({
      where: { id },
      data
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
  { params }: { params: Promise<{ id: string }> } // ✅ CORRIGÉ: Promise
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params; // ✅ CORRIGÉ: await params
    
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