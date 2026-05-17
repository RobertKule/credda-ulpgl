// app/api/admin/messages/stats/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMessageStats } from "@/services/contact-actions";
import { Role } from "@/types/user";

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user.role !== Role.ADMIN && session.user.role !== Role.SUPER_ADMIN)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const result = await getMessageStats();

    if (result.success) {
      return NextResponse.json(result.data);
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Erreur stats API:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}