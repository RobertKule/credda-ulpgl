import { NextResponse } from "next/server";
export const runtime = 'nodejs';
export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("token", "", {
    path: "/",
    expires: new Date(0),
  });

  return response;
}
