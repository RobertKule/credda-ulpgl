// services/publication-actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { withSafeAction } from "@/lib/safe-action";
import { ApiResponse } from "@/types/api";
import { PublicationWithTranslations } from "@/types/publication";
import { Publication } from "@prisma/client";

export async function getPublicationsByDomain(domain: "RESEARCH" | "CLINICAL", locale: string): Promise<ApiResponse<PublicationWithTranslations[]>> {
  return withSafeAction("getPublicationsByDomain", async () => {
    return await db.publication.findMany({
      where: { domain },
      include: {
        translations: {
          where: { language: locale }
        }
      },
      orderBy: { year: 'desc' }
    });
  }, "Erreur lors de la récupération des publications");
}

export async function createPublication(data: {
  slug: string;
  year: string | number;
  pdfUrl: string;
  domain?: "RESEARCH" | "CLINICAL";
  doi?: string | null;
  translations: { language: string; title: string; authors: string; description: string; content?: string | null }[];
}): Promise<ApiResponse<Publication>> {
  return withSafeAction("createPublication", async () => {
    const pub = await db.publication.create({
      data: {
        slug: data.slug,
        year: typeof data.year === "string" ? parseInt(data.year) : data.year,
        pdfUrl: data.pdfUrl,
        domain: data.domain || "RESEARCH",
        doi: data.doi,
        translations: {
          create: data.translations
        }
      }
    });
    revalidatePath("/admin/publications");
    return pub;
  }, "Erreur lors de la création de la publication");
}

export async function deletePublication(id: string): Promise<ApiResponse<{ id: string }>> {
  return withSafeAction("deletePublication", async () => {
    await db.publication.delete({
      where: { id }
    });
    revalidatePath("/admin/publications");
    return { id };
  }, "Erreur lors de la suppression de la publication");
}

export async function updatePublication(id: string, data: {
  slug: string;
  year: string | number;
  pdfUrl: string;
  domain: "RESEARCH" | "CLINICAL";
  doi?: string | null;
  translations: { language: string; title: string; authors: string; description: string; content?: string | null }[];
}): Promise<ApiResponse<Publication>> {
  return withSafeAction("updatePublication", async () => {
    const pub = await db.publication.update({
      where: { id },
      data: {
        slug: data.slug,
        year: typeof data.year === "string" ? parseInt(data.year) : data.year,
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
    return pub;
  }, "Erreur lors de la mise à jour de la publication");
}