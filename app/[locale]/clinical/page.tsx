// app/[locale]/clinical/page.tsx
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
import Image from "next/image";
import { Article, Category } from "@prisma/client";
import { getTranslations } from "next-intl/server";

// Interface complète pour les articles avec relations
interface ArticleWithRelations extends Article {
  translations: {
    id: string;
    language: string;
    title: string;
    excerpt: string | null;
    content: string;
    articleId: string;
  }[];
  category: Category & {
    translations: {
      id: string;
      language: string;
      name: string;
      categoryId: string;
    }[];
  };
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ClinicalPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ClinicalPage' });

  // Typage explicite du résultat
  let articles: ArticleWithRelations[] = [];
  
  try {
    const result = await db.article.findMany({
      where: { domain: "CLINICAL", published: true },
      include: {
        translations: { 
          where: { language: locale },
          select: {
            id: true,
            language: true,
            title: true,
            excerpt: true,
            content: true,
            articleId: true
          }
        },
        category: { 
          include: { 
            translations: { 
              where: { language: locale },
              select: {
                id: true,
                language: true,
                name: true,
                categoryId: true
              }
            } 
          } 
        },
      },
      orderBy: { createdAt: "desc" },
    });
    
    articles = result as ArticleWithRelations[];
  } catch (error) {
    console.error("Database Error (Clinical):", error);
  }

  const values = t.raw('values');

  return (
    <main className="min-h-screen bg-white w-full overflow-x-hidden">
      
      {/* --- 1. HERO SECTION : IDENTITÉ CLINIQUE --- */}
      <section className="relative bg-[#062c24] text-white py-16 sm:py-20 lg:py-24 xl:py-32 overflow-hidden">
        {/* Motif de fond subtil - responsive */}
        <div className="absolute top-0 right-0 w-1/3 lg:w-1/2 h-full bg-emerald-500/5 -skew-x-12 translate-x-1/4 hidden sm:block" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-4">
              <Scale size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>{t('header.badge')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-tight">
              <span dangerouslySetInnerHTML={{ __html: t.raw('header.title') }} />
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-emerald-100/70 font-light leading-relaxed max-w-xl lg:max-w-2xl">
              {t('header.description')}
            </p>
          </div>
        </div>
      </section>

      {/* --- 2. VALEURS DE LA CLINIQUE --- */}
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {[
              { icon: <ShieldCheck size={20} className="sm:w-6 sm:h-6" />, key: 0 },
              { icon: <Leaf size={20} className="sm:w-6 sm:h-6" />, key: 1 },
              { icon: <MapPin size={20} className="sm:w-6 sm:h-6" />, key: 2 }
            ].map((item, i) => (
              <div key={i} className="flex gap-3 sm:gap-4 items-start group">
                <div className="p-2 sm:p-3 bg-emerald-100 text-emerald-700 rounded-none shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{values[i].title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500">{values[i].desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. GRILLE DES ARTICLES CLINIQUES --- */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {articles.map((article, index) => {
              // Vérification sécurisée des traductions
              const content = article.translations?.[0];
              const categoryName = article.category?.translations?.[0]?.name ?? t('article.badge');

              // Skip si pas de traduction
              if (!content) return null;

              return (
                <div
                  key={article.id}
                  className="group block bg-white border border-slate-100 hover:border-emerald-200 transition-all duration-500 hover:shadow-2xl overflow-hidden"
                >
                  <Link
                    href={`/clinical/${article.slug}`}
                    className="flex flex-col lg:flex-row h-full"
                  >
                    {/* Image */}
                    <div className="relative w-full lg:w-48 h-56 sm:h-64 lg:h-auto overflow-hidden bg-slate-100 shrink-0">
                      {article.mainImage ? (
                        <Image
                          src={article.mainImage}
                          alt={content.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          priority={index < 2}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-emerald-200 bg-gradient-to-br from-emerald-50 to-slate-50">
                          <Scale size={32} className="sm:w-10 sm:h-10" strokeWidth={1} />
                        </div>
                      )}
                    </div>

                    {/* Contenu */}
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
                        <span className="whitespace-nowrap">{t('article.readMore')}</span>
                        <ChevronRight size={12} className="sm:w-[14px] sm:h-[14px] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          /* --- 4. EMPTY STATE --- */
          <div className="max-w-xl mx-auto py-16 sm:py-24 px-4 text-center border-2 border-dashed border-slate-100">
            <SearchX className="mx-auto text-slate-200 mb-4 sm:mb-6" size={48} strokeWidth={1} />
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mb-3 sm:mb-4">
              {t('empty.title')}
            </h3>
            <p className="text-sm sm:text-base text-slate-500 font-light leading-relaxed mb-6 sm:mb-8 px-4">
              {t('empty.description')}
            </p>
            <Button asChild className="rounded-none bg-emerald-800 hover:bg-emerald-900 px-6 sm:px-8 text-sm sm:text-base">
              <Link href="/">{t('empty.button')}</Link>
            </Button>
          </div>
        )}
      </section>

      {/* --- 5. CTA : BESOIN D'ASSISTANCE --- */}
      <section className="bg-emerald-700 py-16 sm:py-20 lg:py-24 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start text-center lg:text-left">
            <div className="space-y-4 sm:space-y-6 max-w-2xl lg:max-w-3xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold leading-tight">
                {t('cta.title')}
              </h2>
              <p className="text-emerald-100 font-light text-sm sm:text-base lg:text-lg">
                {t('cta.description')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-white text-emerald-900 hover:bg-emerald-50 rounded-none font-bold px-6 sm:px-8 lg:px-10 h-12 sm:h-14 uppercase tracking-widest text-[10px] sm:text-xs w-full sm:w-auto transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/contact">{t('cta.button1')}</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-emerald-400 text-white bg-emerald-900 hover:bg-emerald-600 rounded-none font-bold px-6 sm:px-8 lg:px-10 h-12 sm:h-14 uppercase tracking-widest text-[10px] sm:text-xs w-full sm:w-auto transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/contact">{t('cta.button2')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
    </main>
  );
}