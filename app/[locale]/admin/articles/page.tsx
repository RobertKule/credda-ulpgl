// app/[locale]/admin/articles/page.tsx - VERSION CORRIGÉE
import { db } from "@/lib/db";
import ArticlesClient from "./ArticlesClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;

  // ✅ LES DONNÉES SONT RÉCUPÉRÉES CÔTÉ SERVEUR
  const articles = await db.article.findMany({
    include: { 
      category: { include: { translations: { where: { language: locale } } } },
      translations: { where: { language: locale } } 
    },
    orderBy: { createdAt: "desc" },
  });

  // ✅ ON PASSE LES DONNÉES AU COMPOSANT CLIENT
  return <ArticlesClient articles={articles} locale={locale} />;
}