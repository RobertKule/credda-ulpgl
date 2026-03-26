"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { withSafeAction, ActionResponse } from "@/lib/safe-action";

export async function createMember(formData: any): Promise<ActionResponse<any>> {
  return withSafeAction("createMember", async () => {
    const member = await db.member.create({
      data: {
        image: formData.image,
        email: formData.email,
        order: parseInt(formData.order) || 0,
        translations: { create: formData.translations }
      }
    });
    revalidatePath("/[locale]/admin/members", "layout");
    return member;
  }, "Erreur lors de l'intégration du membre");
}

export async function deleteMember(id: string): Promise<ActionResponse<any>> {
  return withSafeAction("deleteMember", async () => {
    await db.member.delete({ where: { id } });
    revalidatePath("/[locale]/admin/members", "layout");
    return { id };
  }, "Impossible de supprimer ce membre");
}

export async function updateMember(id: string, formData: any): Promise<ActionResponse<any>> {
  return withSafeAction("updateMember", async () => {
    const member = await db.member.update({
      where: { id },
      data: {
        image: formData.image,
        email: formData.email,
        order: parseInt(formData.order) || 0,
        translations: {
          deleteMany: {},
          create: formData.translations
        }
      }
    });
    revalidatePath("/[locale]/admin/members", "layout");
    return member;
  }, "Erreur lors de la mise à jour du profil membre");
}