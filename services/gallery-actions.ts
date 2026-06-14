"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/types/api";
import { withSafeAction } from "@/lib/safe-action";
import { galleryImageSchema, updateGalleryImageSchema } from "@/schemas/gallery";
import { GalleryImage } from "@prisma/client";

export async function createGalleryImage(rawData: unknown): Promise<ApiResponse<GalleryImage>> {
  return withSafeAction("createGalleryImage", async () => {
    const data = galleryImageSchema.parse(rawData);
    const { src, category, featured, translations, files } = data;

    const image = await db.galleryImage.create({
      data: {
        src,
        category,
        featured,
        order: 0,
        translations: {
          create: translations
        },
        files: files?.length ? {
          create: files
        } : undefined
      }
    });

    revalidatePath("/[locale]/admin/gallery", "layout");
    revalidatePath("/[locale]/gallery", "layout");
    return image;
  }, "Erreur lors de l'ajout de l'image à la galerie");
}

export async function updateGalleryImage(rawData: unknown): Promise<ApiResponse<GalleryImage>> {
  return withSafeAction("updateGalleryImage", async () => {
    const data = updateGalleryImageSchema.parse(rawData);
    const { id, src, category, featured, translations, files } = data;

    const image = await db.galleryImage.update({
      where: { id },
      data: {
        src,
        category,
        featured,
        translations: {
          deleteMany: {},
          create: translations
        },
        files: files?.length ? {
          deleteMany: {},
          create: files
        } : undefined
      }
    });

    revalidatePath("/[locale]/admin/gallery", "layout");
    revalidatePath("/[locale]/gallery", "layout");
    return image;
  }, "Erreur lors de la mise à jour de l'image");
}

export async function deleteGalleryImage(id: string): Promise<ApiResponse<{ id: string }>> {
  return withSafeAction("deleteGalleryImage", async () => {
    await db.galleryImage.delete({ where: { id } });
    revalidatePath("/[locale]/admin/gallery", "layout");
    revalidatePath("/[locale]/gallery", "layout");
    return { id };
  }, "Impossible de supprimer l'image");
}