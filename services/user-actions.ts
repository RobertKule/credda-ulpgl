"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendApprovalNotification, sendRejectionNotification } from "./mail-service";
import { AccountStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function createUser(formData: any) {
  try {
    const hashedPassword = await bcrypt.hash(formData.password, 10);
    await db.user.create({
      data: {
        name: formData.name,
        email: formData.email,
        password: hashedPassword,
        role: formData.role || "ADMIN",
        status: "APPROVED" // Admin created users are approved by default
      }
    });
    revalidatePath("/admin/users", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Cet email est déjà utilisé" };
  }
}

export async function deleteUser(id: string) {
  try {
    await db.user.delete({ where: { id } });
    revalidatePath("/admin/users", "layout");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function bulkDeleteUsers(ids: string[]) {
  try {
    await db.user.deleteMany({
      where: { id: { in: ids } }
    });
    revalidatePath("/admin/users", "layout");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function updateUserStatus(id: string, status: AccountStatus) {
  try {
    const user = await db.user.update({
      where: { id },
      data: { status }
    });

    // Send notification
    if (status === "APPROVED") {
      await sendApprovalNotification(user.email, user.name || "Utilisateur");
    } else if (status === "REJECTED") {
      await sendRejectionNotification(user.email, user.name || "Utilisateur");
    }

    revalidatePath("/admin/users", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update status" };
  }
}

export async function updateUserRole(id: string, role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "USER") {
  try {
    await db.user.update({
      where: { id },
      data: { role }
    });
    revalidatePath("/admin/users", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update role" };
  }
}