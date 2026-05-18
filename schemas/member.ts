// schemas/member.ts
import { z } from "zod";

export const memberTranslationSchema = z.object({
  language: z.string().min(2, "Langue requise"),
  name: z.string().optional().nullable(),
  role: z.string().min(2, "Rôle requis"),
  bio: z.string().optional().nullable(),
  education: z.string().optional().nullable(),
  expertise: z.string().optional().nullable(),
  researchAxes: z.string().optional().nullable(),
});

export const memberSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  slug: z.string().min(2, "Slug requis"),
  email: z.string().email("Email invalide").optional().nullable().or(z.literal("")),
  image: z.string().url("URL d'image invalide").optional().nullable().or(z.literal("")),
  order: z.number().int().default(0),
  facebook: z.string().url().optional().nullable().or(z.literal("")),
  linkedin: z.string().url().optional().nullable().or(z.literal("")),
  twitter: z.string().url().optional().nullable().or(z.literal("")),
  translations: z.array(memberTranslationSchema).min(1, "Au moins une traduction est requise"),
});

export const updateMemberSchema = memberSchema.extend({
  id: z.string(),
});
