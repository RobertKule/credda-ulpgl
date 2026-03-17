"use client";

import dynamic from "next/dynamic";

const MobileClinicMap = dynamic(() => import("@/components/clinical/MobileClinicMap"), { 
  ssr: false,
  loading: () => <div className="h-[500px] bg-primary/5 animate-pulse flex items-center justify-center text-primary/20 font-serif italic text-xl">Initializing Registry Map...</div>
});

export default function MobileClinicMapWrapper({ locations }: { locations: any[] }) {
  return <MobileClinicMap locations={locations} />;
}
