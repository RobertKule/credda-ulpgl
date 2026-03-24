import { sql, db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { safeQuery } from "@/lib/db-safe";

export interface ClinicalCaseResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function submitClinicalCase(formData: any): Promise<ClinicalCaseResult> {
  // ... (keeping Prisma for writes for now)
  try {
    // 1. Gérer le bénéficiaire (recherche par téléphone pour éviter les doublons simples)
    let beneficiary = await db.beneficiary.findFirst({
      where: { phone: formData.phone }
    });

    if (!beneficiary) {
      beneficiary = await db.beneficiary.create({
        data: {
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          location: formData.location,
          type: formData.beneficiaryType || "LOCAL_COMMUNITY",
        }
      });
    }

    // 2. Créer le cas clinique
    const newCase = await db.clinicalCase.create({
      data: {
        title: `Cas: ${formData.problemType} - ${formData.location}`,
        description: formData.description,
        problemType: formData.problemType,
        location: formData.location,
        incidentDate: formData.incidentDate ? new Date(formData.incidentDate) : null,
        urgency: formData.urgency || "MEDIUM",
        expectations: formData.expectations,
        beneficiaryId: beneficiary.id,
        status: "NEW",
      }
    });

    // Optionnel : Notification (pourrait être ajouté ici via Resend)

    revalidatePath("/admin/clinical");
    return { success: true, data: newCase };
  } catch (error) {
    console.error("❌ Erreur soumission cas clinique:", error);
    return { success: false, error: "Erreur lors de la soumission du cas" };
  }
}

export async function getCasesByPhone(phone: string): Promise<ClinicalCaseResult> {
  try {
    const cases = await sql`
      SELECT cc.* 
      FROM "ClinicalCase" cc
      JOIN "Beneficiary" b ON cc."beneficiaryId" = b.id
      WHERE b.phone = ${phone}
      ORDER BY cc."createdAt" DESC
    `;
    return { success: true, data: cases };
  } catch (error) {
    console.error("❌ Error fetching cases by phone:", error);
    return { success: false, error: "Erreur lors de la récupération des cas" };
  }
}

export async function getAllClinicalCases(): Promise<ClinicalCaseResult> {
  return safeQuery<ClinicalCaseResult>(
    async () => {
      const cases = await db.clinicalCase.findMany({
        include: { beneficiary: true },
        orderBy: { createdAt: 'desc' }
      });
      return { success: true, data: cases };
    },
    { success: false, error: "Erreur de récupération globale" },
    "services/clinical:getAll"
  );
}

export async function getClinicalCaseById(id: string): Promise<ClinicalCaseResult> {
  return safeQuery<ClinicalCaseResult>(
    async () => {
      const caseItem = await db.clinicalCase.findUnique({
        where: { id },
        include: { 
          beneficiary: true,
          notes: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      return { success: true, data: caseItem };
    },
    { success: false, error: "Cas non trouvé" },
    "services/clinical:getCaseById"
  );
}

export async function updateClinicalCaseStatus(id: string, status: string): Promise<ClinicalCaseResult> {
  try {
    const updated = await db.clinicalCase.update({
      where: { id },
      data: { status: status as any }
    });
    revalidatePath("/admin/clinical");
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: "Erreur de mise à jour" };
  }
}

export async function deleteClinicalCase(id: string): Promise<ClinicalCaseResult> {
  try {
    await db.clinicalCase.delete({ where: { id } });
    revalidatePath("/admin/clinical");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur de suppression" };
  }
}

export async function updateClinicalCase(id: string, formData: any): Promise<ClinicalCaseResult> {
  try {
    const updated = await db.clinicalCase.update({
      where: { id },
      data: {
        description: formData.description,
        problemType: formData.problemType,
        location: formData.location,
        incidentDate: formData.incidentDate ? new Date(formData.incidentDate) : null,
        urgency: formData.urgency || "MEDIUM",
        expectations: formData.expectations,
        status: formData.status
      }
    });

    // Optionnel: Mettre à jour les infos du bénéficiaire si nécessaire
    if (formData.beneficiaryId) {
      await db.beneficiary.update({
        where: { id: formData.beneficiaryId },
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location, // On synchronise souvent la localisation
          type: formData.beneficiaryType
        }
      });
    }

    revalidatePath("/admin/clinical");
    revalidatePath(`/admin/clinical/${id}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error("❌ Erreur mise à jour cas clinique:", error);
    return { success: false, error: "Erreur de mise à jour" };
  }
}

export async function addCaseNote(id: string, content: string, clinicianId: string): Promise<ClinicalCaseResult> {
  try {
    const note = await db.caseNote.create({
      data: {
        content,
        caseId: id,
        authorId: clinicianId
      }
    });
    revalidatePath(`/admin/clinical/${id}`);
    return { success: true, data: note };
  } catch (error) {
    return { success: false, error: "Erreur d'ajout de note" };
  }
}
