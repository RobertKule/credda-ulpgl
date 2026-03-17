// services/clinic-session-actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface ClinicSessionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function getAllClinicSessions(): Promise<ClinicSessionResult> {
  try {
    const sessions = await db.clinicSession.findMany({
      orderBy: { date: 'desc' }
    });
    return { success: true, data: sessions };
  } catch (error) {
    console.error("❌ Erreur récupération sessions:", error);
    return { success: false, error: "Erreur lors de la récupération des sessions" };
  }
}

export async function getUpcomingMobileClinics(): Promise<ClinicSessionResult> {
  try {
    const sessions = await db.clinicSession.findMany({
      where: {
        isMobile: true,
        date: { gte: new Date() }
      },
      orderBy: { date: 'asc' }
    });
    return { success: true, data: sessions };
  } catch (error) {
    return { success: false, error: "Erreur lors de la récupération des cliniques mobiles" };
  }
}

export async function createClinicSession(data: any): Promise<ClinicSessionResult> {
  try {
    const session = await db.clinicSession.create({
      data: {
        title: data.title,
        location: data.location,
        date: new Date(data.date),
        description: data.description,
        isMobile: data.isMobile ?? true
      }
    });
    revalidatePath("/admin/sessions");
    revalidatePath("/clinical/environmental/sessions");
    return { success: true, data: session };
  } catch (error) {
    return { success: false, error: "Erreur de création de session" };
  }
}

export async function updateClinicSession(id: string, data: any): Promise<ClinicSessionResult> {
  try {
    const session = await db.clinicSession.update({
      where: { id },
      data: {
        title: data.title,
        location: data.location,
        date: new Date(data.date),
        description: data.description,
        isMobile: data.isMobile
      }
    });
    revalidatePath("/admin/sessions");
    return { success: true, data: session };
  } catch (error) {
    return { success: false, error: "Erreur de mise à jour de session" };
  }
}

export async function deleteClinicSession(id: string): Promise<ClinicSessionResult> {
  try {
    await db.clinicSession.delete({ where: { id } });
    revalidatePath("/admin/sessions");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur de suppression" };
  }
}
