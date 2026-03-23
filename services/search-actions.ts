// services/search-actions.ts
"use server"

import { db } from "@/lib/db";
import { safeQuery } from "@/lib/db-safe";

export async function searchEverything(query: string, locale: string) {
  if (!query || query.length < 2) return { articles: [], publications: [], members: [] };

  const [articles, publications, members] = await Promise.all([
    safeQuery(
      () =>
        db.article.findMany({
          where: {
            published: true,
            translations: {
              some: {
                language: locale,
                OR: [{ title: { contains: query } }, { excerpt: { contains: query } }]
              }
            }
          },
          select: {
            id: true,
            slug: true,
            mainImage: true,
            translations: { where: { language: locale }, select: { title: true, excerpt: true } }
          },
          take: 5
        }),
      [],
      "search:articles"
    ),
    safeQuery(
      () =>
        db.publication.findMany({
          where: {
            translations: {
              some: {
                language: locale,
                OR: [{ title: { contains: query } }, { authors: { contains: query } }]
              }
            }
          },
          select: {
            id: true,
            slug: true,
            pdfUrl: true,
            translations: { where: { language: locale }, select: { title: true, authors: true } }
          },
          take: 5
        }),
      [],
      "search:publications"
    ),
    safeQuery(
      () =>
        db.member.findMany({
          where: {
            translations: {
              some: {
                language: locale,
                name: { contains: query }
              }
            }
          },
          select: {
            id: true,
            image: true,
            translations: { where: { language: locale }, select: { name: true, role: true } }
          },
          take: 3
        }),
      [],
      "search:members"
    )
  ]);

  return { articles, publications, members };
}