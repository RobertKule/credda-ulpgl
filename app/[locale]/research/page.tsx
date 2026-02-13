import { getArticlesByDomain } from "@/services/public-data";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { 
  Microscope, 
  SearchX, 
  Calendar, 
  ArrowRight, 
  BookOpen, 
  FileText,
  User2,
  Clock,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";

// --- SEO DYNAMIQUE ---
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles: any = {
    fr: "Recherches & Publications | CREDDA-ULPGL",
    en: "Research & Publications | CREDDA-ULPGL",
    sw: "Utafiti na Machapisho | CREDDA-ULPGL"
  };
  return { title: titles[locale] || titles.fr };
}

export default async function ResearchPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  
  // Récupération des articles RESEARCH
  const articles = await getArticlesByDomain("RESEARCH", locale);

  return (
    <main className="min-h-screen bg-white">
      
      {/* --- HEADER INSTITUTIONNEL (DARK) --- */}
      <header className="relative bg-[#050a15] text-white py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 -skew-x-12 translate-x-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <Badge className="bg-blue-600 text-white rounded-none px-4 py-1 uppercase tracking-[0.2em] text-[10px] font-bold">
              Production Scientifique
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-tight">
              Recherches <span className="text-blue-400 italic">&</span> Analyses.
            </h1>
            <p className="text-xl text-slate-400 font-light leading-relaxed">
              Découvrez nos travaux sur la gouvernance, la démocratie et le développement 
              durable en Afrique, produits par nos chercheurs et partenaires internationaux.
            </p>
          </div>
        </div>
      </header>

      {/* --- BARRE DE STATUT / FILTRES --- */}
      <nav className="border-b border-slate-100 bg-slate-50/50 sticky top-16 z-30 hidden md:block">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <div className="flex gap-8">
            <span className="text-blue-600 border-b-2 border-blue-600 py-4">Tous les travaux</span>
            <span className="hover:text-slate-900 cursor-pointer py-4 transition-colors">Démocratie</span>
            <span className="hover:text-slate-900 cursor-pointer py-4 transition-colors">Gouvernance</span>
            <span className="hover:text-slate-900 cursor-pointer py-4 transition-colors">Paix & Sécurité</span>
          </div>
          <div className="flex items-center gap-2 italic normal-case font-medium text-slate-400">
            <BookOpen size={14} />
            {articles.length} documents disponibles
          </div>
        </div>
      </nav>

      {/* --- GRILLE DES PUBLICATIONS --- */}
      <section className="container mx-auto px-6 py-20">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {articles.map((article) => {
              const translation = article.translations[0];
              const category = article.category.translations[0]?.name || "Recherche";

              return (
                <div key={article.id} className="group flex flex-col h-full">
                  {/* ✅ LIEN SUR L'IMAGE */}
                  <Link 
                    href={`/research/${article.slug}`} 
                    className="block relative aspect-[16/10] overflow-hidden bg-slate-100 border border-slate-100"
                  >
                    {article.mainImage ? (
                      <Image 
                        src={article.mainImage} 
                        alt={translation?.title || "Research"} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <FileText size={40} strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Badge avec lien aussi */}
                    <Link href={`/research?category=${article.category.slug}`}>
                      <Badge className="absolute top-4 left-4 bg-blue-900/90 backdrop-blur-md text-white rounded-none text-[9px] uppercase tracking-widest border-none hover:bg-blue-800 transition-colors z-10">
                        {category}
                      </Badge>
                    </Link>
                  </Link>

                  {/* ✅ LIEN SUR LA DATE (FILTRE ANNÉE) */}
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-5 mb-3">
                    <Link 
                      href={`/research?year=${new Date(article.createdAt).getFullYear()}`}
                      className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                    >
                      <Calendar size={12} className="text-blue-600" />
                      {new Date(article.createdAt).toLocaleDateString(locale, { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </Link>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-slate-500">CREDDA Paper</span>
                  </div>

                  {/* ✅ LIEN SUR LE TITRE */}
                  <Link 
                    href={`/research/${article.slug}`}
                    className="group/link"
                  >
                    <h2 className="text-2xl font-serif font-bold text-slate-950 leading-snug group-hover:text-blue-700 transition-colors hover:underline decoration-blue-700/30 underline-offset-4">
                      {translation?.title || "Untitled Research"}
                    </h2>
                  </Link>

                  {/* Auteurs (si disponibles) */}
                  {translation?.excerpt && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                      <User2 size={12} className="text-slate-400" />
                      <span className="font-medium line-clamp-1">Équipe de recherche CREDDA</span>
                    </div>
                  )}

                  {/* Résumé */}
                  <p className="text-slate-500 font-light text-sm line-clamp-3 leading-relaxed mt-3">
                    {translation?.excerpt || "Aucun résumé disponible pour cette publication scientifique."}
                  </p>

                  {/* ✅ BOUTON "LIRE LA SUITE" AMÉLIORÉ */}
                  <div className="pt-5 mt-auto">
                    <Link 
                      href={`/research/${article.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-tighter text-blue-900 group-hover:text-blue-700 transition-all group/btn"
                    >
                      <span>Accéder au rapport complet</span>
                      <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                    </Link>
                    
                    {/* ✅ BADGE TEMPS DE LECTURE ESTIMÉ */}
                    <div className="flex items-center gap-2 text-[9px] text-slate-400 mt-3 pt-3 border-t border-slate-100">
                      <Clock size={12} className="text-slate-300" />
                      <span>Lecture: 8 min</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-blue-600">Version PDF</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* --- ÉTAT VIDE (EMPTY STATE) AVEC LIENS --- */
          <div className="max-w-2xl mx-auto py-24 text-center border-2 border-dashed border-slate-100 rounded-none">
            <SearchX className="mx-auto text-slate-200 mb-6" size={64} strokeWidth={1} />
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">Archives en cours de numérisation</h3>
            <p className="text-slate-500 font-light leading-relaxed mb-8">
              Nos équipes travaillent actuellement à l'intégration des rapports récents. 
              Revenez très bientôt pour consulter nos dernières avancées.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-3 bg-blue-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-800 transition-all">
                S'abonner aux alertes
              </button>
              <Link 
                href="/" 
                className="px-8 py-3 border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* --- FOOTER DE SECTION (CTA) AVEC LIEN --- */}
      <section className="bg-slate-950 py-20 text-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h3 className="text-3xl font-serif font-bold mb-4">Bibliothèque Physique</h3>
            <p className="text-slate-400 font-light">
              Le CREDDA dispose également d'un centre de documentation physique ouvert aux chercheurs sur le campus de l'ULPGL à Goma.
            </p>
          </div>
          <Link 
            href="/contact?subject=demande-rendezvous-bibliotheque"
            className="px-10 py-5 bg-blue-600 font-bold uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shrink-0 inline-flex items-center gap-2 group"
          >
            <span>Prendre rendez-vous</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

    </main>
  );
}