// schemas/clinical.ts
import { z } from "zod";

export const beneficiaryTypeSchema = z.enum([
  "INDIGENOUS_PEOPLE",
  "LOCAL_COMMUNITY",
  "OTHER"
]);

export const caseStatusSchema = z.enum([
  "NEW",
  "IN_ANALYSIS",
  "MEETING_SCHEDULED",
  "ACTION_ENGAGED",
  "RESOLVED",
  "CLOSED"
]);

export const urgencyLevelSchema = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL"
]);

export const clinicalCaseSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().min(5, "Téléphone requis"),
  location: z.string().min(2, "Localisation requise"),
  beneficiaryType: beneficiaryTypeSchema,
  problemType: z.string().min(2, "Type de problème requis"),
  description: z.string().min(10, "Description trop courte"),
  incidentDate: z.string().optional().or(z.literal("")),
  urgency: urgencyLevelSchema.default("MEDIUM"),
  expectations: z.string().optional(),
});

export const updateClinicalCaseSchema = clinicalCaseSchema.extend({
  id: z.string(),
  beneficiaryId: z.string().optional(),
  status: caseStatusSchema,
});
