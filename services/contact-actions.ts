// services/contact-actions.ts - VERSION CORRIGÉE
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // NOTIFICATION À TOUS LES ADMINS
    const admins = await db.user.findMany({ where: { role: 'ADMIN' } });
    const adminEmails = admins.map(a => a.email).filter(Boolean);

    if (adminEmails.length > 0) {
      try {
        await resend.emails.send({
          from: 'CREDDA-ULPGL <onboarding@resend.dev>', // Utilisez votre domaine vérifié
          to: adminEmails,
          subject: `📬 NOUVEAU MESSAGE: ${formData.subject}`,
          html: `
            <div style="font-family: sans-serif;">
              <h2 style="color:#1e3a8a;">Nouveau message de contact</h2>
              <p><strong>De:</strong> ${formData.name} (${formData.email})</p>
              <p><strong>Sujet:</strong> ${formData.subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background:#f3f4f6; padding:15px;">
                ${formData.message.substring(0, 200)}${formData.message.length > 200 ? '...' : ''}
              </div>
              <p><a href="${process.env.NEXTAUTH_URL}/admin/messages/${newMessage.id}">Voir dans l'admin</a></p>
            </div>
          `
        });
      } catch (emailError) {
        console.error("❌ Erreur envoi email admin:", emailError);
        // Ne pas bloquer le message si l'email échoue
      }
    }

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

    // Envoyer la réponse par email
    try {
      await resend.emails.send({
        from: 'CREDDA-ULPGL <onboarding@resend.dev>',
        to: [message.email],
        subject: `RE: ${message.subject}`,
        html: `
          <div style="font-family: serif;">
            <p>Bonjour ${message.name},</p>
            <div style="background:#f8fafc; padding:20px; border-left:4px solid #1e3a8a;">
              ${replyText.replace(/\n/g, '<br/>')}
            </div>
            <br/>
            <p>Cordialement,</p>
            <p><strong>L'équipe du CREDDA-ULPGL</strong></p>
            <hr style="border:1px solid #e2e8f0;"/>
            <p style="font-size:12px; color:#64748b;">
              Message original: "${message.message.substring(0, 100)}..."
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("❌ Erreur envoi réponse:", emailError);
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
export async function getAllMessages(status?: string): Promise<ContactMessageResult> {
  try {
    const where: any = {};
    if (status && status !== "all") {
      where.status = status; // ✅ Maintenant correct
    }
    
    const messages = await db.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    return { success: true, data: messages };
  } catch (error) {
    return { success: false, error: "Erreur lors de la récupération" };
  }
}

// 6. RÉCUPÉRER LES STATISTIQUES
export async function getMessageStats(): Promise<ContactMessageResult> {
  try {
    const [total, unread, read, archived, replied] = await Promise.all([
      db.contactMessage.count(),
      db.contactMessage.count({ where: { status: "UNREAD" } }),
      db.contactMessage.count({ where: { status: "READ" } }),
      db.contactMessage.count({ where: { status: "ARCHIVED" } }),
      db.contactMessage.count({ where: { NOT: { repliedAt: null } } })
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