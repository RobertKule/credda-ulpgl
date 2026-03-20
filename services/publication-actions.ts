// services/publication-actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface PublicationResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function getPublicationsByDomain(domain: "RESEARCH" | "CLINICAL", locale: string): Promise<PublicationResult> {
  try {
    const publications = await db.publication.findMany({
      where: { domain },
      include: {
        translations: {
          where: { language: locale }
        }
      },
      orderBy: { year: 'desc' }
    });
    return { success: true, data: publications };
  } catch (error) {
    console.error(`❌ Erreur récupération publications ${domain}:`, error);
    return { success: false, error: "Erreur lors de la récupération des publications" };
  }
}

export async function createPublication(data: any): Promise<PublicationResult> {
  try {
    const pub = await db.publication.create({
      data: {
        slug: data.slug,
        year: parseInt(data.year),
        pdfUrl: data.pdfUrl,
        domain: data.domain || "RESEARCH",
        doi: data.doi,
        translations: {
          create: data.translations
        }
      }
    });
    revalidatePath("/admin/publications");
    return { success: true, data: pub };
  } catch (error) {
    return { success: false, error: "Erreur de création" };
  }
}

export async function deletePublication(id: string): Promise<PublicationResult> {
  try {
    await db.publication.delete({
      where: { id }
    });
    revalidatePath("/admin/publications");
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur suppression publication:", error);
    return { success: false, error: "Erreur de suppression" };
  }
}

export async function updatePublication(id: string, data: any): Promise<PublicationResult> {
  try {
    const pub = await db.publication.update({
      where: { id },
      data: {
        slug: data.slug,
        year: parseInt(data.year),
        pdfUrl: data.pdfUrl,
        domain: data.domain,
        doi: data.doi,
        translations: {
          deleteMany: {},
          create: data.translations
        }
      }
    });
    revalidatePath("/admin/publications");
    return { success: true, data: pub };
  } catch (error) {
    console.error("❌ Erreur mise à jour publication:", error);
    return { success: false, error: "Erreur de mise à jour" };
  }
}