"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Domain } from "@prisma/client";
import { withSafeAction, ActionResponse } from "@/lib/safe-action";

export async function updateArticle(data: any): Promise<ActionResponse<any>> {
  return withSafeAction("updateArticle", async () => {
    const article = await db.article.update({
      where: { id: data.id },
      data: {
        slug: data.slug,
        domain: data.domain,
        categoryId: data.categoryId,
        videoUrl: data.videoUrl,
        mainImage: data.mainImage,
        published: data.published,
        translations: {
          deleteMany: {},
          create: data.translations
        }
      }
    });
    revalidatePath("/[locale]/admin/articles", "layout");
    revalidatePath("/[locale]/research", "layout");
    return article;
  }, "Erreur lors de la mise à jour de l'article");
}

export async function createArticle(formData: any): Promise<ActionResponse<any>> {
  return withSafeAction("createArticle", async () => {
    const { slug, domain, categoryId, translations, mainImage, videoUrl, published } = formData;

    const existing = await db.article.findUnique({ where: { slug } })
    if (existing) {
      throw new Error("Ce slug existe déjà. Veuillez en choisir un autre.");
    }

    const article = await db.article.create({
      data: {
        slug,
        domain: domain as Domain,
        categoryId,
        mainImage,
        videoUrl,
        published: published ?? true,
        translations: { create: translations }
      }
    });

    revalidatePath("/[locale]/admin/articles", "layout");
    revalidatePath("/[locale]/research", "layout");
    return article;
  }, "Erreur lors de la création de l'article");
}

export async function deleteArticle(id: string): Promise<ActionResponse<any>> {
  return withSafeAction("deleteArticle", async () => {
    await db.article.delete({ where: { id } });
    revalidatePath("/[locale]/admin/articles", "layout");
    revalidatePath("/[locale]/research", "layout");
    return { id };
  }, "Impossible de supprimer l'article");
}

export async function toggleArticleStatus(id: string, currentStatus: boolean): Promise<ActionResponse<any>> {
  return withSafeAction("toggleArticleStatus", async () => {
    const article = await db.article.update({
      where: { id },
      data: { published: !currentStatus }
    });
    revalidatePath("/[locale]/admin/articles", "layout");
    revalidatePath("/[locale]/research", "layout");
    return article;
  }, "Erreur lors de la modification du statut");
}