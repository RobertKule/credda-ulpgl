"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPublication(formData: any) {
  try {
    await db.publication.create({
      data: {
        year: parseInt(formData.year),
        doi: formData.doi,
        pdfUrl: formData.pdfUrl,
        domain: formData.domain,
        translations: { create: formData.translations }
      }
    });
    revalidatePath("/[locale]/admin/publications", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur lors de la création" };
  }
}

export async function deletePublication(id: string) {
  try {
    await db.publication.delete({ where: { id } });
    revalidatePath("/[locale]/admin/publications", "layout");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
export async function updatePublication(id: string, formData: any) {
  try {
    await db.publication.update({
      where: { id },
      data: {
        year: parseInt(formData.year),
        doi: formData.doi,
        pdfUrl: formData.pdfUrl,
        domain: formData.domain,
        translations: {
          deleteMany: {},
          create: formData.translations
        }
      }
    });
    revalidatePath("/[locale]/admin/publications", "layout");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}