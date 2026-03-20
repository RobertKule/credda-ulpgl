// app/api/admin/gallery/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const images = await db.galleryImage.findMany({
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error("⚠️ Database failure in GET gallery:", error);
    return NextResponse.json([]); // Return empty list on failure
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.src || !body.title || !body.category) {
      return NextResponse.json(
        { error: "src, title et category sont requis" },
        { status: 400 }
      );
    }

    const lastImage = await db.galleryImage.findFirst({
      orderBy: { order: 'desc' }
    });

    const image = await db.galleryImage.create({
      data: {
        src: body.src,
        category: body.category,
        order: (lastImage?.order ?? -1) + 1,
        featured: body.featured || false,
        translations: {
          create: [
            { language: 'fr', title: body.title, description: body.description || null },
            { language: 'en', title: body.title, description: body.description || null },
            { language: 'sw', title: body.title, description: body.description || null }
          ]
        }
      }
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error: any) {
    const isConnError = error.code === 'P1017' || error.message?.includes('closed the connection');

    if (isConnError) {
      console.warn("⚠️ Database connection closed gracefully in gallery creation API.");
    } else {
      console.error("Erreur POST gallery:", error);
    }
    
    // Resilience: Handle database connection drops gracefully
    if (isConnError) {
      return NextResponse.json(
        { error: "La base de données est temporairement indisponible. Veuillez réessayer." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la création de l'image." },
      { status: 500 }
    );
  }
}