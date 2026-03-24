import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";

  try {
    const members = await sql`
      SELECT m.*, 
        (SELECT json_agg(t) FROM "MemberTranslation" t WHERE t."memberId" = m.id AND t.language = ${locale}) as translations
      FROM "Member" m
      ORDER BY m."order" ASC
    `;

    const formattedMembers = members.map((m: any) => ({
      ...m,
      translations: m.translations || []
    }));

    return NextResponse.json({ items: formattedMembers });
  } catch (error: any) {
    console.error("[API] Team error:", error.message);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
