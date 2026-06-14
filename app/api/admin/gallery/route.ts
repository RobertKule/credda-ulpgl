import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Changed from prisma to db to match user's previous code
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string || "";
    const attachments = formData.getAll("attachments") as File[];

    if (!title || attachments.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const filesData: { url: string; fileType: string }[] = [];
    const uploadDir = join(process.cwd(), "public", "uploads", "gallery");
    await mkdir(uploadDir, { recursive: true });

    for (const file of attachments) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const filePath = join(uploadDir, uniqueName);
      await writeFile(filePath, buffer);

      const fileType = file.type.startsWith("video/") ? "VIDEO" : "IMAGE";
      const fileUrl = `/uploads/gallery/${uniqueName}`;

      filesData.push({ url: fileUrl, fileType });
    }

    const galleryAlbum = await db.gallery.create({
      data: {
        title,
        description,
        files: { create: filesData },
      },
    });

    return NextResponse.json({ success: true, data: galleryAlbum });
  } catch (error) {
    console.error("Gallery API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}