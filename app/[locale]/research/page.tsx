// app/[locale]/research/page.tsx
import { getArticlesByDomain } from "@/services/public-data";
import { Badge } from "@/components/ui/badge";
import { Microscope, SearchX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function ResearchPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  
  // Récupération des articles
  const articles = await getArticlesByDomain("RESEARCH", locale);
  
  // Log de debug pour voir dans le terminal si des données arrivent
  console.log(`🔎 [Research] Articles trouvés pour ${locale}:`, articles.length);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#050a15] text-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Microscope size={16} />
            <span>Domaine Recherche</span>
          </div>
          <h1 className="text-5xl font-serif font-bold italic">Publications Scientifiques</h1>
        </div>
      </header>

      <section className="container mx-auto px-6 py-16">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {articles.map((article) => (
              <Link href={`/${locale}/research/${article.slug}`} key={article.id} className="group">
                <article className="space-y-4">
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    {article.mainImage && (
                      <Image src={article.mainImage} alt="Cover" fill className="object-cover" />
                    )}
                  </div>
                  <h2 className="text-xl font-serif font-bold group-hover:text-blue-700">
                    {article.translations[0]?.title || "Titre non traduit"}
                  </h2>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-100">
            <SearchX className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-serif italic text-lg">Aucun article n'a été publié pour le moment.</p>
            <Link href={`/${locale}`} className="text-blue-600 font-bold mt-4 inline-block underline">
              Retour à l'accueil
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}