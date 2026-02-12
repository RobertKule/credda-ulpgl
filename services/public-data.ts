import { db } from "@/lib/db"; // ⚠️ Assure-toi que le chemin est correct
import { Domain } from "@prisma/client";

export async function getArticlesByDomain(domain: Domain, locale: string) {
  try {
    const articles = await db.article.findMany({
      where: {
        domain: domain,
        published: true,
      },
      include: {
        category: {
          include: {
            translations: { where: { language: locale } }
          }
        },
        translations: {
          where: { language: locale }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return articles;
  } catch (error) {
    // Si la DB est vide ou déconnectée, on log et on renvoie un tableau vide
    console.error("Erreur de lecture base de données:", error);
    return []; 
  }
}