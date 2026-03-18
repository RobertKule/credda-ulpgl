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
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
