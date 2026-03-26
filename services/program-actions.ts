// services/program-actions.ts
"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { withSafeAction, ActionResponse } from "@/lib/safe-action";

export async function deleteProgram(id: string): Promise<ActionResponse<any>> {
  return withSafeAction("deleteProgram", async () => {
    await db.program.delete({ where: { id } });
    revalidatePath("/admin/programs", "layout");
    revalidatePath("/programs", "layout");
    return { id };
  }, "Erreur lors de la suppression du programme");
}

export async function createProgram(data: any): Promise<ActionResponse<any>> {
  return withSafeAction("createProgram", async () => {
    const { slug, mainImage, published, featured, translations } = data;
    
    const program = await db.program.create({
      data: {
        slug,
        mainImage,
        published,
        featured,
        translations: {
          create: translations
        }
      }
    });

    revalidatePath("/admin/programs", "layout");
    revalidatePath("/programs", "layout");
    return program;
  }, "Erreur lors de la création du programme");
}

export async function updateProgram(data: any): Promise<ActionResponse<any>> {
  return withSafeAction("updateProgram", async () => {
    const { id, slug, mainImage, published, featured, translations } = data;

    const program = await db.program.update({
      where: { id },
      data: {
        slug,
        mainImage,
        published,
        featured,
        translations: {
          deleteMany: {},
          create: translations
        }
      }
    });

    revalidatePath("/admin/programs", "layout");
    revalidatePath("/programs", "layout");
    return program;
  }, "Erreur lors de la mise à jour du programme");
}

export async function toggleProgramPublished(id: string, published: boolean): Promise<ActionResponse<any>> {
  return withSafeAction("toggleProgramPublished", async () => {
    return await db.program.update({
      where: { id },
      data: { published }
    });
  }, "Erreur lors de la modification du statut de publication");
}

export async function toggleProgramFeatured(id: string, featured: boolean): Promise<ActionResponse<any>> {
  return withSafeAction("toggleProgramFeatured", async () => {
    return await db.program.update({
      where: { id },
      data: { featured }
    });
  }, "Erreur lors de la modification de la mise en avant");
}
