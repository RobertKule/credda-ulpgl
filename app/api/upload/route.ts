import { NextResponse } from "next/server";
import { z } from "zod";
import { v2 as cloudinary, type UploadApiOptions } from "cloudinary";

// ─── Cloudinary environment guard ─────────────────────────────────────────────
// All three variables are required. Missing any returns an explicit 500 before
// the Cloudinary SDK is ever called, preventing silent 401 crashes.
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const cloudinaryConfigured =
  Boolean(CLOUDINARY_CLOUD_NAME) &&
  Boolean(CLOUDINARY_API_KEY) &&
  Boolean(CLOUDINARY_API_SECRET);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

// ─── Validation constants ──────────────────────────────────────────────────────
const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB  — profile photos, gallery images
const PDF_MAX_BYTES = 20 * 1024 * 1024; // 20 MB — research publications

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const ACCEPTED_PDF_TYPES = ["application/pdf"] as const;

// ─── Zod schemas ──────────────────────────────────────────────────────────────
// z.custom<File>() ensures instanceof File is checked BEFORE any property
// access — eliminates every optional-chain false negative.

const imageSchema = z.object({
  uploadType: z.literal("image"),
  file: z
    .custom<File>((val) => val instanceof File, { message: "Expected a File object." })
    .refine(
      (f) => typeof f.size === "number" && f.size > 0 && f.size <= IMAGE_MAX_BYTES,
      { message: "Image must be greater than 0 bytes and less than 5 MB." }
    )
    .refine(
      (f) => (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(f.type),
      { message: "Only JPEG, PNG and WebP images are accepted." }
    ),
});

const pdfSchema = z.object({
  uploadType: z.literal("pdf"),
  file: z
    .custom<File>((val) => val instanceof File, { message: "Expected a File object." })
    .refine(
      (f) => typeof f.size === "number" && f.size > 0 && f.size <= PDF_MAX_BYTES,
      { message: "PDF must be greater than 0 bytes and less than 20 MB." }
    )
    .refine(
      (f) => (ACCEPTED_PDF_TYPES as readonly string[]).includes(f.type),
      { message: "Only PDF documents are accepted for this upload type." }
    ),
});

// ─── Cloudinary upload helper ──────────────────────────────────────────────────
function uploadToCloudinary(
  buffer: Buffer,
  options: UploadApiOptions
): Promise<{ secure_url: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error("Cloudinary returned no result."));
      } else {
        resolve(result as { secure_url: string });
      }
    });
    stream.end(buffer);
  });
}

// ─── Route handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request): Promise<NextResponse> {
  // 1. Guard: fail fast if Cloudinary is not configured.
  if (!cloudinaryConfigured) {
    console.error("[upload] Missing Cloudinary environment variables:", {
      CLOUDINARY_CLOUD_NAME: Boolean(CLOUDINARY_CLOUD_NAME),
      CLOUDINARY_API_KEY: Boolean(CLOUDINARY_API_KEY),
      CLOUDINARY_API_SECRET: Boolean(CLOUDINARY_API_SECRET),
    });
    return NextResponse.json(
      { error: "Server misconfiguration: Cloudinary credentials not set." },
      { status: 500 }
    );
  }

  // 2. Parse multipart form data.
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Failed to parse form data. Request must use multipart/form-data." },
      { status: 400 }
    );
  }

  const rawFile = formData.get("file");
  const rawUploadType = formData.get("uploadType") ?? "image"; // default: image

  // 3. Branch by uploadType and validate with the appropriate strict schema.
  if (rawUploadType === "pdf") {
    // ── PDF branch ─────────────────────────────────────────────────────────────
    const validation = pdfSchema.safeParse({ uploadType: "pdf", file: rawFile });

    if (!validation.success) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[upload/pdf] Validation failed:", validation.error.format());
      }
      return NextResponse.json(
        { error: "Validation failed.", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    try {
      const buffer = Buffer.from(await validation.data.file.arrayBuffer());
      const result = await uploadToCloudinary(buffer, {
        folder: "credda_publications",
        resource_type: "raw",    // Binary delivery — no image processing
        type: "upload", // Public URL — prevents 401
        use_filename: true,     // Preserves original filename (keeps .pdf extension)
        unique_filename: true,     // Adds a unique suffix to avoid collisions
      });
      return NextResponse.json({ url: result.secure_url }, { status: 200 });
    } catch (error: unknown) {
      console.error("[upload/pdf] Cloudinary upload error:", error);
      return NextResponse.json(
        { error: "PDF upload failed. Please try again later." },
        { status: 500 }
      );
    }

  } else {
    // ── Image branch (default) ─────────────────────────────────────────────────
    const validation = imageSchema.safeParse({ uploadType: "image", file: rawFile });

    if (!validation.success) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[upload/image] Validation failed:", validation.error.format());
      }
      return NextResponse.json(
        { error: "Validation failed.", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    try {
      const buffer = Buffer.from(await validation.data.file.arrayBuffer());
      const result = await uploadToCloudinary(buffer, {
        folder: "credda_uploads",
        resource_type: "image",
        format: "webp",
        transformation: [
          { width: 1200, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });
      return NextResponse.json({ url: result.secure_url }, { status: 200 });
    } catch (error: unknown) {
      console.error("[upload/image] Cloudinary upload error:", error);
      return NextResponse.json(
        { error: "Image upload failed. Please try again later." },
        { status: 500 }
      );
    }
  }
}