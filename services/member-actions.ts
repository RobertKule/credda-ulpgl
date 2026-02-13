"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createMember(formData: any) {
  try {
    await db.member.create({
      data: {
        image: formData.image,
        email: formData.email,
        order: parseInt(formData.order),
        translations: { create: formData.translations }
      }
    });
    revalidatePath("/[locale]/admin/members", "layout");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteMember(id: string) {
  try {
    await db.member.delete({ where: { id } });
    revalidatePath("/[locale]/admin/members", "layout");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
export async function updateMember(id: string, formData: any) {
  try {
    await db.member.update({
      where: { id },
      data: {
        image: formData.image,
        email: formData.email,
        order: parseInt(formData.order),
        translations: {
          deleteMany: {}, // On nettoie et on recrée pour simplifier l'update multilingue
          create: formData.translations
        }
      }
    });
    revalidatePath("/[locale]/admin/members", "layout");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}