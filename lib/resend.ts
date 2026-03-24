// Client Resend : initialisation paresseuse pour éviter l’échec du build sans RESEND_API_KEY
import { Resend } from "resend";

let instance: Resend | null = null;

export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  if (!instance) {
    instance = new Resend(key);
  }
  return instance;
}

/** Compat : n’instancie Resend qu’à l’appel de `send`, pas au chargement du module. */
export const resend = {
  emails: {
    send: (body: Parameters<Resend["emails"]["send"]>[0]) =>
      getResend().emails.send(body),
  },
};

export async function testResendConnection() {
  try {
    const { data, error } = await getResend().emails.send({
      from: "CREDDA-ULPGL <test@credda-ulpgl.org>",
      to: ["admin@credda-ulpgl.org"],
      subject: "Test de configuration",
      html: "<p>Si vous recevez ceci, Resend est bien configuré !</p>",
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
