// services/contact-actions.ts - VERSION CORRIGÉE
"use server";

import { db } from "@/lib/db";
import { safeQuery } from "@/lib/db-safe";
import { revalidatePath } from "next/cache";
import { sendContactNotification, sendReplyNotification } from "./mail-service";

export interface ContactMessageResult {
  success: boolean;
  error?: string;
  data?: any;
}

// 1. ENVOYER UN MESSAGE (Depuis le site public)
export async function sendContactMessage(formData: any): Promise<ContactMessageResult> {
  try {
    // ✅ CORRECTION: Utiliser 'status' au lieu de 'isRead'
    const newMessage = await db.contactMessage.create({
      data: {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: "UNREAD", // ✅ correspond au schéma
      },
    });

    // NOTIFICATION À L'ADMIN (via mail-service)
    await sendContactNotification(formData.name, formData.email, formData.message);

    revalidatePath("/admin/messages");
    return { success: true, data: newMessage };
  } catch (error) {
    console.error("❌ Erreur d'envoi de message:", error);
    return { success: false, error: "Erreur lors de l'envoi du message" };
  }
}

// 2. RÉPONDRE À UN MESSAGE
export async function replyToContactMessage(id: string, replyText: string): Promise<ContactMessageResult> {
  try {
    // Récupérer le message
    const message = await db.contactMessage.findUnique({
      where: { id }
    });

    if (!message) {
      return { success: false, error: "Message non trouvé" };
    }

    // Envoyer la réponse (via mail-service)
    const emailRes = await sendReplyNotification(
      message.email, 
      message.name, 
      message.subject, 
      replyText,
      message.message
    );

    if (!emailRes.success) {
      return { success: false, error: "Erreur lors de l'envoi de l'email" };
    }

    // ✅ Mettre à jour avec les champs corrects
    const updatedMessage = await db.contactMessage.update({
      where: { id },
      data: {
        status: "READ",
        replyContent: replyText,
        repliedAt: new Date()
      }
    });

    revalidatePath("/admin/messages");
    return { success: true, data: updatedMessage };
  } catch (error) {
    console.error("❌ Erreur de réponse:", error);
    return { success: false, error: "Erreur lors de l'envoi de la réponse" };
  }
}

// 3. MARQUER COMME LU
export async function markMessageAsRead(id: string): Promise<ContactMessageResult> {
  try {
    const message = await db.contactMessage.update({
      where: { id },
      data: { status: "READ" } // ✅ CORRECTION
    });
    revalidatePath("/admin/messages");
    return { success: true, data: message };
  } catch (error) {
    console.error("❌ Erreur de mise à jour:", error);
    return { success: false, error: "Erreur lors du marquage" };
  }
}

// 4. ARCHIVER UN MESSAGE (NOUVEAU)
export async function archiveMessage(id: string): Promise<ContactMessageResult> {
  try {
    const message = await db.contactMessage.update({
      where: { id },
      data: { status: "ARCHIVED" }
    });
    revalidatePath("/admin/messages");
    return { success: true, data: message };
  } catch (error) {
    console.error("❌ Erreur d'archivage:", error);
    return { success: false, error: "Erreur lors de l'archivage" };
  }
}

// 5. RÉCUPÉRER TOUS LES MESSAGES
export async function getAllMessages(status?: string, limit: number = 20, cursor?: string): Promise<ContactMessageResult> {
  try {
    const where: any = {};
    if (status && status !== "all") {
      where.status = status; // ✅ Maintenant correct
    }

    const messages = await db.contactMessage.findMany({
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      where,
      orderBy: { createdAt: 'desc' }
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (messages.length > limit) {
      const nextItem = messages.pop();
      nextCursor = nextItem!.id;
    }

    return { success: true, data: { messages, nextCursor } };
  } catch (error) {
    return { success: false, error: "Erreur lors de la récupération" };
  }
}

// 6. RÉCUPÉRER LES STATISTIQUES
export async function getMessageStats(): Promise<ContactMessageResult> {
  try {
    const [total, unread, read, archived, replied] = await Promise.all([
      safeQuery(() => db.contactMessage.count(), 0, "contactStats:total"),
      safeQuery(() => db.contactMessage.count({ where: { status: "UNREAD" } }), 0, "contactStats:unread"),
      safeQuery(() => db.contactMessage.count({ where: { status: "READ" } }), 0, "contactStats:read"),
      safeQuery(() => db.contactMessage.count({ where: { status: "ARCHIVED" } }), 0, "contactStats:archived"),
      safeQuery(
        () => db.contactMessage.count({ where: { NOT: { repliedAt: null } } }),
        0,
        "contactStats:replied"
      )
    ]);

    return {
      success: true,
      data: {
        total,
        unread,
        read,
        archived,
        replied,
        responseRate: total > 0 ? Math.round((replied / total) * 100) : 0
      }
    };
  } catch (error) {
    console.error("❌ Erreur stats:", error);
    return { success: false, error: "Erreur lors du calcul des statistiques" };
  }
}