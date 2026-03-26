import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const announcement = await prisma.announcement.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!announcement) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json(announcement);
  } catch (error) {
    console.error("[API_ANNOUNCEMENTS_ACTIVE]", error);
    // Return null instead of 500 to keep the UI stable if the DB is temporarily unreachable
    return NextResponse.json(null);
  }
}
