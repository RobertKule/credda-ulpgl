// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { sendContactMessageSchema } from "@/schemas/contact";
import { sendContactMessage } from "@/services/contact-actions";

export async function POST(req: Request) {
  try {
    const rawData = await req.json();
    const result = await sendContactMessage(rawData);

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to send message" },
        { status: result.error === "Non autorisé" ? 403 : 500 }
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