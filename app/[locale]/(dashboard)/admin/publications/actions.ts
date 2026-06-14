"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/lib/storage";
import { Domain, ContentStatus } from "@prisma/client";

// ─── File Upload ─────────────────────────────────────────────────────────────
export async function uploadPublicationMedia(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) return { error: "Aucun fichier sélectionné" };

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadFile(buffer, file.name, file.type, "publications");
    return { url };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ─── Shared Types ────────────────────────────────────────────────────────────
export interface PublicationFormData {
  title: string;
  type: Domain;         // "RESEARCH" | "CLINICAL"
  categorySlug: string;
  shortDescription: string;
  content: string;
  status: ContentStatus;       // "PUBLISHED" | "DRAFT"
  imageUrl?: string;
  pdfUrl?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

async function findOrCreateCategory(slug: string, name: string) {
  const existing = await db.category.findUnique({ where: { slug } });
  if (existing) return existing;

  return db.category.create({
    data: {
      slug,
      translations: {
        create: [
          { language: "fr", name },
          { language: "en", name },
          { language: "sw", name },
        ],
      },
    },
  });
}

// ─── Create Article ──────────────────────────────────────────────────────────
export async function createArticleAction(data: PublicationFormData) {
  const slug = `${slugify(data.title)}-${Date.now()}`;
  const catSlug = slugify(data.categorySlug);

  const category = await findOrCreateCategory(catSlug, data.categorySlug);

  const article = await db.article.create({
    data: {
      slug,
      domain: data.type,
      published: data.status === ContentStatus.PUBLISHED,
      mainImage: data.imageUrl ?? null,
      videoUrl: data.pdfUrl ?? null,
      categoryId: category.id,
      translations: {
        create: [
          {
            language: "fr",
            title: data.title,
            content: data.content,
            excerpt: data.shortDescription,
            status: data.status,
          },
          {
            language: "en",
            title: data.title,
            content: data.content,
            excerpt: data.shortDescription,
            status: data.status,
          },
          {
            language: "sw",
            title: data.title,
            content: data.content,
            excerpt: data.shortDescription,
            status: data.status,
          },
        ],
      },
    },
  });

  revalidatePath("/", "layout");
  return { success: true, id: article.id };
}

// ─── Update Article ──────────────────────────────────────────────────────────
export async function updateArticleAction(
  id: string,
  data: PublicationFormData
) {
  const catSlug = slugify(data.categorySlug);
  const category = await findOrCreateCategory(catSlug, data.categorySlug);

  await db.article.update({
    where: { id },
    data: {
      domain: data.type,
      published: data.status === ContentStatus.PUBLISHED,
      mainImage: data.imageUrl ?? undefined,
      videoUrl: data.pdfUrl ?? undefined,
      categoryId: category.id,
    },
  });

  // Upsert translations for each locale
  for (const lang of ["fr", "en", "sw"]) {
    await db.articleTranslation.upsert({
      where: { articleId_language: { articleId: id, language: lang } },
      create: {
        articleId: id,
        language: lang,
        title: data.title,
        content: data.content,
        excerpt: data.shortDescription,
        status: data.status,
      },
      update: {
        title: data.title,
        content: data.content,
        excerpt: data.shortDescription,
        status: data.status,
      },
    });
  }

  revalidatePath("/", "layout");
  return { success: true };
}

// ─── Delete Article ──────────────────────────────────────────────────────────
export async function deleteArticleAction(id: string) {
  await db.article.delete({ where: { id } });
  revalidatePath("/", "layout");
  return { success: true };
}
