import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Scale, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  SearchX, 
  Leaf,
  Calendar,
  ChevronRight
} from "lucide-react";
import { Article } from "@prisma/client";
import Image from "next/image";
import { Suspense } from "react";

interface Props {
  params: Promise<{ locale: string }>;
}
interface ArticleWithTranslations extends Article {
  translations: any[];
  category: {
    translations: any[];
  };
}
// ---------- SKELETONS RESPONSIFS AVEC MOTION ----------
const ClinicalSkeleton = () => (
  <div className="w-full bg-white border border-slate-100 overflow-hidden animate-pulse">
    <div className="flex flex-col lg:flex-row">
      <div className="relative w-full lg:w-48 h-64 lg:h-auto bg-slate-200 shrink-0" />
      <div className="p-8 flex-1 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-24 bg-slate-200" />
          <div className="h-4 w-20 bg-slate-200" />
        </div>
        <div className="space-y-3">
          <div className="h-8 w-3/4 bg-slate-200" />
          <div className="h-4 w-full bg-slate-200" />
          <div className="h-4 w-5/6 bg-slate-200" />
          <div className="h-4 w-4/6 bg-slate-200" />
        </div>
        <div className="h-5 w-48 bg-slate-200 mt-6" />
      </div>
    </div>
  </div>
);

const ClinicalGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
    {[...Array(4)].map((_, i) => (
      <ClinicalSkeleton key={i} />
    ))}
  </div>
);

