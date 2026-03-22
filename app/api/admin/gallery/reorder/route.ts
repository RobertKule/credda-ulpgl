// app/api/admin/gallery/reorder/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderedIds } = await request.json();
    
    await Promise.all(
      orderedIds.map((id: string, index: number) =>
        db.galleryImage.update({
          where: { id },
          data: { order: index }
        })
      )
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur réordonnancement:", error);
    return NextResponse.json(
      { error: "Erreur réordonnancement" },
      { status: 500 }
    );
  }
}