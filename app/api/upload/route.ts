import { NextResponse } from "next/server";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

// Configuration Cloudinary via environment variables
// Expects: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileSchema = z.object({
  file: z.any()
    .refine((file) => file?.size && file.size <= MAX_FILE_SIZE, `File size must be less than 5MB.`)
    .refine(
      (file) => file?.type && ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const validation = fileSchema.safeParse({ file });
    if (!validation.success) {
      return NextResponse.json({ error: (validation.error as any).issues?.[0]?.message || "Validation failed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary with WebP conversion and optimization
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "credda_uploads",
          format: "webp",
          transformation: [
            { width: 1200, crop: "limit" }, // Resize large images
            { quality: "auto" },            // Auto optimize quality
            { fetch_format: "auto" }        // Best format delivery
          ]
        },
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    }) as any;

    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error("Failed to upload to Cloudinary");
    }

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error("Secure Upload Error:", error);
    return NextResponse.json({ error: "Internal server error during upload" }, { status: 500 });
  }
}