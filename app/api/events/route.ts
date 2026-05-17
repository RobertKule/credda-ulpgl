import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";
  const upcoming = searchParams.get("upcoming");

  const now = new Date();

  try {
    let query;
    if (upcoming === "true") {
      query = sql`
        SELECT e.*, 
          (SELECT json_agg(t) FROM "EventTranslation" t WHERE t."eventId" = e.id AND t.language = ${locale}) as translations
        FROM "Event" e
        WHERE e."isPublished" = true AND e.date >= ${now}
        ORDER BY e.date ASC
      `;
    } else if (upcoming === "false") {
      query = sql`
        SELECT e.*, 
          (SELECT json_agg(t) FROM "EventTranslation" t WHERE t."eventId" = e.id AND t.language = ${locale}) as translations
        FROM "Event" e
        WHERE e."isPublished" = true AND e.date < ${now}
        ORDER BY e.date DESC
      `;
    } else {
      query = sql`
        SELECT e.*, 
          (SELECT json_agg(t) FROM "EventTranslation" t WHERE t."eventId" = e.id AND t.language = ${locale}) as translations
        FROM "Event" e
        WHERE e."isPublished" = true
        ORDER BY e.date DESC
      `;
    }

    interface EventSqlResult {
      id: string;
      slug: string;
      date: Date;
      location: string;
      type: string;
      coverImageUrl?: string | null;
      isPublished: boolean;
      translations: any[]; // will be formatted later
    }

    const events = (await query) as EventSqlResult[];
    
    const formattedEvents = events.map((e) => ({
      ...e,
      translations: e.translations || []
    }));

    return NextResponse.json({ items: formattedEvents });
  } catch (error: any) {
    console.error("[API] Events error:", error.message);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
