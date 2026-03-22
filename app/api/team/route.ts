import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { safeQuery } from "@/lib/db-safe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";

  const members = await safeQuery(
    () =>
      db.member.findMany({
        orderBy: { order: "asc" },
        include: {
          translations: { where: { language: locale } }
        }
      }),
    [],
    "api/team:list"
  );

  return NextResponse.json({ items: members });
}
