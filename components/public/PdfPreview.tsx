// components/public/PdfPreview.tsx - Version avec iframe
"use client";

import { useState, useEffect } from "react";
import { Loader2, FileWarning, Download, FileText, XCircle, Eye } from "lucide-react";

interface PdfPreviewProps {
  url: string;
}

export default function PdfPreview({ url }: PdfPreviewProps) {
  const [fileExists, setFileExists] = useState<boolean | null>(null);
  const [checkingFile, setCheckingFile] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function checkFileExists() {
      if (!url || url === "#" || url === "") {
        setFileExists(false);
        setCheckingFile(false);
        return;
      }

      try {
        const response = await fetch(url, { method: 'HEAD' });
        setFileExists(response.ok);
      } catch (err) {
        setFileExists(false);
      } finally {
        setCheckingFile(false);
      }
    }

    checkFileExists();
  }, [url]);

  if (checkingFile) {
    return (
      <div className="w-full h-full bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={24} />
      </div>
    );
  }

  if (fileExists === false) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
          <XCircle size={32} className="text-red-500" />
        </div>
        <h4 className="text-sm font-bold text-red-700 uppercase tracking-widest mb-1">
          Fichier introuvable
        </h4>
        <p className="text-xs text-slate-600 text-center mb-3">
          Le PDF n'existe pas ou a été déplacé.
        </p>
        <p className="text-[10px] font-mono bg-white p-2 text-slate-500 truncate max-w-full border border-slate-200 rounded">
          {url.split('/').pop() || 'document.pdf'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden group">
      {/* ✅ Iframe pour afficher le PDF */}
      <iframe
        src={`${url}#view=FitH&toolbar=0&navpanes=0`}
        className="w-full h-full border-0"
        title="PDF Preview"
        onError={() => setLoadError(true)}
      />
      
      {/* ✅ Overlay avec bouton voir si erreur */}
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
          <FileWarning size={32} className="text-amber-500 mb-2" />
          <p className="text-xs text-slate-600 mb-3">Aperçu non disponible</p>
          <a
            href={url}
            target="_blank"
            className="px-4 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ouvrir le PDF
          </a>
        </div>
      )}

      {/* ✅ Bouton téléchargement flottant */}
      <a
        href={url}
        download
        className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
        title="Télécharger"
      >
        <Download size={14} />
      </a>
    </div>
  );
}