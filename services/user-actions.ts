"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendApprovalNotification, sendRejectionNotification } from "./mail-service";
import { ApiResponse } from "@/types/api";
import { withSafeAction } from "@/lib/safe-action";
import { createUserSchema, updateUserProfileSchema, updateUserPasswordSchema, userRoleSchema, accountStatusSchema } from "@/schemas/user";
import { SafeUser, Role, AccountStatus } from "@/types/user";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { uploadFile } from "@/lib/storage";

export async function createUser(rawData: unknown): Promise<ApiResponse<SafeUser>> {
  const session = await auth();
  if (!session || (session.user.role !== Role.ADMIN && session.user.role !== Role.SUPERADMIN)) {
    return { success: false, error: "Non autorisé" };
  }

  return withSafeAction("createUser", async () => {
    const data = createUserSchema.parse(rawData);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        status: AccountStatus.APPROVED // Admin created users are approved by default
      }
    });

    revalidatePath("/admin/users", "layout");
    
    const { password: _, ...safeUser } = user;
    return safeUser;
  }, "Cet email est déjà utilisé");
}

export async function deleteUser(id: string): Promise<ApiResponse<{ id: string }>> {
  const session = await auth();
  if (!session || (session.user.role !== Role.ADMIN && session.user.role !== Role.SUPERADMIN)) {
    return { success: false, error: "Non autorisé" };
  }

  return withSafeAction("deleteUser", async () => {
    await db.user.delete({ where: { id } });
    revalidatePath("/admin/users", "layout");
    return { id };
  }, "Impossible de supprimer l'utilisateur");
}

export async function bulkDeleteUsers(ids: string[]): Promise<ApiResponse<{ count: number }>> {
  const session = await auth();
  if (!session || (session.user.role !== Role.ADMIN && session.user.role !== Role.SUPERADMIN)) {
    return { success: false, error: "Non autorisé" };
  }

  return withSafeAction("bulkDeleteUsers", async () => {
    const result = await db.user.deleteMany({
      where: { id: { in: ids } }
    });
    revalidatePath("/admin/users", "layout");
    return { count: result.count };
  }, "Erreur lors de la suppression groupée");
}

export async function updateUserStatus(id: string, rawStatus: unknown): Promise<ApiResponse<SafeUser>> {
  const session = await auth();
  if (!session || (session.user.role !== Role.ADMIN && session.user.role !== Role.SUPERADMIN)) {
    return { success: false, error: "Non autorisé" };
  }

  return withSafeAction("updateUserStatus", async () => {
    const status = accountStatusSchema.parse(rawStatus);
    const user = await db.user.update({
      where: { id },
      data: { status }
    });

    // Send notification
    if (status === AccountStatus.APPROVED) {
      await sendApprovalNotification(user.email, user.name || "Utilisateur");
    } else if (status === AccountStatus.REJECTED) {
      await sendRejectionNotification(user.email, user.name || "Utilisateur");
    }

    revalidatePath("/admin/users", "layout");
    const { password: _, ...safeUser } = user;
    return safeUser;
  }, "Erreur lors de la mise à jour du statut");
}

export async function updateUserRole(id: string, rawRole: unknown): Promise<ApiResponse<SafeUser>> {
  const session = await auth();
  if (!session || (session.user.role !== Role.ADMIN && session.user.role !== Role.SUPERADMIN)) {
    return { success: false, error: "Non autorisé" };
  }

  return withSafeAction("updateUserRole", async () => {
    const role = userRoleSchema.parse(rawRole);
    const user = await db.user.update({
      where: { id },
      data: { role }
    });
    revalidatePath("/admin/users", "layout");
    const { password: _, ...safeUser } = user;
    return safeUser;
  }, "Erreur lors de la mise à jour du rôle");
}

export async function updateUserProfile(id: string, rawData: unknown): Promise<ApiResponse<SafeUser>> {
  return withSafeAction("updateUserProfile", async () => {
    const data = updateUserProfileSchema.parse(rawData);
    const updatedUser = await db.user.update({
      where: { id },
      data
    });
    revalidatePath("/admin/profile");
    const { password: _, ...safeUser } = updatedUser;
    return safeUser;
  }, "Erreur lors de la mise à jour du profil");
}

export async function updateUserPassword(id: string, rawData: unknown): Promise<ApiResponse<void>> {
  return withSafeAction("updateUserPassword", async () => {
    const { currentPassword, newPassword } = updateUserPasswordSchema.parse(rawData);
    const user = await db.user.findUnique({ where: { id } });
    if (!user) throw new Error("Utilisateur non trouvé");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("Mot de passe actuel incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id },
      data: { password: hashedPassword }
    });
  }, "Erreur lors de la mise à jour du mot de passe");
}

export async function uploadUserProfileImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) return { error: "Aucun fichier sélectionné" };

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadFile(buffer, file.name, file.type, "team");
    return { url };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Erreur inconnue" };
  }
}