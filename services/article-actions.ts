// services/article-actions.ts
"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Domain } from "@prisma/client";

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
        translations: {
          create: translations // Array de { language, title, content, excerpt }
        }
      }
    });

    revalidatePath("/[locale]/admin/articles", "layout");
    return { success: true, id: article.id };
  } catch (error) {
    console.error("Erreur création article:", error);
    return { success: false, error: "Erreur lors de la création" };
  }
}