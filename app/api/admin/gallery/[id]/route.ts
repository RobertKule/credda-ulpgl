// app/api/admin/gallery/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ✅ FORCER nodejs runtime
export const runtime = 'nodejs';

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    
    const image = await db.galleryImage.findUnique({
      where: { id }
    });

    if (!image) {
      return NextResponse.json(
        { error: "Image non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error("Erreur GET image:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const image = await db.galleryImage.update({
      where: { id },
      data: body
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Erreur PATCH image:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;

    await db.galleryImage.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE image:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}