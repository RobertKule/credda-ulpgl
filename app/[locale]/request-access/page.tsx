"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { RequestAccessForm } from "@/components/auth/RequestAccessForm";

const AfricaGlobe = dynamic(() => import("@/components/home/AfricaGlobe"), {
  ssr: false,
  loading: () => null,
});

export default function RequestAccessPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { 
    setMounted(true); 
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-outfit transition-colors duration-700
      bg-background"
    >
      
      {/* Integrated Globe Background */}
      <div className="absolute top-12 -right-[20%] md:-right-[10%] lg:-right-[5%] z-0 opacity-80 dark:opacity-25 pointer-events-none w-[1000px] h-[1000px] md:w-[1200px] md:h-[1200px]">
         <AfricaGlobe />
      </div>

      {/* Form Overlay Area */}
      <div className="relative z-10 w-full px-4 sm:px-6 py-12 flex justify-center mt-12 sm:mt-0">
        <RequestAccessForm />
      </div>
      
    </div>
  );
}
