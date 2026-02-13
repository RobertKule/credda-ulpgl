"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, FileText } from 'lucide-react';
import dynamic from 'next/dynamic';

// --- ÉTAPE A : On importe les composants PDF de manière dynamique (Client Only) ---
const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
);

export default function PdfPreview({ url }: { url: string }) {
  const [isClient, setIsClient] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);

  // --- ÉTAPE B : On attend que le composant soit monté sur le client ---
  useEffect(() => {
    setIsClient(true);
    // On configure le worker uniquement côté client
    const configureWorker = async () => {
      const pdfjs = await import('react-pdf').then(mod => mod.pdfjs);
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    };
    configureWorker();
  }, []);

  if (!isClient) {
    return <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="relative w-full h-full bg-white flex items-center justify-center overflow-hidden">
      <Document
        file={url}
        onLoadError={(error) => console.error("Erreur PDF:", error)}
        loading={<Loader2 className="animate-spin text-blue-600" />}
        error={
          <div className="flex flex-col items-center gap-2 opacity-20">
            <FileText size={48} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-center">Aperçu indisponible</span>
          </div>
        }
      >
        <Page 
          pageNumber={1} 
          width={220} // Largeur fixe pour la card
          renderTextLayer={false} 
          renderAnnotationLayer={false}
          className="shadow-2xl"
        />
      </Document>
      
      {/* Overlay pour donner un aspect "Papier" */}
      <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.03)] pointer-events-none" />
    </div>
  );
}