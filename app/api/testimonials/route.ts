import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { safeQuery } from "@/lib/db-safe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";

  const items = await safeQuery(
    () =>
      db.testimonial.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        include: {
          translations: { where: { language: locale } }
        }
      }),
    [],
    "api/testimonials:list"
  );

  return NextResponse.json({ items });
}
