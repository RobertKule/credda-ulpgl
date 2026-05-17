// schemas/program.ts
import { z } from "zod";

export const programTranslationSchema = z.object({
  language: z.string().min(2, "Langue requise"),
  title: z.string().min(2, "Titre requis"),
  description: z.string().min(10, "Description trop courte"),
});

export const programSchema = z.object({
  slug: z.string().min(2, "Slug requis"),
  mainImage: z.string().url("URL d'image invalide").nullable().optional().or(z.literal("")),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  translations: z.array(programTranslationSchema).min(1, "Au moins une traduction est requise"),
});

export const updateProgramSchema = programSchema.extend({
  id: z.string(),
});
