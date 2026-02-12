// app/[locale]/research/[slug]/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Clock, User, Calendar } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Metadata } from "next";
import ArticleActions from "./ArticleActions";
import { getTranslations } from "next-intl/server";

// --- SEO DYNAMIQUE ---
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  
  const article = await db.article.findUnique({
    where: { slug },
    include: {
      translations: { where: { language: locale } }
    }
  });

  if (!article || article.translations.length === 0) {
    const t = await getTranslations({ locale, namespace: 'ResearchDetailPage.metadata.notFound' });
    return {
      title: `${t('title')} | CREDDA-ULPGL`,
    };
  }

  const translation = article.translations[0];
  
  return {
    title: `${translation.title} | CREDDA-ULPGL`,
    description: translation.excerpt || "Publication scientifique du CREDDA-ULPGL",
    openGraph: {
      title: translation.title,
      description: translation.excerpt || "Publication scientifique du CREDDA-ULPGL",
      type: 'article',
      publishedTime: article.createdAt.toISOString(),
      authors: ['CREDDA Research Team'],
    },
  };
}

// Composant pour le rendu Markdown personnalisé
const MarkdownComponents = {
  h1: ({ node, ...props }: any) => (
    <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-950 mt-12 mb-6 pb-2 border-b border-slate-100" {...props} />
  ),
  h2: ({ node, ...props }: any) => (
    <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-950 mt-10 mb-4" {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-950 mt-8 mb-3" {...props} />
  ),
  p: ({ node, ...props }: any) => (
    <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6 font-light" {...props} />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-slate-700" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-slate-700" {...props} />
  ),
  blockquote: ({ node, ...props }: any) => (
    <blockquote className="border-l-4 border-blue-600 bg-slate-50 p-6 my-8 italic text-slate-700" {...props} />
  ),
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        className="rounded-none my-6 text-sm"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  },
};

// Fonction pour calculer le temps de lecture
function calculateReadTime(content: string = ''): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export default async function ResearchDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'ResearchDetailPage' });
  
  const article = await db.article.findUnique({
    where: { slug },
    include: {
      translations: { where: { language: locale } },
      category: { 
        include: { 
          translations: { 
            where: { language: locale } 
          } 
        } 
      },
      medias: true
    }
  });

  if (!article || article.domain !== "RESEARCH" || article.translations.length === 0) {
    notFound();
  }
  
  const translation = article.translations[0];
  const categoryName = article.category.translations[0]?.name || t('metadata.category');
  const readTime = calculateReadTime(translation.content);
  const publishDate = new Date(article.createdAt).toLocaleDateString(locale, { 
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Header Académique */}
      <div className="bg-[#050a15] text-white py-20 lg:py-32">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-8">
            <Link 
              href="/research" 
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 hover:text-white transition-all group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              {t('back')}
            </Link>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-600 rounded-none text-[9px] uppercase tracking-[0.3em] font-black py-1">
                {categoryName}
              </Badge>
              <span className="text-slate-400 text-[10px] font-mono">
                {t('ref')}: {article.id.substring(0, 8).toUpperCase()}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              {translation.title}
            </h1>
            
            <div className="flex flex-wrap gap-8 pt-4 border-t border-white/10 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <User size={14} className="text-blue-500" /> 
                {t('authors')}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-blue-500" /> 
                {publishDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-blue-500" /> 
                {t('readingTime', { time: readTime })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image principale si disponible */}
      {article.mainImage && (
        <div className="container mx-auto px-6 -mt-12 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-[21/9] overflow-hidden border-8 border-white shadow-2xl">
              <Image
                src={article.mainImage}
                alt={translation.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Contenu Article avec Support Markdown */}
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 shadow-2xl border border-slate-100">
          
          {/* Extrait si disponible */}
          {translation.excerpt && (
            <div className="mb-12 pb-8 border-b border-slate-100">
              <p className="text-xl text-slate-600 font-serif italic leading-relaxed">
                {translation.excerpt}
              </p>
            </div>
          )}

          {/* Contenu Markdown */}
          <div className="prose prose-slate max-w-none font-serif">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]}
              components={MarkdownComponents}
            >
              {translation.content}
            </ReactMarkdown>
          </div>

          {/* Section Actions avec composant client */}
          <div className="mt-20 pt-10 border-t border-slate-100">
            <ArticleActions article={article} translation={translation} />
          </div>
        </div>
      </div>
    </main>
  );
}