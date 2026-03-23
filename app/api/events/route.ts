import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { safeQuery } from "@/lib/db-safe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";
  const upcoming = searchParams.get("upcoming");

  const now = new Date();

  const where: any = { isPublished: true };
  if (upcoming === "true") {
    where.date = { gte: now };
  } else if (upcoming === "false") {
    where.date = { lt: now };
  }

  const events = await safeQuery(
    () =>
      db.event.findMany({
        where,
        orderBy: { date: upcoming === "true" ? "asc" : "desc" },
        include: {
          translations: { where: { language: locale } }
        }
      }),
    [],
    "api/events:list"
  );

  return NextResponse.json({ items: events });
}
