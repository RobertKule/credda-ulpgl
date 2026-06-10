"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

const ALLOWED_CLINIQUE_ROLES = ["ADMIN", "EDITOR", "SUPERADMIN"];

/**
 * Récupère la liste des cas cliniques avec traçabilité.
 */
export async function getClinicalCases() {
  const session = await auth();
  if (!session || !session.user || !ALLOWED_CLINIQUE_ROLES.includes(session.user.role)) {
    throw new Error("Acces non autorisé");
  }

  try {
    const cases = await db.clinicalCase.findMany({
      include: {
        beneficiary: true,
        documents: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Logging de l'accès global à la liste
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "READ_ALL_CASES",
        entity: "ClinicalCase",
        details: `Consultation de la liste des ${cases.length} cas cliniques.`,
      },
    });

    return cases;
  } catch (error) {
    console.error("[GET_CLINICAL_CASES_ERROR]", error);
    throw new Error("Erreur lors de la récupération des dossiers.");
  }
}

/**
 * Génère une URL signée temporaire pour un document privé.
 */
export async function generateSecureDocumentUrl(caseId: string, fileKey: string) {
  const session = await auth();
  if (!session || !session.user || !ALLOWED_CLINIQUE_ROLES.includes(session.user.role)) {
    throw new Error("Acces non autorisé");
  }

  try {
    // 1. Vérifier que le dossier existe
    const clinicalCase = await db.clinicalCase.findUnique({
      where: { id: caseId },
      select: { title: true }
    });

    if (!clinicalCase) throw new Error("Dossier introuvable");

    // 2. Générer l'URL signée via Supabase (900s = 15min)
    const { data, error } = await supabaseAdmin.storage
      .from('clinique-prive')
      .createSignedUrl(fileKey, 900);

    if (error) throw error;

    // 3. Log d'Audit de consultation de document
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "GENERATE_SIGNED_URL",
        entity: "Media",
        entityId: fileKey,
        details: `Accès au document ${fileKey} pour le cas: ${clinicalCase.title}`,
        metadata: { caseId, expires: "900s" }
      }
    });

    // Revalider pour rafraîchir le flux d'audit logs dans l'UI
    revalidatePath("/admin/clinique");

    return { url: data.signedUrl };
  } catch (error: any) {
    console.error("[SIGNED_URL_ERROR]", error);
    throw new Error(`Échec de la génération du lien sécurisé: ${error.message}`);
  }
}

/**
 * Récupère les derniers logs d'audit pour le module clinique.
 */
export async function getClinicalAuditLogs() {
  const session = await auth();
  if (!session || !session.user || !ALLOWED_CLINIQUE_ROLES.includes(session.user.role)) {
    throw new Error("Acces non autorisé");
  }

  return await db.auditLog.findMany({
    where: {
      OR: [
        { action: { contains: "CASE" } },
        { action: { contains: "CLINICAL" } },
        { action: "GENERATE_SIGNED_URL" }
      ]
    },
    include: { user: { select: { name: true } } },
    orderBy: { timestamp: "desc" },
    take: 10
  });
}
