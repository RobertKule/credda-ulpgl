"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Resend } from 'resend';

// ✅ UTILISATION DES VARIABLES D'ENVIRONNEMENT
const resend = new Resend(process.env.RESEND_API_KEY);

// Interface pour le retour de la fonction
export interface ContactMessageResult {
  success: boolean;
  error?: string;
  data?: any;
}

// 1. ENVOYER UN MESSAGE (Depuis le site public)
export async function sendContactMessage(formData: any): Promise<ContactMessageResult> {
  try {
    const newMessage = await db.contactMessage.create({
      data: {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        isRead: false,
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
               <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://credda-ulpgl.vercel.app'}/admin/messages">Voir le message complet</a>`
      });
    }

    revalidatePath("/admin/messages");
    return { success: true, data: newMessage };
  } catch (error) {
    console.error("❌ Erreur d'envoi de message:", error);
    return { success: false, error: "Erreur lors de l'envoi du message" };
  }
}

// 2. RÉPONDRE À UN MESSAGE (Depuis l'Admin)
export async function replyToContactMessage(id: string, userEmail: string, replyText: string): Promise<ContactMessageResult> {
  try {
    await resend.emails.send({
      from: `Secrétariat CREDDA <${process.env.RESEND_FROM_EMAIL || 'contact@credda-ulpgl.org'}>`,
      to: userEmail,
      subject: `RE: Votre demande au CREDDA`,
      html: `<div style="font-family: serif; line-height: 1.6; color: #1e293b;">
               <p>Cher(e) collègue/partenaire,</p>
               <p>${replyText}</p>
               <br/>
               <p>Cordialement,</p>
               <p><strong>L'équipe du CREDDA-ULPGL</strong></p>
               <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
               <p style="font-size: 12px; color: #64748b;">
                 ${process.env.NEXT_PUBLIC_APP_NAME || 'CREDDA-ULPGL'} - ${process.env.NEXT_PUBLIC_SITE_URL || 'https://credda-ulpgl.vercel.app'}
               </p>
             </div>`
    });

    const updatedMessage = await db.contactMessage.update({
      where: { id },
      data: { 
        isRead: true,
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

// 3. SUPPRIMER
export async function deleteMessage(id: string): Promise<ContactMessageResult> {
  try {
    await db.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur de suppression:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

// 4. MARQUER COMME LU
export async function markMessageAsRead(id: string): Promise<ContactMessageResult> {
  try {
    const message = await db.contactMessage.update({
      where: { id },
      data: { isRead: true }
    });
    revalidatePath("/admin/messages");
    return { success: true, data: message };
  } catch (error) {
    console.error("❌ Erreur de mise à jour:", error);
    return { success: false, error: "Erreur lors du marquage" };
  }
}

// 5. RÉCUPÉRER TOUS LES MESSAGES
export async function getAllMessages(): Promise<ContactMessageResult> {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: messages };
  } catch (error) {
    console.error("❌ Erreur de récupération:", error);
    return { success: false, error: "Erreur lors de la récupération des messages" };
  }
}

// 6. RÉCUPÉRER UN MESSAGE PAR ID
export async function getMessageById(id: string): Promise<ContactMessageResult> {
  try {
    const message = await db.contactMessage.findUnique({
      where: { id }
    });
    
    if (!message) {
      return { success: false, error: "Message non trouvé" };
    }
    
    return { success: true, data: message };
  } catch (error) {
    console.error("❌ Erreur de récupération:", error);
    return { success: false, error: "Erreur lors de la récupération du message" };
  }
}

// 7. RÉCUPÉRER LES MESSAGES NON LUS
export async function getUnreadCount(): Promise<ContactMessageResult> {
  try {
    const count = await db.contactMessage.count({
      where: { isRead: false }
    });
    return { success: true, data: { count } };
  } catch (error) {
    console.error("❌ Erreur de comptage:", error);
    return { success: false, error: "Erreur lors du comptage" };
  }
}

// 8. RÉPONDRE ET MARQUER COMME TRAITÉ
export async function replyAndMarkAsRead(id: string, replyText: string): Promise<ContactMessageResult> {
  try {
    // Récupérer le message original
    const message = await db.contactMessage.findUnique({
      where: { id }
    });

    if (!message) {
      return { success: false, error: "Message non trouvé" };
    }

    // Envoyer la réponse par email
    await resend.emails.send({
      from: `Secrétariat CREDDA <${process.env.RESEND_FROM_EMAIL || 'contact@credda-ulpgl.org'}>`,
      to: message.email,
      subject: `RE: ${message.subject}`,
      html: `<div style="font-family: serif; line-height: 1.6; color: #1e293b;">
               <p>Cher(e) ${message.name},</p>
               <p>${replyText}</p>
               <br/>
               <p>Cordialement,</p>
               <p><strong>L'équipe du CREDDA-ULPGL</strong></p>
               <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
               <p style="font-size: 12px; color: #64748b;">
                 Message original:<br/>
                 "${message.message.substring(0, 200)}${message.message.length > 200 ? '...' : ''}"
               </p>
             </div>`
    });

    // Mettre à jour le message
    const updatedMessage = await db.contactMessage.update({
      where: { id },
      data: {
        isRead: true,
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