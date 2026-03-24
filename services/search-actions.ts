// services/search-actions.ts
"use server"

import { sql } from "@/lib/db";

export async function searchEverything(query: string, locale: string) {
  if (!query || query.length < 2) return { articles: [], publications: [], members: [] };

  const pattern = `%${query}%`;

  const [articles, publications, members]: any = await Promise.all([
    sql`
      SELECT a.id, a.slug, a."mainImage",
        (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations
      FROM "Article" a
      WHERE a.published = TRUE 
        AND EXISTS (
          SELECT 1 FROM "ArticleTranslation" at 
          WHERE at."articleId" = a.id 
            AND at.language = ${locale}
            AND (at.title ILIKE ${pattern} OR at.excerpt ILIKE ${pattern})
        )
      LIMIT 5
    `.catch(() => []),
    sql`
      SELECT p.id, p.slug, p."pdfUrl",
        (SELECT json_agg(t) FROM "PublicationTranslation" t WHERE t."publicationId" = p.id AND t.language = ${locale}) as translations
      FROM "Publication" p
      WHERE EXISTS (
        SELECT 1 FROM "PublicationTranslation" pt 
        WHERE pt."publicationId" = p.id 
          AND pt.language = ${locale}
          AND (pt.title ILIKE ${pattern} OR pt.authors ILIKE ${pattern})
      )
      LIMIT 5
    `.catch(() => []),
    sql`
      SELECT m.id, m.image,
        (SELECT json_agg(t) FROM "MemberTranslation" t WHERE t."memberId" = m.id AND t.language = ${locale}) as translations
      FROM "Member" m
      WHERE EXISTS (
        SELECT 1 FROM "MemberTranslation" mt 
        WHERE mt."memberId" = m.id 
          AND mt.language = ${locale}
          AND mt.name ILIKE ${pattern}
      )
      LIMIT 3
    `.catch(() => [])
  ]);

  return { articles, publications, members };
}