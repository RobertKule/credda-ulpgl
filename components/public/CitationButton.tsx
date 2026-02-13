// components/public/CitationButton.tsx
"use client";

import { useState } from "react";
import { FileText, Check } from "lucide-react";

interface CitationButtonProps {
  citation: string;
}

export default function CitationButton({ citation }: CitationButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 bg-white hover:bg-slate-100 rounded-md transition-colors"
      aria-label="Copier la citation"
    >
      {copied ? (
        <Check size={14} className="text-emerald-600" />
      ) : (
        <FileText size={14} className="text-slate-400 hover:text-slate-600" />
      )}
    </button>
  );
}