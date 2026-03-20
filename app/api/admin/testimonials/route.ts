// app/api/admin/testimonials/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const testimonials = await db.testimonial.findMany({
      include: { translations: true },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { authorName, authorRole, isPublished, translations } = await req.json();

    const testimonial = await db.testimonial.create({
      data: {
        authorName,
        authorRole,
        isPublished: isPublished || false,
        translations: {
          create: translations // Array of { language, quote }
        }
      },
      include: { translations: true }
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Testimonial Create Error:", error);
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}
