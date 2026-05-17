// schemas/article.ts
import { z } from "zod";
import { Domain } from "@prisma/client";

export const articleTranslationSchema = z.object({
  language: z.string().min(2, "Langue requise"),
  title: z.string().min(2, "Titre requis"),
  content: z.string().min(10, "Contenu trop court"),
  excerpt: z.string().optional().or(z.literal("")),
});

export const articleSchema = z.object({
  slug: z.string().min(2, "Slug requis"),
  domain: z.nativeEnum(Domain),
  categoryId: z.string().min(1, "Catégorie requise"),
  mainImage: z.string().url("URL d'image invalide").nullable().optional().or(z.literal("")),
  videoUrl: z.string().url("URL vidéo invalide").nullable().optional().or(z.literal("")),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  translations: z.array(articleTranslationSchema).min(1, "Au moins une traduction est requise"),
});

export const updateArticleSchema = articleSchema.extend({
  id: z.string(),
});
