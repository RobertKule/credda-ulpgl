// services/program-actions.ts
"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteProgram(id: string) {
  try {
    await db.program.delete({ where: { id } });
    revalidatePath("/admin/programs", "layout");
    revalidatePath("/programs", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete program" };
  }
}

export async function createProgram(data: any) {
  try {
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
    return { success: true, data: program };
  } catch (error) {
    console.error("Error creating program:", error);
    return { success: false, error: "Failed to create program" };
  }
}

export async function updateProgram(data: any) {
  try {
    const { id, slug, mainImage, published, featured, translations } = data;

    await db.program.update({
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
    return { success: true };
  } catch (error) {
    console.error("Error updating program:", error);
    return { success: false, error: "Failed to update program" };
  }
}

export async function toggleProgramPublished(id: string, published: boolean) {
  try {
    await db.program.update({
      where: { id },
      data: { published }
    });
    revalidatePath("/admin/programs", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update status" };
  }
}

export async function toggleProgramFeatured(id: string, featured: boolean) {
  try {
    await db.program.update({
      where: { id },
      data: { featured }
    });
    revalidatePath("/admin/programs", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update status" };
  }
}
