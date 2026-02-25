// components/public/PdfPreview.tsx
"use client";

import { useState } from "react";
import { FileText, Download, ExternalLink, Loader2 } from "lucide-react";

interface PdfPreviewProps {
  url: string;
}

/**
 * PDF Presentation Card
 *
 * Cloudinary raw-upload URLs serve PDFs with `Content-Disposition: attachment`
 * and may have X-Frame-Options set, which prevents reliable <iframe> embedding.
 * This component renders a clean download/open card instead — always reliable,
 * works on all browsers and devices, no CORS issues.
 *
 * The download handler fetches the file as a blob and saves it with a .pdf
 * filename, regardless of what the Cloudinary URL looks like (e.g. file_ruvfp8).
 */
export default function PdfPreview({ url }: PdfPreviewProps) {
  const [downloading, setDownloading] = useState(false);

  // No URL — show neutral placeholder
  if (!url) {
    return (
      <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center gap-3 p-4">
        <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center">
          <FileText size={28} className="text-slate-400" />
        </div>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold text-center">
          Aucun document
        </p>
      </div>
    );
  }

  // Build a clean .pdf filename for display and download
  const rawName = url.split("/").pop()?.replace(/\?.*$/, "") || "document";
  const filename = rawName.endsWith(".pdf") ? rawName : `${rawName}.pdf`;

  // Blob-based download: fetches original URL and saves under filename.pdf
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback: open in new tab if fetch fails (e.g. CORS)
      window.open(url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-blue-950 flex flex-col items-center justify-center gap-4 p-6 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-400 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-400 rounded-full blur-3xl" />
      </div>

      {/* PDF icon */}
      <div className="relative z-10 w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
        <FileText size={32} className="text-blue-400" />
      </div>

      {/* Label */}
      <div className="relative z-10 text-center space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
          Document PDF
        </p>
        <p className="text-[9px] text-slate-500 font-mono truncate max-w-[160px]">
          {filename}
        </p>
      </div>

      {/* Action buttons */}
      <div className="relative z-10 flex flex-col gap-2 w-full">
        {/* Ouvrir: use original URL — Cloudinary handles the stream */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-4 text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <ExternalLink size={12} />
          Ouvrir
        </a>

        {/* Télécharger: blob download with .pdf filename */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white py-2 px-4 text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-wait"
        >
          {downloading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Download size={12} />
          )}
          {downloading ? "Chargement…" : "Télécharger"}
        </button>
      </div>
    </div>
  );
}