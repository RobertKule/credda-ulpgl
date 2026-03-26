import { db } from "@/lib/db";
import { withSafeAction, ActionResponse } from "@/lib/safe-action";

/** Pas de revalidatePath ici : ce module est importé par des Client Components.
 *  Utiliser router.refresh() côté client après mutation (voir ClinicalCaseForm). */

export async function submitClinicalCase(formData: any): Promise<ActionResponse<any>> {
  return withSafeAction("submitClinicalCase", async () => {
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

    return newCase;
  }, "Erreur lors de la soumission du cas clinique");
}

export async function getAllClinicalCases(): Promise<ActionResponse<any>> {
  return withSafeAction("getAllClinicalCases", async () => {
    return await db.clinicalCase.findMany({
      include: { beneficiary: true },
      orderBy: { createdAt: 'desc' }
    });
  }, "Erreur de récupération des cas cliniques");
}

export async function getClinicalCaseById(id: string): Promise<ActionResponse<any>> {
  return withSafeAction("getClinicalCaseById", async () => {
    return await db.clinicalCase.findUnique({
      where: { id },
      include: { 
        beneficiary: true,
        notes: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }, "Cas clinique non trouvé");
}

export async function updateClinicalCaseStatus(id: string, status: string): Promise<ActionResponse<any>> {
  return withSafeAction("updateClinicalCaseStatus", async () => {
    return await db.clinicalCase.update({
      where: { id },
      data: { status: status as any }
    });
  }, "Erreur de mise à jour du statut");
}

export async function deleteClinicalCase(id: string): Promise<ActionResponse<any>> {
  return withSafeAction("deleteClinicalCase", async () => {
    await db.clinicalCase.delete({ where: { id } });
    return { id };
  }, "Erreur lors de la suppression du cas clinique");
}

export async function updateClinicalCase(id: string, formData: any): Promise<ActionResponse<any>> {
  return withSafeAction("updateClinicalCase", async () => {
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

    if (formData.beneficiaryId) {
      await db.beneficiary.update({
        where: { id: formData.beneficiaryId },
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          type: formData.beneficiaryType
        }
      });
    }

    return updated;
  }, "Erreur lors de la mise à jour du cas clinique");
}

export async function addCaseNote(id: string, content: string, clinicianId: string): Promise<ActionResponse<any>> {
  return withSafeAction("addCaseNote", async () => {
    return await db.caseNote.create({
      data: {
        content,
        caseId: id,
        authorId: clinicianId
      }
    });
  }, "Erreur lors de l'ajout de la note");
}

export async function getCasesByPhone(phone: string): Promise<ActionResponse<any>> {
  return withSafeAction("getCasesByPhone", async () => {
    return await db.clinicalCase.findMany({
      where: {
        beneficiary: {
          phone: phone
        }
      },
      include: {
        beneficiary: true,
        notes: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }, "Erreur lors de la récupération de vos dossiers");
}
