"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix pour les icones leaflet avec Next.js
const initLeaflet = async () => {
  const L = (await import('leaflet')).default;
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/marker-icon-2x.png',
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
  });
  return L;
};

// Dynamic import of the map to avoid SSR issues
const MapComponent = dynamic(
  () => import('./MapInner'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-3xl">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }
);

export default function ContactMap() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    initLeaflet();
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full h-full relative z-0">
      <MapComponent />
      
      {/* Overlay gradient pour l'intégration design */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a1120] to-transparent pointer-events-none z-[400]" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a1120] to-transparent pointer-events-none z-[400] hidden lg:block" />
    </div>
  );
}
