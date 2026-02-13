// components/public/ShareButtons.tsx
"use client";

import { useState } from "react";
import { Twitter, Linkedin, Mail, Facebook, Share2, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
  description: string;
}

export default function ShareButtons({ title, url, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mr-1">
        Partager
      </span>
      
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-slate-100 hover:bg-black hover:text-white rounded-full transition-all duration-300"
        aria-label="Partager sur Twitter"
      >
        <Twitter size={13} />
      </a>
      
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-slate-100 hover:bg-[#0A66C2] hover:text-white rounded-full transition-all duration-300"
        aria-label="Partager sur LinkedIn"
      >
        <Linkedin size={13} />
      </a>
      
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-slate-100 hover:bg-[#1877F2] hover:text-white rounded-full transition-all duration-300"
        aria-label="Partager sur Facebook"
      >
        <Facebook size={13} />
      </a>
      
      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`}
        className="p-2 bg-slate-100 hover:bg-[#EA4335] hover:text-white rounded-full transition-all duration-300"
        aria-label="Partager par email"
      >
        <Mail size={13} />
      </a>
      
      <button
        onClick={handleCopy}
        className={`p-2 transition-all duration-300 rounded-full ${
          copied 
            ? 'bg-emerald-600 text-white' 
            : 'bg-slate-100 hover:bg-slate-800 hover:text-white'
        }`}
        aria-label="Copier le lien"
      >
        {copied ? <Check size={13} /> : <Share2 size={13} />}
      </button>
    </div>
  );
}