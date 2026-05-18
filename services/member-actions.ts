"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/types/api";
import { withSafeAction } from "@/lib/safe-action";
import { memberSchema, updateMemberSchema } from "@/schemas/member";
import { Member } from "@prisma/client";

export async function createMember(rawData: unknown): Promise<ApiResponse<Member>> {
  return withSafeAction("createMember", async () => {
    const data = memberSchema.parse(rawData);
    const { translations, ...memberData } = data;

    const member = await db.member.create({
      data: {
        ...memberData,
        translations: { 
          create: translations
        }
      }
    });

    revalidatePath("/[locale]/admin/members", "layout");
    return member;
  }, "Erreur lors de l'intégration du membre");
}

export async function deleteMember(id: string): Promise<ApiResponse<{ id: string }>> {
  return withSafeAction("deleteMember", async () => {
    await db.member.delete({ where: { id } });
    revalidatePath("/[locale]/admin/members", "layout");
    return { id };
  }, "Impossible de supprimer ce membre");
}

export async function updateMember(id: string, rawData: unknown): Promise<ApiResponse<Member>> {
  return withSafeAction("updateMember", async () => {
    const data = updateMemberSchema.parse({ ... (rawData as object), id });
    const { translations, id: _, ...memberData } = data;

    const member = await db.member.update({
      where: { id },
      data: {
        ...memberData,
        translations: {
          deleteMany: {},
          create: translations
        }
      }
    });

    revalidatePath("/[locale]/admin/members", "layout");
    return member;
  }, "Erreur lors de la mise à jour du profil membre");
}