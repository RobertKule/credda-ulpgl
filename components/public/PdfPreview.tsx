"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, FileWarning, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

// Configuration de PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfPreviewProps {
  url: string;
  pageNumber?: number;
}

export default function PdfPreview({ url, pageNumber = 1 }: PdfPreviewProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("❌ Erreur de chargement PDF:", error);
    setError(error.message || "Impossible de charger le PDF");
    setLoading(false);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  // ✅ GESTION DES URL INVALIDES OU MANQUANTES
  if (!url || url === "#" || url === "") {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-slate-200 rounded-full flex items-center justify-center">
            <FileText size={32} className="text-slate-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-1">
              PDF Non Disponible
            </h4>
            <p className="text-xs text-slate-500 font-light">
              Ce document n'a pas encore été téléversé.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
      
      {/* 🟢 ÉTAT DE CHARGEMENT */}
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
          <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
          <p className="text-xs font-medium text-slate-600">Chargement du PDF...</p>
        </div>
      )}

      {/* 🔴 ÉTAT D'ERREUR (404, serveur, etc.) */}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-6">
          <div className="max-w-xs text-center space-y-5">
            <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center">
              <FileWarning size={28} className="text-red-500" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                Fichier introuvable
              </h3>
              <p className="text-xs text-slate-500 font-light">
                Le PDF que vous recherchez n'est pas disponible ou a été déplacé.
              </p>
              {url.includes('localhost') && (
                <p className="text-[10px] font-mono bg-slate-100 p-2 text-slate-600 truncate mt-2">
                  {url}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full pt-2">
              <Button
                onClick={handleRetry}
                variant="outline"
                size="sm"
                className="text-xs rounded-none border-slate-300 hover:bg-slate-100"
              >
                Réessayer
              </Button>
              
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Download size={12} />
                Télécharger quand même
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* 🟦 AFFICHAGE DU PDF */
        <Document
          key={retryCount} // Force le rechargement en cas de retry
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null} // Géré manuellement
          className="relative w-full h-full flex items-center justify-center"
        >
          <Page
            pageNumber={pageNumber}
            width={300}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-lg"
          />
        </Document>
      )}

      {/* 🟡 INDICATEUR DE PAGES (si chargé) */}
      {numPages && !error && (
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 text-[8px] font-mono">
          1 / {numPages}
        </div>
      )}
    </div>
  );
}