"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Domain } from "@prisma/client";

// CRÉER
export async function createArticle(formData: any) {
  const { slug, domain, categoryId, translations, mainImage, videoUrl } = formData;
  try {
    const article = await db.article.create({
      data: {
        slug,
        domain: domain as Domain,
        categoryId,
        mainImage,
        videoUrl,
        published: true,
        translations: { create: translations }
      }
    });
    revalidatePath("/[locale]/admin/articles", "layout");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erreur lors de la création" };
  }
}

// SUPPRIMER
export async function deleteArticle(id: string) {
  try {
    await db.article.delete({ where: { id } });
    revalidatePath("/[locale]/admin/articles", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Impossible de supprimer l'article" };
  }
}

// TOGGLE PUBLICATION
export async function toggleArticleStatus(id: string, currentStatus: boolean) {
  try {
    await db.article.update({
      where: { id },
      data: { published: !currentStatus }
    });
    revalidatePath("/[locale]/admin/articles", "layout");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}