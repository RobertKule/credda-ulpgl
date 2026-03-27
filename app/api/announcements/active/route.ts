import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    if (!announcements || announcements.length === 0) {
      return NextResponse.json([]);
    }
    
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("[API_ANNOUNCEMENTS_ACTIVE]", error);
    // Return null instead of 500 to keep the UI stable if the DB is temporarily unreachable
    return NextResponse.json(null);
  }
}
