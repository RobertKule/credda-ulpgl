"use client";

import React from "react";
import Image from "next/image";
import { Download, PlayCircle, ExternalLink } from "lucide-react";
import { EditorialItem } from "@/types/editorial";

export default function ContentMediaRenderer({ doc }: { doc: EditorialItem }) {
  // If the document has a PDF URL, show a solid premium CTA for downloading
  if (doc.pdfUrl) {
    return (
      <a 
        href={doc.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-6 bg-card/60 backdrop-blur-md border border-border/50 rounded-md hover:border-primary/50 hover:bg-primary/5 transition-all group"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          <Download size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold font-serif mb-1 group-hover:text-primary transition-colors">Télécharger le document PDF</h4>
          <p className="text-xs text-muted-foreground font-light">{doc.title}</p>
        </div>
      </a>
    );
  }

  // If the document has a Video URL
  if (doc.videoUrl) {
    // Basic embed logic
    const isYoutube = doc.videoUrl.includes("youtube.com") || doc.videoUrl.includes("youtu.be");
    
    if (isYoutube) {
      let videoId = doc.videoUrl.split('v=')[1];
      if (!videoId) {
        videoId = doc.videoUrl.split('youtu.be/')[1];
      }
      const ampersandPosition = videoId?.indexOf('&');
      if (ampersandPosition !== -1 && videoId) {
         videoId = videoId.substring(0, ampersandPosition);
      }
      return (
        <div className="relative aspect-video rounded-md overflow-hidden bg-black/10 border border-border/50">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }

    return (
      <a 
        href={doc.videoUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-6 bg-card/60 backdrop-blur-md border border-border/50 rounded-md hover:border-primary/50 transition-all group"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          <PlayCircle size={20} />
        </div>
        <div>
          <h4 className="font-bold text-sm font-serif">Regarder la vidéo</h4>
          <p className="text-xs font-light text-muted-foreground break-all">{doc.videoUrl}</p>
        </div>
      </a>
    );
  }

  // If the document has a Gallery
  if (doc.gallery && doc.gallery.length > 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {doc.gallery.map((imgSrc, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-md border border-border/50">
             <Image src={imgSrc} alt={`${doc.title} - ${i}`} fill className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  // If the document has a Cover Image
  if (doc.coverImage) {
    return (
      <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-md overflow-hidden border border-border/50">
        <Image src={doc.coverImage} alt={doc.title} fill className="object-cover" />
      </div>
    );
  }

  return null;
}
