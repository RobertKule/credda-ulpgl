// app/api/admin/gallery/upload/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

export const runtime = 'nodejs';

// Configuration Cloudinary
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("❌ Cloudinary credentials missing");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const imageSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, "Le fichier doit être un fichier valide")
    .refine((f) => f.size <= IMAGE_MAX_BYTES, "L'image ne doit pas dépasser 5MB")
    .refine(
      (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type),
      "Seuls les formats JPEG, PNG et WebP sont acceptés"
    ),
});

export async function POST(request: Request) {
  try {
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
      // ✅ CORRECTION: validation.error existe, pas validation.error.errors
      // Il faut accéder directement à validation.error
      const errorMessage = validation.error.issues[0]?.message || "Validation échouée";
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "credda_gallery",
          format: "webp",
          transformation: [
            { width: 1200, crop: "limit" },
            { quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ url: (result as any).secure_url });
  } catch (error) {
    console.error("Erreur upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}