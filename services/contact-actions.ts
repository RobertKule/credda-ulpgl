// services/contact-actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { withSafeAction, ActionResponse } from "@/lib/safe-action";
import { sendContactNotification, sendReplyNotification } from "./mail-service";

/**
 * 1. ENVOYER UN MESSAGE (Depuis le site public)
 * Standardisé avec withSafeAction.
 * Le message est sauvegardé en base même si la notification email échoue.
 */
export async function sendContactMessage(formData: any): Promise<ActionResponse<any>> {
  return withSafeAction("sendContactMessage", async () => {
    // Étape 1: Sauvegarde en base de données
    const newMessage = await db.contactMessage.create({
      data: {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || "Sans sujet",
        message: formData.message,
        status: "UNREAD",
      },
    });

    // Étape 2: Notification Admin (échec non bloquant)
    try {
      await sendContactNotification(formData.name, formData.email, formData.message);
    } catch (emailError) {
      console.error("⚠️ Erreur silencieuse d'envoi d'email notification:", emailError);
    }

    revalidatePath("/admin/messages");
    return newMessage;
  }, "Erreur lors de l'envoi du message. Veuillez réessayer.");
}

/**
 * 2. RÉPONDRE À UN MESSAGE
 */
export async function replyToContactMessage(id: string, replyText: string): Promise<ActionResponse<any>> {
  return withSafeAction("replyToContactMessage", async () => {
    const message = await db.contactMessage.findUnique({ where: { id } });
    if (!message) throw new Error("Message introuvable.");

    // Envoi de la réponse (bloquant car c'est l'action principale ici)
    const emailRes = await sendReplyNotification(
      message.email, 
      message.name, 
      message.subject || "Réponse CREDDA", 
      replyText,
      message.message
    );

    if (!emailRes.success) {
      throw new Error("Impossible d'envoyer l'email de réponse. Vérifiez votre configuration Resend.");
    }

    const updatedMessage = await db.contactMessage.update({
      where: { id },
      data: {
        status: "READ",
        replyContent: replyText,
        repliedAt: new Date()
      }
    });

    revalidatePath("/admin/messages");
    return updatedMessage;
  }, "Erreur lors de l'envoi de la réponse.");
}

/**
 * 3. MARQUER COMME LU
 */
export async function markMessageAsRead(id: string): Promise<ActionResponse<any>> {
  return withSafeAction("markMessageAsRead", async () => {
    const res = await db.contactMessage.update({
      where: { id },
      data: { status: "READ" }
    });
    revalidatePath("/admin/messages");
    return res;
  }, "Erreur lors de la mise à jour du statut.");
}

/**
 * 4. ARCHIVER UN MESSAGE
 */
export async function archiveMessage(id: string): Promise<ActionResponse<any>> {
  return withSafeAction("archiveMessage", async () => {
    const res = await db.contactMessage.update({
      where: { id },
      data: { status: "ARCHIVED" }
    });
    revalidatePath("/admin/messages");
    return res;
  }, "Erreur lors de l'archivage du message.");
}

/**
 * 5. RÉCUPÉRER TOUS LES MESSAGES (Pour l'admin)
 */
export async function getAllMessages(status?: string, limit: number = 20, cursor?: string): Promise<ActionResponse<any>> {
  return withSafeAction("getAllMessages", async () => {
    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const messages = await db.contactMessage.findMany({
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      where,
      orderBy: { createdAt: 'desc' }
    });

    let nextCursor: string | undefined = undefined;
    if (messages.length > limit) {
      const nextItem = messages.pop();
      nextCursor = nextItem!.id;
    }

    return { messages, nextCursor };
  }, "Erreur lors de la récupération des messages.");
}

/**
 * 6. RÉCUPÉRER LES STATISTIQUES (Pour le dashboard)
 */
export async function getMessageStats(): Promise<ActionResponse<any>> {
  return withSafeAction("getMessageStats", async () => {
    const [total, unread, read, archived, replied] = await Promise.all([
      db.contactMessage.count(),
      db.contactMessage.count({ where: { status: "UNREAD" } }),
      db.contactMessage.count({ where: { status: "READ" } }),
      db.contactMessage.count({ where: { status: "ARCHIVED" } }),
      db.contactMessage.count({ where: { NOT: { repliedAt: null } } }),
    ]);

    return {
      total,
      unread,
      read,
      archived,
      replied,
      responseRate: total > 0 ? Math.round((replied / total) * 100) : 0
    };
  }, "Erreur lors du calcul des statistiques.");
}