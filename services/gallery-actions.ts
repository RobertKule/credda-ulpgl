"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { withSafeAction, ActionResponse } from "@/lib/safe-action";

export async function createGalleryImage(data: any): Promise<ActionResponse<any>> {
  return withSafeAction("createGalleryImage", async () => {
    const { src, category, featured, translations } = data;

    const image = await db.galleryImage.create({
      data: {
        src,
        category,
        featured: featured ?? false,
        order: 0,
        translations: {
          create: translations
        }
      }
    });

    revalidatePath("/[locale]/admin/gallery", "layout");
    revalidatePath("/[locale]/gallery", "layout");
    return image;
  }, "Erreur lors de l'ajout de l'image à la galerie");
}

export async function updateGalleryImage(data: any): Promise<ActionResponse<any>> {
  return withSafeAction("updateGalleryImage", async () => {
    const { id, src, category, featured, translations } = data;

    const image = await db.galleryImage.update({
      where: { id },
      data: {
        src,
        category,
        featured: featured ?? false,
        translations: {
          deleteMany: {},
          create: translations
        }
      }
    });

    revalidatePath("/[locale]/admin/gallery", "layout");
    revalidatePath("/[locale]/gallery", "layout");
    return image;
  }, "Erreur lors de la mise à jour de l'image");
}

export async function deleteGalleryImage(id: string): Promise<ActionResponse<any>> {
  return withSafeAction("deleteGalleryImage", async () => {
    await db.galleryImage.delete({ where: { id } });
    revalidatePath("/[locale]/admin/gallery", "layout");
    revalidatePath("/[locale]/gallery", "layout");
    return { id };
  }, "Impossible de supprimer l'image");
}