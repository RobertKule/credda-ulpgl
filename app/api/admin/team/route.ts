// app/api/admin/team/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const members = await db.member.findMany({
      include: { translations: true },
      orderBy: { order: "asc" }
    });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, role, bio, email, image, translations } = await req.json();

    const member = await db.member.create({
      data: {
        email,
        image,
        translations: {
          create: translations // Array of { language, name, role, bio }
        }
      },
      include: { translations: true }
    });

    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}
