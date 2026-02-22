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

    const [total, unread, read, archived, replied] = await Promise.all([
      db.contactMessage.count(),
      db.contactMessage.count({ where: { status: "UNREAD" } }),
      db.contactMessage.count({ where: { status: "READ" } }),
      db.contactMessage.count({ where: { status: "ARCHIVED" } }),
      db.contactMessage.count({ where: { NOT: { repliedAt: null } } })
    ]);

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