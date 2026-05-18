// schemas/user.ts
import { z } from "zod";
import { Role, AccountStatus } from "@prisma/client";

export const userRoleSchema = z.nativeEnum(Role);
export const accountStatusSchema = z.nativeEnum(AccountStatus);

export const createUserSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
  role: userRoleSchema.default(Role.USER),
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(2, "Le nom est requis").optional(),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});

export const updateUserPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().min(6, "Le nouveau mot de passe doit faire au moins 6 caractères"),
});
