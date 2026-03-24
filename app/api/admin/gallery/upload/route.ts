// app/api/admin/gallery/upload/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";

export const runtime = 'nodejs';

const IMAGE_MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const imageSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, "Le fichier doit être un fichier valide")
    .refine((f) => f.size <= IMAGE_MAX_BYTES, "L'image ne doit pas dépasser 10MB")
    .refine(
      (f) => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type),
      "Seuls les formats JPEG, PNG, GIF et WebP sont acceptés"
    ),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    const validation = imageSchema.safeParse({ file });
    
    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || "Validation échouée";
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadFile(buffer, file.name, file.type, "gallery");

    return NextResponse.json({ url, success: true });
  } catch (error: any) {
    console.error("Erreur upload:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}