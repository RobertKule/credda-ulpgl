// app/api/admin/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { safeQuery } from "@/lib/db-safe";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Construction du filtre
    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    // Compter les messages non lus (pour le badge)
    const unreadCount = await safeQuery(
      () => db.contactMessage.count({ where: { status: "UNREAD" } }),
      0,
      "api/messages:unreadCount"
    );

    const [messages, total] = await Promise.all([
      safeQuery(
        () =>
          db.contactMessage.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit
          }),
        [],
        "api/messages:list"
      ),
      safeQuery(() => db.contactMessage.count({ where }), 0, "api/messages:total")
    ]);

    return NextResponse.json({
      messages,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Erreur GET messages:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}