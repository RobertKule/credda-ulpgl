// lib/resend.ts (optionnel - client Resend configuré)
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

// Tester la connexion
export async function testResendConnection() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'CREDDA-ULPGL <test@credda-ulpgl.org>',
      to: ['admin@credda-ulpgl.org'],
      subject: 'Test de configuration',
      html: '<p>Si vous recevez ceci, Resend est bien configuré !</p>'
    });
    
    if (error) {
      console.error("Erreur Resend:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Erreur:", error);
    return false;
  }
}