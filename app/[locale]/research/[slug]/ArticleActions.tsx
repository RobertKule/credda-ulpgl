// app/[locale]/research/[slug]/ArticleActions.tsx
"use client";

import { useState } from "react";
import { Share, Bookmark, Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface ArticleActionsProps {
  article: any;
  translation: any;
}

export default function ArticleActions({ article, translation }: ArticleActionsProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const t = useTranslations('ResearchDetailPage.actions');

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = translation?.title || "Publication CREDDA";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: translation?.excerpt || "Publication scientifique du CREDDA-ULPGL",
          url: shareUrl,
        });
      } catch (err) {
        console.log("Partage annulé");
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Erreur de copie:", err);
      }
    }
  };

  const handleSave = () => {
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    if (!saved) {
      savedArticles.push({
        id: article.id,
        slug: article.slug,
        title: translation?.title,
        date: new Date().toISOString()
      });
      localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
      setSaved(true);
    } else {
      const filtered = savedArticles.filter((a: any) => a.id !== article.id);
      localStorage.setItem('savedArticles', JSON.stringify(filtered));
      setSaved(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-4">
      <button 
        onClick={handleShare}
        className="flex items-center gap-2 text-xs font-bold uppercase p-3 border border-slate-200 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700 transition-all group relative min-w-[120px] justify-center"
      >
        {copied ? (
          <>
            <Check size={14} className="text-green-600" />
            <span>{t('copied')}</span>
          </>
        ) : (
          <>
            <Share size={14} className="group-hover:scale-110 transition-transform" />
            {t('share')}
          </>
        )}
      </button>

      <button 
        onClick={handleSave}
        className={`flex items-center gap-2 text-xs font-bold uppercase p-3 border transition-all group min-w-[120px] justify-center ${
          saved 
            ? 'bg-blue-900 text-white border-blue-900 hover:bg-blue-800' 
            : 'border-slate-200 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700'
        }`}
      >
        <Bookmark 
          size={14} 
          className={`transition-transform group-hover:scale-110 ${saved ? 'fill-white' : ''}`} 
        />
        {saved ? t('saved') : t('save')}
      </button>
    </div>
  );
}