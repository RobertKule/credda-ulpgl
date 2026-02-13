"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
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
      }
    });
    revalidatePath("/[locale]/admin/users", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Cet email est déjà utilisé" };
  }
}

export async function deleteUser(id: string) {
  try {
    await db.user.delete({ where: { id } });
    revalidatePath("/[locale]/admin/users", "layout");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}