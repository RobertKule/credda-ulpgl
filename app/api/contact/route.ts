// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from 'resend';
import { z } from "zod";

// ✅ FORCER nodejs runtime (TRÈS IMPORTANT)
export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

// Schéma de validation
const contactSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(5, "Sujet trop court"),
  message: z.string().min(10, "Message trop court"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;

    // 1. Sauvegarder dans la base de données
    const contactMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        status: "UNREAD"
      }
    });

    // 2. Envoyer un email de confirmation à l'utilisateur
    await resend.emails.send({
      from: 'CREDDA-ULPGL <onboarding@resend.dev>', // ✅ Utiliser onboarding pour les tests
      to: [email],
      subject: "Nous avons bien reçu votre message",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a;">Merci de nous avoir contactés</h2>
          <p>Bonjour ${name},</p>
          <p>Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.</p>
          <div style="background-color: #f3f4f6; padding: 15px; margin: 20px 0;">
            <p><strong>Votre message :</strong></p>
            <p>${message}</p>
          </div>
          <p>L'équipe CREDDA-ULPGL</p>
        </div>
      `
    });

    // 3. Envoyer une notification à l'admin
    await resend.emails.send({
      from: 'CREDDA-ULPGL <onboarding@resend.dev>', // ✅ Utiliser onboarding pour les tests
      to: ['admin@credda-ulpgl.org'],
      subject: `Nouveau message de contact: ${subject}`,
      html: `
        <div style="font-family: sans-serif;">
          <h2>Nouveau message de contact</h2>
          <p><strong>De:</strong> ${name} (${email})</p>
          <p><strong>Sujet:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f3f4f6; padding: 15px;">
            ${message}
          </div>
          <p><a href="${process.env.NEXTAUTH_URL}/admin/messages/${contactMessage.id}">Voir dans l'admin</a></p>
        </div>
      `
    });

    return NextResponse.json(
      { success: true, message: "Message envoyé avec succès" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erreur contact:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}