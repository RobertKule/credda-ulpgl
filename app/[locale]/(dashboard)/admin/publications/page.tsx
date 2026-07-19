import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import PublicationsClient from "./PublicationsClient";
import { Domain, ContentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface PublicationItem {
  id: string;
  title: string;
  type: Domain;
  category: string;
  shortDescription: string;
  content: string;
  imageUrl?: string;
  pdfUrl?: string;
  status: ContentStatus;
  createdAt: string;
}

export default async function PublicationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  // Fetch real articles from the database
  const rawArticles = await db.article.findMany({
    include: {
      translations: true,
      category: {
        include: { translations: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Map to the PublicationItem format expected by the frontend
  const initialData: PublicationItem[] = rawArticles.map(article => {
    // Find the translation for the current locale, fallback to 'fr', then first available
    const translation = article.translations.find(t => t.language === locale) 
      || article.translations.find(t => t.language === "fr") 
      || article.translations[0];
      
    const catTranslation = article.category.translations.find(t => t.language === locale)
      || article.category.translations.find(t => t.language === "fr")
      || article.category.translations[0];

    return {
      id: article.id,
      title: translation?.title || "Sans titre",
      type: article.domain, // "RESEARCH" | "CLINICAL"
      category: catTranslation?.name || "Général",
      shortDescription: translation?.excerpt || "",
      content: translation?.content || "",
      imageUrl: article.mainImage || undefined,
      pdfUrl: article.videoUrl || undefined,
      status: translation?.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
      createdAt: article.createdAt.toISOString()
    };
  });

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Gestion des Publications</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Pilotez l'ensemble des contenus scientifiques et juridiques du centre.
          </p>
        </div>
      </div>

      <PublicationsClient locale={locale} initialData={initialData} userRole={session.user.role} />
    </div>
  );
}
