"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/lib/storage";
import bcrypt from "bcryptjs";

const ALLOWED_ROLES = ["ADMIN", "SUPERADMIN"];

// Real Users from CREDDA platform to seed
const SEED_USERS = [
  {
    name: "Prof. Jean-Baptiste Mukanire",
    email: "dir@credda-ulpgl.org",
    password: "hashedpassword123",
    role: "ADMIN",
    status: "APPROVED",
  },
  {
    name: "Dr. Marie-Claire Kahindo",
    email: "kahindo@credda-ulpgl.org",
    password: "hashedpassword123",
    role: "EDITOR",
    status: "APPROVED",
  },
  {
    name: "Me. Patrick Lwaboshi",
    email: "lwaboshi@credda-ulpgl.org",
    password: "hashedpassword123",
    role: "EDITOR",
    status: "APPROVED",
  },
  {
    name: "Mme. Esperance Zawadi",
    email: "zawadi@credda-ulpgl.org",
    password: "hashedpassword123",
    role: "USER",
    status: "PENDING",
  }
];

// Real Team Members from prisma/seed.ts to seed
const SEED_MEMBERS = [
  {
    name: "Prof. Jean-Baptiste Mukanire",
    email: "dir@credda-ulpgl.org",
    order: 1,
    slug: "jean-baptiste-mukanire",
    translations: [
      {
        language: "fr",
        role: "Directeur du CREDDA",
        bio: "Professeur de droit de l'environnement à l'ULPGL de Goma. Fondateur du CREDDA et pionnier de la justice environnementale en RDC.",
      },
      {
        language: "en",
        role: "Director of CREDDA",
        bio: "Professor of environmental law at ULPGL Goma. Founder of CREDDA and pioneer of environmental justice in DRC.",
      },
      {
        language: "sw",
        role: "Mkurugenzi wa CREDDA",
        bio: "Profesa wa sheria ya mazingira katika ULPGL Goma. Mwanzilishi wa CREDDA.",
      }
    ]
  },
  {
    name: "Dr. Marie-Claire Kahindo",
    email: "kahindo@credda-ulpgl.org",
    order: 2,
    slug: "marie-claire-kahindo",
    translations: [
      {
        language: "fr",
        role: "Coordinatrice de la Clinique CDE",
        bio: "Docteure en droit international de l'environnement. Responsable des programmes de formation clinique et de l'assistance juridique aux communautés vulnérables.",
      },
      {
        language: "en",
        role: "CDE Clinic Coordinator",
        bio: "PhD in international environmental law. Responsible for clinical training and legal assistance programs.",
      },
      {
        language: "sw",
        role: "Mratibu wa Kliniki ya CDE",
        bio: "Daktari wa sheria ya kimataifa ya mazingira. Anayehusika na mipango ya mafunzo ya kliniki.",
      }
    ]
  },
  {
    name: "Me. Patrick Lwaboshi",
    email: "lwaboshi@credda-ulpgl.org",
    order: 3,
    slug: "patrick-lwaboshi",
    translations: [
      {
        language: "fr",
        role: "Avocat d'intérêt public",
        bio: "Avocat au Barreau de Goma. Spécialiste des litiges environnementaux et des droits des peuples autochtones pygmées en RDC.",
      },
      {
        language: "en",
        role: "Public Interest Lawyer",
        bio: "Lawyer at Goma Bar. Specialist in environmental litigation and indigenous peoples rights in DRC.",
      },
      {
        language: "sw",
        role: "Wakili wa Maslahi ya Umma",
        bio: "Wakili katika Baa ya Goma. Mtaalamu wa ugomvi wa mazingira et de haki za watu wa asili.",
      }
    ]
  },
  {
    name: "Mme. Esperance Zawadi",
    email: "zawadi@credda-ulpgl.org",
    order: 4,
    slug: "esperance-zawadi",
    translations: [
      {
        language: "fr",
        role: "Chercheuse — Droits climatiques",
        bio: "Chercheuse spécialisée en droits climatiques et justice environnementale au Nord-Kivu.",
      },
      {
        language: "en",
        role: "Researcher — Climate Rights",
        bio: "Researcher specializing in climate rights and environmental justice in North Kivu.",
      },
      {
        language: "sw",
        role: "Mtafiti — Haki za Hali ya Hewa",
        bio: "Mtafiti anayebobea katika haki za hali ya hewa na haki za mazingira.",
      }
    ]
  }
];

export async function getUsersAndTeam() {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.includes(session.user.role)) {
    throw new Error("Accès non autorisé");
  }

  // 1. Cleanup old fake mock data if present to make room for real data
  const hasFakeMembers = await db.member.findFirst({
    where: { slug: { in: ["stanislas-bilolo", "helene-mwasi"] } }
  });

  if (hasFakeMembers) {
    await db.member.deleteMany({
      where: { slug: { in: ["stanislas-bilolo", "helene-mwasi"] } }
    });
  }

  const hasFakeUsers = await db.user.findFirst({
    where: { email: { in: ["stanislas.bilolo@credda-ulpgl.org", "helene.mwasi@credda-ulpgl.org"] } }
  });

  if (hasFakeUsers) {
    await db.user.deleteMany({
      where: { email: { in: ["stanislas.bilolo@credda-ulpgl.org", "helene.mwasi@credda-ulpgl.org"] } }
    });
  }

  // 2. Seed Real Users if they don't exist
  for (const u of SEED_USERS) {
    try {
      const exists = await db.user.findUnique({ where: { email: u.email } });
      if (!exists) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await db.user.create({
          data: {
            name: u.name,
            email: u.email,
            password: hashedPassword,
            role: u.role as any,
            status: u.status as any,
          }
        });
      }
    } catch (err) {
      console.warn("User seed operation conflict avoided:", err);
    }
  }

  // 3. Seed Real Members if they don't exist
  for (const m of SEED_MEMBERS) {
    try {
      const exists = await db.member.findUnique({ where: { slug: m.slug } });
      if (!exists) {
        await db.member.create({
          data: {
            name: m.name,
            email: m.email,
            order: m.order,
            slug: m.slug,
            translations: {
              createMany: {
                data: m.translations
              }
            }
          }
        });
      }
    } catch (err) {
      console.warn("Member seed operation conflict avoided:", err);
    }
  }

  // Fetch all users
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  // Fetch all team members with translations
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
      role: data.role as any,
      status: data.status as any,
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
      role: data.role as any,
      status: data.status as any,
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
    data: { role: role as any }
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
    data: { status: status as any }
  });

  // Simulate welcome email send if approving
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

  // Do not let the current user delete themselves
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

  // Create member and its translations
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
