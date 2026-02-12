// services/gallery-actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getFeaturedGalleryImages(limit = 20) {
  try {
    const images = await db.galleryImage.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
      take: limit
    });
    return images;
  } catch (error) {
    console.error("Erreur chargement galerie:", error);
    return [];
  }
}

export async function getAllGalleryImages() {
  try {
    const images = await db.galleryImage.findMany({
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    return images;
  } catch (error) {
    console.error("Erreur chargement galerie:", error);
    return [];
  }
}

export async function getGalleryImageById(id: string) {
  try {
    const image = await db.galleryImage.findUnique({
      where: { id }
    });
    return image;
  } catch (error) {
    console.error("Erreur chargement image:", error);
    return null;
  }
}

export async function incrementImageView(id: string) {
  try {
    // Logique pour incrémenter les vues si vous avez ce champ
    // await db.galleryImage.update({
    //   where: { id },
    //   data: { views: { increment: 1 } }
    // });
    return true;
  } catch (error) {
    console.error("Erreur incrémentation vues:", error);
    return false;
  }
}