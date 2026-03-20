// services/resource-actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface ResourceResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function getAllLegalResources(locale: string): Promise<ResourceResult> {
  try {
    const resources = await db.legalResource.findMany({
      where: { published: true },
      include: {
        translations: {
          where: { language: locale }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: resources };
  } catch (error) {
    console.error("❌ Erreur récupération ressources:", error);
    return { success: false, error: "Erreur lors de la récupération des ressources" };
  }
}

export async function getLegalResourceBySlug(slug: string, locale: string): Promise<ResourceResult> {
  try {
    const resource = await db.legalResource.findUnique({
      where: { slug },
      include: {
        translations: {
          where: { language: locale }
        }
      }
    });
    return { success: true, data: resource };
  } catch (error) {
    return { success: false, error: "Ressource non trouvée" };
  }
}

// Actions d'administration
export async function createLegalResource(data: any): Promise<ResourceResult> {
  try {
    const resource = await db.legalResource.create({
      data: {
        slug: data.slug,
        category: data.category,
        published: data.published ?? false,
        translations: {
          create: data.translations // Array matching LegalResourceTranslation
        }
      }
    });
    revalidatePath("/admin/resources");
    return { success: true, data: resource };
  } catch (error) {
    return { success: false, error: "Erreur de création" };
  }
}

export async function updateLegalResource(id: string, data: any): Promise<ResourceResult> {
  try {
    const resource = await db.legalResource.update({
      where: { id },
      data: {
        slug: data.slug,
        category: data.category,
        published: data.published,
      }
    });
    
    // Mise à jour des traductions (logique simplifiée)
    for (const trans of data.translations) {
      await db.legalResourceTranslation.upsert({
        where: { id: trans.id || 'new-id' },
        update: {
          title: trans.title,
          description: trans.description,
          content: trans.content,
          fileUrl: trans.fileUrl
        },
        create: {
          title: trans.title,
          description: trans.description,
          content: trans.content,
          fileUrl: trans.fileUrl,
          language: trans.language,
          resourceId: id
        }
      });
    }

    revalidatePath("/admin/resources");
    return { success: true, data: resource };
  } catch (error) {
    return { success: false, error: "Erreur de mise à jour" };
  }
}
