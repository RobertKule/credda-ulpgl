// app/[locale]/research/[slug]/ArticleActions.tsx
"use client";

import { useState } from "react";
import { Share2, Bookmark, Check, Download } from "lucide-react";
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: translation?.title,
          text: translation?.excerpt,
          url: shareUrl,
        });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-6">
      <button 
        onClick={handleShare}
        className="flex items-center gap-3 px-8 py-4 bg-soft-cream text-primary font-black uppercase tracking-widest text-[10px] border border-light-gray hover:border-accent hover:bg-white transition-all group"
      >
        {copied ? (
          <><Check size={14} className="text-secondary" /> <span>Copied</span></>
        ) : (
          <><Share2 size={14} className="group-hover:scale-110 transition-transform" /> <span>{t('share')}</span></>
        )}
      </button>

      <button className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-primary transition-all group">
         <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
         <span>Export PDF</span>
      </button>

      <button 
        onClick={() => setSaved(!saved)}
        className={`flex items-center gap-3 px-8 py-4 font-black uppercase tracking-widest text-[10px] transition-all group ${
          saved ? 'bg-secondary text-white' : 'border border-light-gray text-anthracite/40 hover:text-primary hover:border-primary'
        }`}
      >
        <Bookmark size={14} className={saved ? 'fill-white' : ''} />
        <span>{saved ? 'Saved to Library' : t('save')}</span>
      </button>
    </div>
  );
}