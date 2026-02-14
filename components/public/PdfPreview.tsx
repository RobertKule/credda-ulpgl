// components/public/PdfPreview.tsx - VERSION AVEC VÉRIFICATION D'EXISTENCE
"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, FileWarning, Download, FileText, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Configuration du worker PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfPreviewProps {
  url: string;
  pageNumber?: number;
}

export default function PdfPreview({ url, pageNumber = 1 }: PdfPreviewProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileExists, setFileExists] = useState<boolean | null>(null);
  const [checkingFile, setCheckingFile] = useState(true);

  // ✅ Vérifier si le fichier existe avant de tenter de le charger
  useEffect(() => {
    async function checkFileExists() {
      if (!url || url === "#" || url === "") {
        setFileExists(false);
        setCheckingFile(false);
        return;
      }

      try {
        // Effectuer une requête HEAD pour vérifier l'existence sans télécharger le fichier
        const response = await fetch(url, { method: 'HEAD' });
        setFileExists(response.ok);
      } catch (err) {
        console.error("❌ Erreur lors de la vérification du fichier:", err);
        setFileExists(false);
      } finally {
        setCheckingFile(false);
      }
    }

    checkFileExists();
  }, [url]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("❌ Erreur PDF:", error);
    setError("Impossible de charger l'aperçu");
    setLoading(false);
  };

  // ✅ État de vérification du fichier
  if (checkingFile) {
    return (
      <div className="relative w-full h-full bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={24} />
      </div>
    );
  }

  // ✅ Fichier non trouvé (404)
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

  // ✅ URL invalide
  if (!url || url === "#" || url === "") {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-3">
          <FileText size={28} className="text-slate-400" />
        </div>
        <p className="text-xs font-medium text-slate-600">PDF non disponible</p>
        <p className="text-[10px] text-slate-400 mt-1">Document non téléversé</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-slate-50 overflow-hidden">
      {/* ✅ Indicateur de chargement */}
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
          <Loader2 className="animate-spin text-blue-600 mb-2" size={24} />
          <p className="text-xs text-slate-500">Chargement du PDF...</p>
        </div>
      )}

      {/* ✅ État d'erreur de chargement */}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <FileWarning size={28} className="text-amber-500 mb-2" />
          <p className="text-xs text-slate-600 text-center mb-3">{error}</p>
          <div className="flex gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded hover:bg-blue-700 transition-colors"
            >
              Voir l'original
            </a>
            <a
              href={url}
              download
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-700 text-white text-[10px] font-bold uppercase tracking-wider rounded hover:bg-slate-800 transition-colors"
            >
              <Download size={10} />
              Télécharger
            </a>
          </div>
        </div>
      ) : (
        /* ✅ Affichage du PDF */
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className="flex items-center justify-center w-full h-full"
        >
          <Page
            pageNumber={pageNumber}
            width={220}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-md"
          />
        </Document>
      )}

      {/* ✅ Indicateur de nombre de pages */}
      {numPages && !error && (
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 text-[8px] font-mono rounded">
          1 / {numPages}
        </div>
      )}
    </div>
  );
}