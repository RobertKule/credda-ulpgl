"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/types/api";
import { withSafeAction } from "@/lib/safe-action";
import { programSchema, updateProgramSchema } from "@/schemas/program";
import { Program } from "@prisma/client";

export async function deleteProgram(id: string): Promise<ApiResponse<{ id: string }>> {
  return withSafeAction("deleteProgram", async () => {
    await db.program.delete({ where: { id } });
    revalidatePath("/admin/programs", "layout");
    revalidatePath("/programs", "layout");
    return { id };
  }, "Erreur lors de la suppression du programme");
}

export async function createProgram(rawData: unknown): Promise<ApiResponse<Program>> {
  return withSafeAction("createProgram", async () => {
    const data = programSchema.parse(rawData);
    const { slug, mainImage, published, featured, translations } = data;
    
    const program = await db.program.create({
      data: {
        slug,
        mainImage: mainImage || null,
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

export async function updateProgram(rawData: unknown): Promise<ApiResponse<Program>> {
  return withSafeAction("updateProgram", async () => {
    const data = updateProgramSchema.parse(rawData);
    const { id, slug, mainImage, published, featured, translations } = data;

    const program = await db.program.update({
      where: { id },
      data: {
        slug,
        mainImage: mainImage || null,
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

export async function toggleProgramPublished(id: string, published: boolean): Promise<ApiResponse<Program>> {
  return withSafeAction("toggleProgramPublished", async () => {
    return await db.program.update({
      where: { id },
      data: { published }
    });
  }, "Erreur lors de la modification du statut de publication");
}

export async function toggleProgramFeatured(id: string, featured: boolean): Promise<ApiResponse<Program>> {
  return withSafeAction("toggleProgramFeatured", async () => {
    return await db.program.update({
      where: { id },
      data: { featured }
    });
  }, "Erreur lors de la modification de la mise en avant");
}
