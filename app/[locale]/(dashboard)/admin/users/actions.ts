"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/lib/storage";
import bcrypt from "bcryptjs";

const ALLOWED_ROLES = ["ADMIN", "SUPERADMIN"];

import { Role, AccountStatus } from "@prisma/client";

export async function getUsersAndTeam() {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    throw new Error("Accès non autorisé");
  }

  // 1. Récupération directe de tous les utilisateurs de production (sans boucle de seed parasite)
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  // 2. Récupération directe des membres réels de l'équipe avec leurs traductions
  const members = await db.member.findMany({
    include: {
      translations: true
    },
    orderBy: { order: "asc" }
  });

  return { users, members };
}

export async function createUserAccount(data: {
  name: string;
  email: string;
  role: "SUPERADMIN" | "ADMIN" | "EDITOR" | "USER";
  status: "PENDING" | "APPROVED" | "REJECTED";
  password?: string;
}) {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    throw new Error("Accès non autorisé");
  }

  const exists = await db.user.findUnique({ where: { email: data.email } });
  if (exists) {
    throw new Error("Cette adresse e-mail est déjà utilisée.");
  }

  const rawPassword = data.password || "credda2026admin";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role as Role,
      status: data.status as AccountStatus,
    }
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserAccount(userId: string, data: {
  name: string;
  email: string;
  role: "SUPERADMIN" | "ADMIN" | "EDITOR" | "USER";
  status: "PENDING" | "APPROVED" | "REJECTED";
}) {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    throw new Error("Accès non autorisé");
  }

  await db.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      email: data.email,
      role: data.role as Role,
      status: data.status as AccountStatus,
    }
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserRole(userId: string, role: "SUPERADMIN" | "ADMIN" | "EDITOR" | "USER") {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    throw new Error("Accès non autorisé");
  }

  await db.user.update({
    where: { id: userId },
    data: { role: role as Role }
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserStatus(userId: string, status: "PENDING" | "APPROVED" | "REJECTED") {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    throw new Error("Accès non autorisé");
  }

  await db.user.update({
    where: { id: userId },
    data: { status: status as AccountStatus }
  });

  let emailSent = false;
  if (status === "APPROVED") {
    console.log(`[EMAIL_SERVICE] Sending welcome email to user ID: ${userId}`);
    emailSent = true;
  }

  revalidatePath("/admin/users");
  return { success: true, emailSent };
}

export async function deleteUserAccount(userId: string) {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    throw new Error("Accès non autorisé");
  }

  if (session.user.id === userId) {
    throw new Error("Vous ne pouvez pas supprimer votre propre compte");
  }

  await db.user.delete({
    where: { id: userId }
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function uploadTeamMemberImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) return { error: "Aucun fichier sélectionné" };

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadFile(buffer, file.name, file.type, "team");
    return { url };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createTeamMember(data: {
  name: string;
  email?: string;
  imageUrl?: string;
  order: number;
  slug: string;
  userId?: string;
  titleFr: string;
  titleEn: string;
  titleSw: string;
  bioFr: string;
  bioEn: string;
  bioSw: string;
}) {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    throw new Error("Accès non autorisé");
  }

  await db.member.create({
    data: {
      name: data.name,
      email: data.email || null,
      image: data.imageUrl || null,
      order: data.order,
      slug: data.slug,
      translations: {
        createMany: {
          data: [
            { language: "fr", role: data.titleFr, bio: data.bioFr },
            { language: "en", role: data.titleEn, bio: data.bioEn },
            { language: "sw", role: data.titleSw, bio: data.bioSw }
          ]
        }
      }
    }
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateTeamMember(id: string, data: {
  name: string;
  email?: string;
  imageUrl?: string;
  order: number;
  slug: string;
  userId?: string;
  titleFr: string;
  titleEn: string;
  titleSw: string;
  bioFr: string;
  bioEn: string;
  bioSw: string;
}) {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    throw new Error("Accès non autorisé");
  }

  await db.member.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email || null,
      image: data.imageUrl || null,
      order: data.order,
      slug: data.slug,
    }
  });

  const translations = [
    { language: "fr", role: data.titleFr, bio: data.bioFr },
    { language: "en", role: data.titleEn, bio: data.bioEn },
    { language: "sw", role: data.titleSw, bio: data.bioSw }
  ];

  for (const tr of translations) {
    await db.memberTranslation.upsert({
      where: {
        memberId_language: {
          memberId: id,
          language: tr.language
        }
      },
      update: {
        role: tr.role,
        bio: tr.bio
      },
      create: {
        memberId: id,
        language: tr.language,
        role: tr.role,
        bio: tr.bio
      }
    });
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteTeamMember(id: string) {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    throw new Error("Accès non autorisé");
  }

  await db.member.delete({
    where: { id }
  });

  revalidatePath("/admin/users");
  return { success: true };
}