// services/mail-service.ts
import { resend } from "@/lib/resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "contact@credda-ulpgl.org";

/**
 * Send an email to admin when a new registration request is submitted
 */
export async function sendNewRequestAlert(userName: string, userEmail: string) {
  try {
    await resend.emails.send({
      from: `CREDDA-ULPGL <${FROM_EMAIL}>`,
      to: [FROM_EMAIL],
      subject: "🔔 Nouvelle demande d'inscription - CREDDA",
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
          <h1 style="border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; color: #1e3a8a;">CREDDA-ULPGL</h1>
          <p style="font-size: 16px; line-height: 1.6;">Une nouvelle demande d'inscription a été soumise sur la plateforme.</p>
          <div style="background-color: #f8fafc; padding: 20px; border-left: 4px solid #1e3a8a;">
            <p><strong>Utilisateur :</strong> ${userName}</p>
            <p><strong>Email :</strong> ${userEmail}</p>
            <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
          </div>
          <p style="margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL}/fr/admin/users" style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
              Gérer les demandes sur l'Admin
            </a>
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending registration alert:", error);
    return { success: false, error };
  }
}

/**
 * Send notification to user when their account is approved
 */
export async function sendApprovalNotification(userEmail: string, userName: string) {
  try {
    await resend.emails.send({
      from: `CREDDA-ULPGL <${FROM_EMAIL}>`,
      to: [userEmail],
      subject: "✅ Votre compte CREDDA-ULPGL a été approuvé",
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
          <h1 style="border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; color: #1e3a8a;">Félicitations, ${userName} !</h1>
          <p style="font-size: 16px; line-height: 1.6;">Nous avons le plaisir de vous informer que votre accès à la plateforme CREDDA-ULPGL a été approuvé.</p>
          <p style="font-size: 16px; line-height: 1.6;">Vous pouvez désormais vous connecter pour accéder aux ressources de recherche et gérer votre profil.</p>
          <p style="margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL}/fr/login" style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
              Se connecter au portail
            </a>
          </p>
          <p style="font-size: 12px; color: #64748b; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            Cordialement,<br>L'équipe technique CREDDA-ULPGL
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending approval notification:", error);
    return { success: false, error };
  }
}

/**
 * Send notification to user when their account is rejected
 */
export async function sendRejectionNotification(userEmail: string, userName: string) {
  try {
    await resend.emails.send({
      from: `CREDDA-ULPGL <${FROM_EMAIL}>`,
      to: [userEmail],
      subject: "ℹ️ Concernant votre demande d'inscription - CREDDA",
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
          <h1 style="border-bottom: 2px solid #ef4444; padding-bottom: 10px; color: #ef4444;">CREDDA-ULPGL</h1>
          <p style="font-size: 16px; line-height: 1.6;">Bonjour ${userName},</p>
          <p style="font-size: 16px; line-height: 1.6;">Après examen de votre demande d'inscription, nous avons le regret de vous informer que nous ne pouvons y donner suite pour le moment.</p>
          <p style="font-size: 16px; line-height: 1.6;">Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez soumettre de nouvelles informations, n'hésitez pas à nous contacter.</p>
          <p style="font-size: 12px; color: #64748b; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            L'équipe CREDDA-ULPGL
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending rejection notification:", error);
    return { success: false, error };
  }
}

/**
 * Notification for contact message
 */
export async function sendContactNotification(senderName: string, senderEmail: string, message: string) {
  try {
     // Notify Admin
     await resend.emails.send({
        from: `Nouveau Message <${FROM_EMAIL}>`,
        to: [FROM_EMAIL],
        subject: `📬 Nouveau message de ${senderName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; color: #334155;">
            <p>Vous avez reçu un nouveau message via le formulaire de contact.</p>
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px;">
               <p><strong>Nom:</strong> ${senderName}</p>
               <p><strong>Email:</strong> ${senderEmail}</p>
               <p><strong>Message:</strong></p>
               <p style="white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        `
     });
     return { success: true };
  } catch (error) {
    console.error("Error sending contact notification:", error);
    return { success: false, error };
  }
}

/**
 * Send notification for a reply to a contact message
 */
export async function sendReplyNotification(
  userEmail: string, 
  userName: string, 
  originalSubject: string, 
  replyText: string,
  originalMessage: string
) {
  try {
    await resend.emails.send({
      from: `CREDDA-ULPGL <${FROM_EMAIL}>`,
      to: [userEmail],
      subject: `RE: ${originalSubject}`,
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
          <h1 style="border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; color: #1e3a8a;">CREDDA-ULPGL</h1>
          <p style="font-size: 16px; line-height: 1.6;">Bonjour ${userName},</p>
          <p style="font-size: 16px; line-height: 1.6;">Nous avons bien reçu votre message et voici notre réponse :</p>
          
          <div style="background-color: #f8fafc; padding: 25px; border-left: 4px solid #1e3a8a; margin: 20px 0; font-style: italic;">
            ${replyText.replace(/\n/g, '<br/>')}
          </div>
          
          <p style="font-size: 14px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
            <strong>Rappel de votre message :</strong><br/>
            "${originalMessage.substring(0, 150)}${originalMessage.length > 150 ? '...' : ''}"
          </p>
          
          <p style="font-size: 12px; color: #94a3b8; margin-top: 40px;">
            Cordialement,<br/>L'équipe du CREDDA-ULPGL
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending reply notification:", error);
    return { success: false, error };
  }
}
