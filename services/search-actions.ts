// services/search-actions.ts
"use server"

import { db } from "@/lib/db";

export async function searchEverything(query: string, locale: string) {
  if (!query || query.length < 2) return { articles: [], publications: [], members: [] };

  try {
    const [articles, publications, members] = await Promise.all([
      db.article.findMany({
        where: {
          published: true,
          translations: {
            some: {
              language: locale,
              OR: [
                { title: { contains: query } },
                { excerpt: { contains: query } }
              ]
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
      db.publication.findMany({
        where: {
          translations: {
            some: {
              language: locale,
              OR: [
                { title: { contains: query } },
                { authors: { contains: query } }
              ]
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
      })
    ]);

    return { articles, publications, members };
  } catch (error) {
    console.error("Search Logic Error:", error);
    return { articles: [], publications: [], members: [] };
  }
}