// ---------- COMPOSANT PRINCIPAL ----------
export default async function ClinicalPage({ params }: Props) {
  const { locale } = await params;

  let articles: Article[] = [];
  try {
    articles = await db.article.findMany({
      where: { domain: "CLINICAL", published: true },
      include: {
        translations: { where: { language: locale } },
        category: { include: { translations: { where: { language: locale } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Database Error (Clinical):", error);
  }

  return (
    <main className="min-h-screen bg-white w-full overflow-x-hidden">
      
      {/* --- 1. HERO SECTION : IDENTITÉ CLINIQUE --- */}
      <section className="relative bg-[#062c24] text-white py-16 sm:py-20 lg:py-24 xl:py-32 overflow-hidden">
        {/* Motif de fond subtil - responsive */}
        <div className="absolute top-0 right-0 w-1/3 lg:w-1/2 h-full bg-emerald-500/5 -skew-x-12 translate-x-1/4 hidden sm:block" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl space-y-4 sm:space-y-6">
            {/* Badge animé */}
            <div className="flex items-center gap-2 text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-4 animate-in slide-in-from-left-12 duration-700">
              <Scale size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Domaine Clinique & Terrain</span>
            </div>
            
            {/* Titre responsive avec animation */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
              La Justice par <span className="text-emerald-400 italic block sm:inline">l'Action Scientifique</span>.
            </h1>
            
            {/* Description responsive */}
            <p className="text-base sm:text-lg lg:text-xl text-emerald-100/70 font-light leading-relaxed max-w-xl lg:max-w-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              La Clinique Juridique et Environnementale du CREDDA accompagne les communautés 
              dans la protection de leurs droits et la préservation de la biodiversité.
            </p>
          </div>
        </div>
        
        {/* Élément décoratif responsive */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
      </section>

      {/* --- 2. VALEURS DE LA CLINIQUE (QUICK STATS/INFO) --- */}
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {/* Carte 1 - Animée */}
            <div className="flex gap-3 sm:gap-4 items-start group animate-in slide-in-from-bottom-4 duration-700 hover:translate-x-1 transition-transform">
              <div className="p-2 sm:p-3 bg-emerald-100 text-emerald-700 rounded-none shrink-0 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Accompagnement Juridique</h3>
                <p className="text-xs sm:text-sm text-slate-500">Médiation et assistance pour les vulnérables.</p>
              </div>
            </div>
            
            {/* Carte 2 - Animée */}
            <div className="flex gap-3 sm:gap-4 items-start group animate-in slide-in-from-bottom-4 duration-700 delay-100 hover:translate-x-1 transition-transform">
              <div className="p-2 sm:p-3 bg-emerald-100 text-emerald-700 rounded-none shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Leaf size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Droits Environnementaux</h3>
                <p className="text-xs sm:text-sm text-slate-500">Protection des écosystèmes du Bassin du Congo.</p>
              </div>
            </div>
            
            {/* Carte 3 - Animée */}
            <div className="flex gap-3 sm:gap-4 items-start group animate-in slide-in-from-bottom-4 duration-700 delay-200 hover:translate-x-1 transition-transform sm:col-span-2 lg:col-span-1">
              <div className="p-2 sm:p-3 bg-emerald-100 text-emerald-700 rounded-none shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MapPin size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Expertise de Terrain</h3>
                <p className="text-xs sm:text-sm text-slate-500">Présence active dans les zones de conflits fonciers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. GRILLE DES ARTICLES CLINIQUES AVEC SUSPENSE --- */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        
        <Suspense fallback={<ClinicalGridSkeleton />}>
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {articles.map((article: ArticleWithTranslations, index: number) => {
                const content = article.translations[0];
                const categoryName = article.category.translations[0]?.name ?? "Action Clinique";

                if (!content) return null;

                return (
                  <Link
                    key={article.id}
                    href={`/clinical/${article.slug}`}
                    className="group block bg-white border border-slate-100 hover:border-emerald-200 transition-all duration-500 hover:shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row h-full">
                      {/* Image avec overlay responsive */}
                      <div className="relative w-full lg:w-48 h-56 sm:h-64 lg:h-auto overflow-hidden bg-slate-100 shrink-0">
                        {article.mainImage ? (
                          <>
                            <Image
                              src={article.mainImage}
                              alt={content.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              priority={index < 2}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 lg:hidden" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-emerald-200 bg-gradient-to-br from-emerald-50 to-slate-50">
                            <Scale size={32} className="sm:w-10 sm:h-10" strokeWidth={1} />
                          </div>
                        )}
                      </div>

                      {/* Contenu responsive */}
                      <div className="p-5 sm:p-6 lg:p-8 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <Badge variant="outline" className="rounded-none border-emerald-600 text-emerald-700 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest px-2 py-1">
                              {categoryName}
                            </Badge>
                            <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                              <Calendar size={10} className="sm:w-3 sm:h-3" />
                              {new Date(article.createdAt).toLocaleDateString(locale, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          
                          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-tight mb-3 sm:mb-4 group-hover:text-emerald-700 transition-colors line-clamp-2">
                            {content.title}
                          </h2>
                          
                          <p className="text-slate-500 font-light text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed">
                            {content.excerpt ?? content.content.substring(0, 120) + "..."}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-6 lg:mt-8 flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-tighter group-hover:gap-2 sm:group-hover:gap-4 transition-all">
                          <span className="whitespace-nowrap">Consulter le rapport</span>
                          <ChevronRight size={12} className="sm:w-[14px] sm:h-[14px] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* --- 4. EMPTY STATE RESPONSIF --- */
            <div className="max-w-xl mx-auto py-16 sm:py-24 px-4 text-center border-2 border-dashed border-slate-100 animate-in fade-in duration-1000">
              // Remplacer ligne 223
<SearchX className="mx-auto text-slate-200 mb-4 sm:mb-6" size={48} strokeWidth={1} />
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mb-3 sm:mb-4">
                Archives cliniques en cours de mise à jour
              </h3>
              <p className="text-sm sm:text-base text-slate-500 font-light leading-relaxed mb-6 sm:mb-8 px-4">
                Nos équipes de terrain finalisent les rapports d'intervention. 
                Revenez très bientôt pour consulter nos dernières actions juridiques.
              </p>
              <Button asChild className="rounded-none bg-emerald-800 hover:bg-emerald-900 px-6 sm:px-8 text-sm sm:text-base">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          )}
        </Suspense>
      </section>

      {/* --- 5. CTA : BESOIN D'ASSISTANCE --- */}
      <section className="bg-emerald-700 py-16 sm:py-20 lg:py-24 text-white relative overflow-hidden">
        {/* Élément décoratif responsive */}
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-800/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start text-center lg:text-left">
            
            {/* Texte responsive */}
            <div className="space-y-4 sm:space-y-6 max-w-2xl lg:max-w-3xl animate-in slide-in-from-left-8 duration-700">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold leading-tight">
                Besoin d'un accompagnement juridique ou foncier ?
              </h2>
              <p className="text-emerald-100 font-light text-sm sm:text-base lg:text-lg">
                Le CREDDA met son expertise au service des communautés locales. 
                Nos experts reçoivent vos demandes chaque semaine.
              </p>
            </div>
            
            {/* Boutons responsive */}
            <div className="flex flex-col sm:flex-row lg:justify-end gap-3 sm:gap-4 w-full sm:w-auto animate-in slide-in-from-right-8 duration-700 delay-200">
              <Button 
                size="lg" 
                className="bg-white text-emerald-900 hover:bg-emerald-50 rounded-none font-bold px-6 sm:px-8 lg:px-10 h-12 sm:h-14 uppercase tracking-widest text-[10px] sm:text-xs w-full sm:w-auto transform hover:scale-105 transition-all duration-300"
              >
                Soumettre un cas clinique
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-emerald-400 text-white hover:bg-emerald-600 rounded-none font-bold px-6 sm:px-8 lg:px-10 h-12 sm:h-14 uppercase tracking-widest text-[10px] sm:text-xs w-full sm:w-auto transform hover:scale-105 transition-all duration-300"
              >
                Contact d'urgence
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* --- 6. FOOTER MINIMAL RESPONSIF --- */}
      <footer className="bg-[#062c24] text-white/60 py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm">
            <p>© {new Date().getFullYear()} CREDDA - Clinique Juridique</p>
            <div className="flex gap-4 sm:gap-6">
              <Link href="/legal" className="hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
      
    </main>
  );
}