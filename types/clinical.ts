// types/clinical.ts
import { ClinicalCase, Beneficiary, CaseNote, CaseStatus, UrgencyLevel, BeneficiaryType } from "@prisma/client";

export type ClinicalCaseWithBeneficiary = ClinicalCase & {
  beneficiary: Beneficiary;
};

export type FullClinicalCase = ClinicalCase & {
  beneficiary: Beneficiary;
  notes: CaseNote[];
};

export { CaseStatus, UrgencyLevel, BeneficiaryType };
