"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Interface pour le retour de la fonction
export interface ContactMessageResult {
  success: boolean;
  error?: string;
}

// 1. ENVOYER UN MESSAGE (Depuis le site public)
export async function sendContactMessage(formData: any): Promise<ContactMessageResult> {
  try {
    // ✅ CORRECTION: Utilisation du bon modèle Prisma (contactMessage, PAS message)
    const newMessage = await db.contactMessage.create({
      data: {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        isRead: false, // ✅ CORRECTION: isRead (pas read)
      },
    });

    // NOTIFICATION À TOUS LES ADMINS
    const admins = await db.user.findMany({ where: { role: 'ADMIN' } });
    const adminEmails = admins.map(a => a.email);

    if (adminEmails.length > 0) {
      await resend.emails.send({
        from: 'CREDDA-ULPGL <system@credda-ulpgl.org>',
        to: adminEmails,
        subject: `[NOUVEAU MESSAGE] ${formData.subject}`,
        html: `<p>Un nouveau message de <strong>${formData.name}</strong> a été reçu sur le portail.</p>
               <p><em>"${formData.message.substring(0, 100)}..."</em></p>
               <a href="https://credda-ulpgl.org/admin/messages">Voir le message complet</a>`
      });
    }

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Erreur d'envoi de message:", error);
    return { success: false, error: "Erreur lors de l'envoi du message" };
  }
}

// 2. RÉPONDRE À UN MESSAGE (Depuis l'Admin)
export async function replyToContactMessage(id: string, userEmail: string, replyText: string): Promise<ContactMessageResult> {
  try {
    await resend.emails.send({
      from: 'Secrétariat CREDDA <contact@credda-ulpgl.org>',
      to: userEmail,
      subject: `RE: Votre demande au CREDDA`,
      html: `<div style="font-family: serif; line-height: 1.6; color: #1e293b;">
               <p>Cher(e) collègue/partenaire,</p>
               <p>${replyText}</p>
               <br/>
               <p>Cordialement,</p>
               <p><strong>L'équipe du CREDDA-ULPGL</strong></p>
             </div>`
    });

    // ✅ CORRECTION: Utilisation de contactMessage et isRead
    await db.contactMessage.update({
      where: { id },
      data: { 
        isRead: true,
        replyContent: replyText,
        repliedAt: new Date()
      }
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Erreur de réponse:", error);
    return { success: false, error: "Erreur lors de l'envoi de la réponse" };
  }
}

// 3. SUPPRIMER
export async function deleteMessage(id: string): Promise<ContactMessageResult> {
  try {
    await db.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Erreur de suppression:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

// 4. MARQUER COMME LU
export async function markMessageAsRead(id: string): Promise<ContactMessageResult> {
  try {
    await db.contactMessage.update({
      where: { id },
      data: { isRead: true }
    });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Erreur de mise à jour:", error);
    return { success: false, error: "Erreur lors du marquage" };
  }
}

// 5. RÉCUPÉRER TOUS LES MESSAGES
export async function getAllMessages() {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: messages };
  } catch (error) {
    console.error("Erreur de récupération:", error);
    return { success: false, error: "Erreur lors de la récupération des messages" };
  }
}

// 6. RÉCUPÉRER UN MESSAGE PAR ID
export async function getMessageById(id: string) {
  try {
    const message = await db.contactMessage.findUnique({
      where: { id }
    });
    return { success: true, data: message };
  } catch (error) {
    console.error("Erreur de récupération:", error);
    return { success: false, error: "Erreur lors de la récupération du message" };
  }
}