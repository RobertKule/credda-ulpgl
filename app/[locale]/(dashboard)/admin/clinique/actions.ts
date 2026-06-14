"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const ALLOWED_ROLES = ["ADMIN", "EDITOR", "SUPERADMIN"];

type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type CaseStatus = "NEW" | "IN_PROGRESS" | "IN_ANALYSIS" | "MEETING_SCHEDULED" | "ACTION_ENGAGED" | "RESOLVED" | "CLOSED";

export async function getClinicalCases() {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) throw new Error("Accès non autorisé");

  return db.clinicalCase.findMany({
    include: {
      beneficiary: true,
      documents: { select: { id: true, url: true, type: true, title: true } },
      notes: { orderBy: { createdAt: "desc" }, take: 5 },
      assignedTo: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createClinicalCase(data: {
  title: string; problemType: string; location: string; description: string;
  actionsTaken?: string; expectations?: string; urgency: UrgencyLevel; status: CaseStatus;
  beneficiaryName: string; beneficiaryPhone: string;
}) {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) throw new Error("Accès non autorisé");

  let beneficiary = await db.beneficiary.findFirst({ where: { name: data.beneficiaryName.trim() } });
  if (!beneficiary) {
    beneficiary = await db.beneficiary.create({
      data: {
        name: data.beneficiaryName.trim(),
        phone: data.beneficiaryPhone.trim() || "N/A",
        location: data.location,
        type: "LOCAL_COMMUNITY",
      },
    });
  }

  const caseCode = `CR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

  const newCase = await db.clinicalCase.create({
    data: {
      title: data.title,
      description: data.description,
      problemType: data.problemType,
      location: data.location,
      actionsTaken: data.actionsTaken || null,
      expectations: data.expectations || null,
      urgency: data.urgency,
      status: data.status,
      trackingCode: caseCode,
      beneficiaryId: beneficiary.id,
    },
  });

  revalidatePath("/admin/clinique");
  return { success: true, id: newCase.id, trackingCode: caseCode };
}

export async function updateCaseStatus(id: string, status: CaseStatus) {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) throw new Error("Accès non autorisé");
  await db.clinicalCase.update({ where: { id }, data: { status } });
  revalidatePath("/admin/clinique");
  return { success: true };
}

export async function updateClinicalCase(id: string, data: {
  title: string; problemType: string; location: string; description: string;
  actionsTaken?: string; expectations?: string; urgency: UrgencyLevel; status: CaseStatus;
  beneficiaryName: string; beneficiaryPhone: string;
}) {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) throw new Error("Accès non autorisé");

  const existingCase = await db.clinicalCase.findUnique({
    where: { id },
    select: { beneficiaryId: true }
  });

  if (!existingCase) throw new Error("Dossier non trouvé");

  await db.beneficiary.update({
    where: { id: existingCase.beneficiaryId },
    data: {
      name: data.beneficiaryName.trim(),
      phone: data.beneficiaryPhone.trim() || "N/A",
      location: data.location,
    }
  });

  await db.clinicalCase.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      problemType: data.problemType,
      location: data.location,
      actionsTaken: data.actionsTaken || null,
      expectations: data.expectations || null,
      urgency: data.urgency,
      status: data.status,
    },
  });

  revalidatePath("/admin/clinique");
  return { success: true };
}

export async function deleteClinicalCase(id: string) {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) throw new Error("Accès non autorisé");
  await db.clinicalCase.delete({ where: { id } });
  revalidatePath("/admin/clinique");
  return { success: true };
}

export async function addCaseNote(caseId: string, content: string) {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) throw new Error("Accès non autorisé");
  await db.caseNote.create({ data: { caseId, content, authorId: session.user.id } });
  revalidatePath("/admin/clinique");
  return { success: true };
}
