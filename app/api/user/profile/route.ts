// app/api/user/profile/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateUserProfileSchema } from "@/schemas/user";
import { SafeUser } from "@/types/user";

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = updateUserProfileSchema.parse(body);

    const updatedUser = await db.user.update({
      where: { email: session.user.email as string },
      data,
    });

    const { password: _, ...safeUser } = updatedUser;

    return NextResponse.json({
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (error: any) {
    // Prisma connection errors or other issues
    const isConnError = error.code === 'P1017' || error.message?.includes('closed the connection');
    
    if (isConnError) {
      console.warn("⚠️ Database connection closed gracefully in profile update API.");
      return NextResponse.json(
        { message: "La base de données est temporairement indisponible. Veuillez réessayer." },
        { status: 503 }
      );
    }

    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la mise à jour." },
      { status: 500 }
    );
  }
}
