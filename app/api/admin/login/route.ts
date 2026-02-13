import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  // Vérification simple (à adapter)
  if (email !== "admin@test.com" || password !== "1234") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    { role: "ADMIN", email },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  const response = NextResponse.json({ success: true });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: false,
    path: "/",
  });

  return response;
}
