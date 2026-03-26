import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const unreadMessagesCount = await prisma.contactMessage.count({
      where: { status: "UNREAD" }
    });

    const newCasesCount = await prisma.clinicalCase.count({
      where: { status: "NEW" }
    });

    return NextResponse.json({
      unreadMessagesCount,
      newCasesCount
    });
  } catch (error) {
     return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
