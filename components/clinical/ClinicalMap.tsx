"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-slate-50 flex items-center justify-center border border-slate-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-md animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Geographic Data...</p>
      </div>
    </div>
  ),
});

interface Session {
  id: string;
  title: string;
  location: string;
  date: Date | string;
  lat: number | null;
  lng: number | null;
  isMobile: boolean;
}

export default function ClinicalMap({ sessions }: { sessions: Session[] }) {
  return <MapComponent sessions={sessions} />;
}
