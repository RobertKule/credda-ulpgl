"use server";

import { logger } from "@/lib/logger";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { withSafeAction } from "@/lib/safe-action";
import { sendContactNotification, sendReplyNotification } from "./mail-service";
import { sendContactMessageSchema, replyToContactMessageSchema, contactStatusSchema } from "@/schemas/contact";
import { ContactMessage, ContactStatus, ContactStats } from "@/types/contact";

/**
 * 1. ENVOYER UN MESSAGE (Depuis le site public)
 * Standardisé avec withSafeAction.
 * Le message est sauvegardé en base même si la notification email échoue.
 */
export async function sendContactMessage(rawData: unknown): Promise<ApiResponse<ContactMessage>> {
  return withSafeAction("sendContactMessage", async () => {
    const data = sendContactMessageSchema.parse(rawData);
    
    // Étape 1: Sauvegarde en base de données
    const newMessage = await db.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject || "Sans sujet",
        message: data.message,
        status: ContactStatus.UNREAD,
      },
    });

    // Étape 2: Notification Admin (échec non bloquant)
    try {
      await sendContactNotification(data.name, data.email, data.message);
    } catch (emailError) {
      logger.warn({ err: emailError, email: data.email }, "⚠️ Erreur silencieuse d'envoi d'email notification");
    }

    revalidatePath("/admin/messages");
    return newMessage;
  }, "Erreur lors de l'envoi du message. Veuillez réessayer.");
}

/**
 * 2. RÉPONDRE À UN MESSAGE
 */
export async function replyToContactMessage(id: string, replyText: string): Promise<ApiResponse<ContactMessage>> {
  return withSafeAction("replyToContactMessage", async () => {
    const data = replyToContactMessageSchema.parse({ id, replyText });
    
    const message = await db.contactMessage.findUnique({ where: { id: data.id } });
    if (!message) throw new Error("Message introuvable.");

    // Envoi de la réponse (bloquant car c'est l'action principale ici)
    const emailRes = await sendReplyNotification(
      message.email, 
      message.name, 
      message.subject || "Réponse CREDDA", 
      data.replyText,
      message.message
    );

    if (!emailRes.success) {
      throw new Error("Impossible d'envoyer l'email de réponse. Vérifiez votre configuration Resend.");
    }

    const updatedMessage = await db.contactMessage.update({
      where: { id: data.id },
      data: {
        status: ContactStatus.READ
      }
    });

    revalidatePath("/admin/messages");
    return updatedMessage;
  }, "Erreur lors de l'envoi de la réponse.");
}

/**
 * 3. MARQUER COMME LU
 */
export async function markMessageAsRead(id: string): Promise<ApiResponse<ContactMessage>> {
  return withSafeAction("markMessageAsRead", async () => {
    const res = await db.contactMessage.update({
      where: { id },
      data: { status: ContactStatus.READ }
    });
    revalidatePath("/admin/messages");
    return res;
  }, "Erreur lors de la mise à jour du statut.");
}

/**
 * 4. ARCHIVER UN MESSAGE
 */
export async function archiveMessage(id: string): Promise<ApiResponse<ContactMessage>> {
  return withSafeAction("archiveMessage", async () => {
    const res = await db.contactMessage.update({
      where: { id },
      data: { status: ContactStatus.ARCHIVED }
    });
    revalidatePath("/admin/messages");
    return res;
  }, "Erreur lors de l'archivage du message.");
}

/**
 * 5. RÉCUPÉRER TOUS LES MESSAGES (Pour l'admin)
 */
export async function getAllMessages(status?: string, limit: number = 20, cursor?: string): Promise<PaginatedResponse<ContactMessage>> {
  return withSafeAction("getAllMessages", async () => {
    const where: any = {};
    if (status && status !== "all") {
      where.status = status as ContactStatus;
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

    return { 
      items: messages, 
      total: await db.contactMessage.count({ where }), 
      nextCursor 
    };
  }, "Erreur lors de la récupération des messages.");
}

/**
 * 6. RÉCUPÉRER LES STATISTIQUES (Pour le dashboard)
 */
export async function getMessageStats(): Promise<ApiResponse<ContactStats>> {
  return withSafeAction("getMessageStats", async () => {
    const [total, unread, read, archived, replied] = await Promise.all([
      db.contactMessage.count(),
      db.contactMessage.count({ where: { status: ContactStatus.UNREAD } }),
      db.contactMessage.count({ where: { status: ContactStatus.READ } }),
      db.contactMessage.count({ where: { status: ContactStatus.ARCHIVED } }),
      db.contactMessage.count({ where: { status: ContactStatus.READ } }),
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