import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const heroDir = path.join(process.cwd(), "public", "images", "hero");
    const files = await readdir(heroDir);
    const images = files
      .filter((f) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(f))
      .map((f) => `/images/hero/${f}`);

    return NextResponse.json(images);
  } catch {
    // Fallback si le dossier n'existe pas
    return NextResponse.json([]);
  }
}
