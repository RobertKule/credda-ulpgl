// app/api/user/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db as prisma } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, organization, bio, image } = body;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email as string },
      data: {
        name,
        phone,
        organization,
        bio,
        image,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        phone: updatedUser.phone,
        organization: updatedUser.organization,
        bio: updatedUser.bio,
        image: updatedUser.image,
      },
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    
    // Resilience: Handle database connection drops gracefully
    if (error.code === 'P1017' || error.message?.includes('closed the connection')) {
      return NextResponse.json(
        { message: "La base de données est temporairement indisponible. Veuillez réessayer." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: "Une erreur est survenue lors de la mise à jour." },
      { status: 500 }
    );
  }
}
