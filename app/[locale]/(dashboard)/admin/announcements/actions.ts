"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Crée ou met à jour l'annonce globale.
 * Désactive toutes les autres annonces si celle-ci est marquée comme active.
 */
export async function createOrUpdateAnnouncement(data: {
  id?: string;
  level: "INFO" | "WARNING" | "URGENT";
  isActive: boolean;
  translations: Record<string, { title?: string; content: string }>;
}) {
  const session = await auth();
  if (!session || !session.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
    throw new Error("Action non autorisée");
  }

  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Si l'annonce doit être active, on désactive les autres
      if (data.isActive) {
        await tx.announcement.updateMany({
          where: { isActive: true },
          data: { isActive: false }
        });
      }

      // 2. Upsert de l'annonce parente
      const announcement = data.id 
        ? await tx.announcement.update({
            where: { id: data.id },
            data: { level: data.level, isActive: data.isActive }
          })
        : await tx.announcement.create({
            data: { level: data.level, isActive: data.isActive }
          });

      // 3. Upsert des traductions
      for (const [lang, trans] of Object.entries(data.translations)) {
        await tx.announcementTranslation.upsert({
          where: {
            announcementId_language: {
              announcementId: announcement.id,
              language: lang
            }
          },
          update: { title: trans.title, content: trans.content },
          create: {
            announcementId: announcement.id,
            language: lang,
            title: trans.title,
            content: trans.content
          }
        });
      }

      // 4. Log d'Audit
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: data.id ? "UPDATE_ANNOUNCEMENT" : "CREATE_ANNOUNCEMENT",
          entity: "Announcement",
          entityId: announcement.id,
          details: `${data.id ? "Mise à jour" : "Création"} de l'annonce globale (Status: ${data.isActive ? "ACTIVE" : "INACTIVE"})`,
        }
      });

      return announcement;
    });

    revalidatePath("/", "layout");
    return { success: true, announcement: result };
  } catch (error: any) {
    console.error("[ANNOUNCEMENT_ACTION_ERROR]", error);
    return { error: "Échec de l'enregistrement de l'annonce" };
  }
}

/**
 * Récupère l'annonce active pour une locale donnée.
 * Utilisable dans un Server Component public.
 */
export async function getActiveAnnouncement(locale: string) {
  try {
    const announcement = await db.announcement.findFirst({
      where: { isActive: true },
      include: {
        announcementTranslations: {
          where: { language: locale }
        }
      }
    });

    if (!announcement || !announcement.announcementTranslations[0]) return null;

    return {
      id: announcement.id,
      level: announcement.level,
      title: announcement.announcementTranslations[0].title,
      content: announcement.announcementTranslations[0].content,
      updatedAt: announcement.updatedAt
    };
  } catch (error) {
    console.error("[GET_ACTIVE_ANNOUNCEMENT_ERROR]", error);
    return null;
  }
}
