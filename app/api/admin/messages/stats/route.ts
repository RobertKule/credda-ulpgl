// app/api/admin/messages/stats/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { safeQuery } from "@/lib/db-safe";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const [total, unread, read, archived, replied] = await Promise.all([
      safeQuery(() => db.contactMessage.count(), 0, "admin/messages/stats:total"),
      safeQuery(() => db.contactMessage.count({ where: { status: "UNREAD" } }), 0, "admin/messages/stats:unread"),
      safeQuery(() => db.contactMessage.count({ where: { status: "READ" } }), 0, "admin/messages/stats:read"),
      safeQuery(() => db.contactMessage.count({ where: { status: "ARCHIVED" } }), 0, "admin/messages/stats:archived"),
      safeQuery(
        () => db.contactMessage.count({ where: { NOT: { repliedAt: null } } }),
        0,
        "admin/messages/stats:replied"
      )
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