// app/api/admin/messages/stats/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    let total = 0, unread = 0, read = 0, archived = 0, replied = 0;
    try {
      const [fTotal, fUnread, fRead, fArchived, fReplied] = await Promise.all([
        db.contactMessage.count(),
        db.contactMessage.count({ where: { status: "UNREAD" } }),
        db.contactMessage.count({ where: { status: "READ" } }),
        db.contactMessage.count({ where: { status: "ARCHIVED" } }),
        db.contactMessage.count({ where: { NOT: { repliedAt: null } } })
      ]);
      total = fTotal; unread = fUnread; read = fRead; archived = fArchived; replied = fReplied;
    } catch (dbError) {
      console.error("⚠️ Database failure in messages/stats:", dbError);
    }

    return NextResponse.json({
      total,
      unread,
      read,
      archived,
      replied,
      responseRate: total > 0 ? Math.round((replied / total) * 100) : 0
    });
  } catch (error) {
    console.error("Erreur stats:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}