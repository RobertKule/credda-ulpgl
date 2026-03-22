// services/gallery-actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/** Titles live on GalleryImageTranslation only — never rely on a non-existent GalleryImage.title. */
export async function getFeaturedGalleryImages(limit = 20, locale = "fr") {
  try {
    const images = await db.galleryImage.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: limit,
      include: {
        translations: { where: { language: locale } }
      }
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
        { featured: "desc" },
        { order: "asc" },
        { createdAt: "desc" }
      ],
      include: {
        translations: true
      }
    });
    return images;
  } catch (error) {
    console.error("Erreur chargement galerie:", error);
    return [];
  }
}

export async function getGalleryImageById(id: string, locale?: string) {
  try {
    const image = await db.galleryImage.findUnique({
      where: { id },
      include: {
        translations: locale ? { where: { language: locale } } : true
      }
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