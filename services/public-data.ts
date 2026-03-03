import { db } from "@/lib/db";
import { Domain } from "@prisma/client";

export async function getArticlesByDomain(
  domain: Domain,
  locale: string,
  limit: number = 10,
  cursor?: string
) {
  try {
    const articles = await db.article.findMany({
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      where: {
        domain: domain,
        published: true,
      },
      select: {
        id: true,
        slug: true,
        mainImage: true,
        createdAt: true,
        category: {
          select: {
            translations: {
              where: { language: locale },
              select: { name: true }
            }
          }
        },
        translations: {
          where: { language: locale },
          select: { title: true, excerpt: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (articles.length > limit) {
      const nextItem = articles.pop();
      nextCursor = nextItem!.id;
    }

    return { data: articles, nextCursor };
  } catch (error) {
    console.error("Erreur de lecture base de données:", error);
    return { data: [], nextCursor: undefined };
  }
}