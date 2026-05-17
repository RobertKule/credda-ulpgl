"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Domain } from "@prisma/client";
import { ApiResponse } from "@/types/api";
import { withSafeAction } from "@/lib/safe-action";
import { articleSchema, updateArticleSchema } from "@/schemas/article";
import { ArticleWithTranslations } from "@/types/article";
import { Article } from "@prisma/client";

export async function updateArticle(rawData: unknown): Promise<ApiResponse<Article>> {
  return withSafeAction("updateArticle", async () => {
    const data = updateArticleSchema.parse(rawData);
    const article = await db.article.update({
      where: { id: data.id },
      data: {
        slug: data.slug,
        domain: data.domain,
        categoryId: data.categoryId,
        videoUrl: data.videoUrl || null,
        mainImage: data.mainImage || null,
        published: data.published,
        featured: data.featured,
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

export async function createArticle(rawData: unknown): Promise<ApiResponse<Article>> {
  return withSafeAction("createArticle", async () => {
    const data = articleSchema.parse(rawData);
    const { slug, domain, categoryId, translations, mainImage, videoUrl, published, featured } = data;

    const existing = await db.article.findUnique({ where: { slug } })
    if (existing) {
      throw new Error("Ce slug existe déjà. Veuillez en choisir un autre.");
    }

    const article = await db.article.create({
      data: {
        slug,
        domain,
        categoryId,
        mainImage: mainImage || null,
        videoUrl: videoUrl || null,
        published: published,
        featured: featured,
        translations: { create: translations }
      }
    });

    revalidatePath("/[locale]/admin/articles", "layout");
    revalidatePath("/[locale]/research", "layout");
    return article;
  }, "Erreur lors de la création de l'article");
}

export async function deleteArticle(id: string): Promise<ApiResponse<{ id: string }>> {
  return withSafeAction("deleteArticle", async () => {
    await db.article.delete({ where: { id } });
    revalidatePath("/[locale]/admin/articles", "layout");
    revalidatePath("/[locale]/research", "layout");
    return { id };
  }, "Impossible de supprimer l'article");
}

export async function toggleArticleStatus(id: string, currentStatus: boolean): Promise<ApiResponse<Article>> {
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