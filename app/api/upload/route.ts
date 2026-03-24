import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";

// ─── Validation constants ──────────────────────────────────────────────────────
const IMAGE_MAX_BYTES = 10 * 1024 * 1024; // 10 MB  — profile photos, gallery images
const PDF_MAX_BYTES = 20 * 1024 * 1024; // 20 MB — research publications

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const ACCEPTED_PDF_TYPES = ["application/pdf"] as const;

// ─── Zod schemas ──────────────────────────────────────────────────────────────
const imageSchema = z.object({
  uploadType: z.literal("image"),
  file: z
    .custom<File>((val) => val instanceof File, { message: "Expected a File object." })
    .refine(
      (f) => typeof f.size === "number" && f.size > 0 && f.size <= IMAGE_MAX_BYTES,
      { message: "Image must be greater than 0 bytes and less than 10 MB." }
    )
    .refine(
      (f) => (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(f.type),
      { message: "Only JPEG, PNG, GIF and WebP images are accepted." }
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

// ─── Route handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Parse multipart form data.
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
  const rawUploadType = formData.get("uploadType") ?? "image";
  const folder = (formData.get("folder") as any) || "gallery";

  // 2. Branch by uploadType and validate with the appropriate strict schema.
  if (rawUploadType === "pdf") {
    const validation = pdfSchema.safeParse({ uploadType: "pdf", file: rawFile });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed.", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    try {
      const buffer = Buffer.from(await validation.data.file.arrayBuffer());
      const url = await uploadFile(
        buffer, 
        validation.data.file.name, 
        validation.data.file.type, 
        "publications"
      );
      return NextResponse.json({ url, success: true }, { status: 200 });
    } catch (error: any) {
      console.error("[upload/pdf] Supabase upload error:", error);
      return NextResponse.json(
        { error: error.message || "PDF upload failed." },
        { status: 500 }
      );
    }

  } else {
    const validation = imageSchema.safeParse({ uploadType: "image", file: rawFile });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed.", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    try {
      const buffer = Buffer.from(await validation.data.file.arrayBuffer());
      const url = await uploadFile(
        buffer, 
        validation.data.file.name, 
        validation.data.file.type, 
        folder
      );
      return NextResponse.json({ url, success: true }, { status: 200 });
    } catch (error: any) {
      console.error("[upload/image] Supabase upload error:", error);
      return NextResponse.json(
        { error: error.message || "Image upload failed." },
        { status: 500 }
      );
    }
  }
}
