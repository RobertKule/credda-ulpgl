// app/api/admin/messages/[id]/reply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ CHANGER ICI: Promise
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params; // ✅ AJOUTER await ICI
    const { replyMessage } = await req.json();

    if (!replyMessage?.trim()) {
      return NextResponse.json(
        { error: "Message de réponse requis" },
        { status: 400 }
      );
    }

    // Récupérer le message original
    const originalMessage = await db.contactMessage.findUnique({
      where: { id }
    });

    if (!originalMessage) {
      return NextResponse.json(
        { error: "Message non trouvé" },
        { status: 404 }
      );
    }

    // 1. Mettre à jour le message dans la DB
    await db.contactMessage.update({
      where: { id },
      data: {
        replyContent: replyMessage,
        repliedAt: new Date(),
        status: "READ"
      }
    });

    // 2. Envoyer l'email via Resend
    try {
      const { data, error } = await resend.emails.send({
        from: 'CREDDA-ULPGL <onboarding@resend.dev>',
        to: [originalMessage.email],
        subject: `Re: ${originalMessage.subject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1e293b; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1e3a8a; color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; background: #f8fafc; }
                .message-box { background: white; padding: 20px; border-left: 4px solid #1e3a8a; margin: 20px 0; }
                .original { background: #f1f5f9; padding: 15px; font-size: 14px; color: #475569; }
                .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin:0;">CREDDA-ULPGL</h1>
                  <p style="margin:5px 0 0; opacity:0.9;">Centre de Recherche</p>
                </div>
                
                <div class="content">
                  <p>Bonjour <strong>${originalMessage.name}</strong>,</p>
                  
                  <div class="message-box">
                    <p style="margin:0;">${replyMessage.replace(/\n/g, '<br>')}</p>
                  </div>
                  
                  <div class="original">
                    <p style="margin:0 0 10px;"><strong>Votre message original :</strong></p>
                    <p style="margin:0;">${originalMessage.message.replace(/\n/g, '<br>')}</p>
                  </div>
                  
                  <hr style="border:none; border-top:1px solid #e2e8f0; margin:30px 0;" />
                  
                  <p style="color:#64748b;">
                    Cordialement,<br>
                    L'équipe CREDDA-ULPGL
                  </p>
                </div>
                
                <div class="footer">
                  <p>© ${new Date().getFullYear()} CREDDA-ULPGL. Tous droits réservés.</p>
                  <p style="margin:5px 0 0;">
                    Université Libre des Pays des Grands Lacs (ULPGL)<br>
                    Goma, République Démocratique du Congo
                  </p>
                </div>
              </div>
            </body>
          </html>
        `
      });

      if (error) {
        console.error("Erreur Resend:", error);
        return NextResponse.json(
          { error: "Erreur lors de l'envoi de l'email" },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: "Réponse envoyée avec succès" 
      });

    } catch (emailError) {
      console.error("Erreur envoi email:", emailError);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Erreur reply:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi" },
      { status: 500 }
    );
  }
}