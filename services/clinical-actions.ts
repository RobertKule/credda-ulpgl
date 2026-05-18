"use server";

import { db } from "@/lib/db";
import { ApiResponse } from "@/types/api";
import { withSafeAction } from "@/lib/safe-action";
import { clinicalCaseSchema, updateClinicalCaseSchema } from "@/schemas/clinical";
import { ClinicalCaseWithBeneficiary, FullClinicalCase, CaseStatus } from "@/types/clinical";
import { CaseNote, ClinicalCase } from "@prisma/client";
import { z } from "zod";

/** Pas de revalidatePath ici : ce module est importé par des Client Components.
 *  Utiliser router.refresh() côté client après mutation (voir ClinicalCaseForm). */

export async function submitClinicalCase(rawData: unknown): Promise<ApiResponse<ClinicalCase>> {
  return withSafeAction("submitClinicalCase", async () => {
    const parsed = clinicalCaseSchema.parse(rawData);
    const { name, email, phone, location, beneficiaryType, problemType, description, incidentDate, urgency, expectations } = parsed;

    // 1. Gérer le bénéficiaire (recherche par téléphone pour éviter les doublons simples)
    let beneficiary = await db.beneficiary.findFirst({
      where: { phone }
    });

    if (!beneficiary) {
      beneficiary = await db.beneficiary.create({
        data: {
          name,
          email: email || null,
          phone,
          location,
          type: beneficiaryType,
        }
      });
    }

    // 2. Créer le cas clinique
    const newCase = await db.clinicalCase.create({
      data: {
        title: `Cas: ${problemType} - ${location}`,
        description,
        problemType,
        location,
        incidentDate: incidentDate ? new Date(incidentDate) : null,
        urgency: urgency,
        expectations,
        beneficiaryId: beneficiary.id,
        status: "NEW",
      }
    });

    return newCase;
  }, "Erreur lors de la soumission du cas clinique");
}

export async function getAllClinicalCases(): Promise<ApiResponse<ClinicalCaseWithBeneficiary[]>> {
  return withSafeAction("getAllClinicalCases", async () => {
    return await db.clinicalCase.findMany({
      include: { beneficiary: true },
      orderBy: { createdAt: 'desc' }
    });
  }, "Erreur de récupération des cas cliniques");
}

export async function getClinicalCaseById(id: string): Promise<ApiResponse<FullClinicalCase | null>> {
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

export async function updateClinicalCaseStatus(id: string, status: CaseStatus): Promise<ApiResponse<ClinicalCase>> {
  return withSafeAction("updateClinicalCaseStatus", async () => {
    return await db.clinicalCase.update({
      where: { id },
      data: { status }
    });
  }, "Erreur de mise à jour du statut");
}

export async function deleteClinicalCase(id: string): Promise<ApiResponse<{ id: string }>> {
  return withSafeAction("deleteClinicalCase", async () => {
    await db.clinicalCase.delete({ where: { id } });
    return { id };
  }, "Erreur lors de la suppression du cas clinique");
}

export async function updateClinicalCase(id: string, rawData: unknown): Promise<ApiResponse<ClinicalCase>> {
  return withSafeAction("updateClinicalCase", async () => {
    const parsed = updateClinicalCaseSchema.parse({ ... (rawData as object), id });
    const { description, problemType, location, incidentDate, urgency, expectations, status, beneficiaryId, name, email, phone, beneficiaryType } = parsed;

    const updated = await db.clinicalCase.update({
      where: { id },
      data: {
        description,
        problemType,
        location,
        incidentDate: incidentDate ? new Date(incidentDate) : null,
        urgency,
        expectations,
        status
      }
    });

    if (beneficiaryId) {
      await db.beneficiary.update({
        where: { id: beneficiaryId },
        data: {
          name,
          email: email || null,
          phone,
          location,
          type: beneficiaryType
        }
      });
    }

    return updated;
  }, "Erreur lors de la mise à jour du cas clinique");
}

export async function addCaseNote(id: string, content: string, clinicianId: string): Promise<ApiResponse<CaseNote>> {
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

export async function getCasesByPhone(phone: string): Promise<ApiResponse<FullClinicalCase[]>> {
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
