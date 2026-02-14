"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Domain } from "@prisma/client";


export async function updateArticle(data: any) {
  try {
    await db.article.update({
      where: { id: data.id },
      data: {
        slug: data.slug,
        domain: data.domain,
        categoryId: data.categoryId,
        videoUrl: data.videoUrl,
        mainImage: data.mainImage,
        published: data.published,
        translations: {
          deleteMany: {}, // Supprime les anciennes versions
          create: data.translations // Ajoute les nouvelles versions
        }
      }
    });

    revalidatePath("/[locale]/admin/articles", "layout");
    revalidatePath("/[locale]/research", "layout");
    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}
// CRÉER
export async function createArticle(formData: any) {
  const { slug, domain, categoryId, translations, mainImage, videoUrl, published } = formData;
  
  try {
    // Vérifier si le slug existe déjà
    const existing = await db.article.findUnique({ where: { slug } })
    if (existing) {
      return { success: false, error: "Ce slug existe déjà. Veuillez en choisir un autre." }
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
    return { success: true, data: article };
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
    revalidatePath("/[locale]/research", "layout");
    return { success: true };
  } catch (error) {
    console.error(error);
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
    revalidatePath("/[locale]/research", "layout");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erreur lors de la modification du statut" };
  }
}