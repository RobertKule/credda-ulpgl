"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const translationSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  content: z.string().min(1, "Le contenu est requis"),
  excerpt: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

const upsertArticleSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1, "Le slug est requis"),
  categoryId: z.string().min(1, "La catégorie est requise"),
  translations: z.record(z.string(), translationSchema),
});

export async function upsertArticle(formData: any) {
  // 1. Authentification & Autorisation
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Non authentifié");
  }

  const allowedRoles = ["ADMIN", "SUPERADMIN", "RESEARCHER", "EDITOR"];
  if (!allowedRoles.includes(session.user.role)) {
    throw new Error("Action non autorisée pour votre rôle");
  }

  // 2. Validation des données
  const parsed = upsertArticleSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: "Données invalides", issues: parsed.error.issues };
  }

  const { id, slug, categoryId, translations } = parsed.data;

  // S'assurer qu'au moins une langue est fournie
  if (Object.keys(translations).length === 0) {
    throw new Error("Au moins une langue doit être renseignée");
  }

  try {
    const result = await db.$transaction(async (tx) => {
      // 3. Upsert de l'Article parent
      const article = id 
        ? await tx.article.update({
            where: { id },
            data: { slug, categoryId, updatedAt: new Date() }
          })
        : await tx.article.create({
            data: { slug, categoryId, domain: "RESEARCH" }
          });

      // 4. Upsert des traductions
      for (const [lang, data] of Object.entries(translations)) {
        await tx.articleTranslation.upsert({
          where: {
            articleId_language: {
              articleId: article.id,
              language: lang
            }
          },
          update: {
            title: data.title,
            content: data.content,
            excerpt: data.excerpt,
            status: data.status
          },
          create: {
            articleId: article.id,
            language: lang,
            title: data.title,
            content: data.content,
            excerpt: data.excerpt,
            status: data.status
          }
        });
      }

      // 5. Traçabilité (Audit Log)
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: id ? "UPDATE_ARTICLE" : "CREATE_ARTICLE",
          entity: "Article",
          entityId: article.id,
          details: `${id ? "Mise à jour" : "Création"} de l'article trilingue: ${slug}`,
          metadata: { categoryId, languages: Object.keys(translations) }
        }
      });

      return article;
    });

    // 6. Revalidation de cache
    // On invalide le chemin public de l'article et la liste des recherches
    revalidatePath(`/researches/${slug}`);
    revalidatePath(`/[locale]/publications`, "layout"); // Revalide la liste globale
    revalidateTag("articles", "default");

    return { success: true, article: result };
  } catch (error: any) {
    console.error("[UPSERT_ARTICLE_ERROR]", error);
    return { error: "Erreur lors de l'enregistrement en base de données" };
  }
}
