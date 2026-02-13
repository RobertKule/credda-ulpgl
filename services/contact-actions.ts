"use server"
"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


// 1. ENVOYER UN MESSAGE (Depuis le site public)
export async function sendContactMessage(formData: any) {
  try {
    const newMessage = await db.contactMessage.create({
      data: {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
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
    return { success: false };
  }
}

// 2. RÉPONDRE À UN MESSAGE (Depuis l'Admin)
export async function replyToContactMessage(id: string, userEmail: string, replyText: string) {
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

    await db.contactMessage.update({
      where: { id },
      data: { isRead: true }
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// 3. SUPPRIMER
export async function deleteMessage(id: string) {
  await db.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
}