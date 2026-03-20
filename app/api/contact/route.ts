// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { sendContactNotification } from "@/services/mail-service";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const fullMessage = `Objet: ${subject}\n\n${message}`;
    const result = await sendContactNotification(name, email, fullMessage);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}