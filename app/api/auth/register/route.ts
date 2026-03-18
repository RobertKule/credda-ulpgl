// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendNewRequestAlert } from "@/services/mail-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, phone, organization, bio, requestedRole } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with PENDING status
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        organization,
        bio,
        role: "USER", // Default role, can be updated by admin based on requestedRole
        status: "PENDING",
      },
    });

    // Notify Admins
    await sendNewRequestAlert(name, email);

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    const isConnError = error.code === 'P1017' || error.message?.includes('closed the connection');

    if (isConnError) {
      console.warn("⚠️ Database connection closed gracefully in registration API.");
    } else {
      console.error("Registration error:", error);
    }

    // Resilience: Handle database connection drops gracefully
    if (isConnError) {
      return NextResponse.json(
        { message: "Le service d'inscription est temporairement indisponible. Veuillez réessayer." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'inscription." },
      { status: 500 }
    );
  }
}
