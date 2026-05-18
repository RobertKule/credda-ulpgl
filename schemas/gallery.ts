// schemas/gallery.ts
import { z } from "zod";

export const galleryImageTranslationSchema = z.object({
  language: z.string().min(2, "Langue requise"),
  title: z.string().min(2, "Titre requis"),
  description: z.string().optional().nullable(),
});

export const galleryImageSchema = z.object({
  src: z.string().url("URL d'image invalide"),
  category: z.string().min(1, "Catégorie requise"),
  featured: z.boolean().default(false),
  translations: z.array(galleryImageTranslationSchema).min(1, "Au moins une traduction est requise"),
});

export const updateGalleryImageSchema = galleryImageSchema.extend({
  id: z.string(),
});
