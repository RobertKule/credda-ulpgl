"use client";

import VisionBento from "./VisionBento";
import VisionDescription from "./VisionDescription";

const SECTION_PAD = "max-w-7xl mx-auto px-6 lg:px-8";

export default function VisionSection() {
  return (
    <section className="relative py-24 lg:py-32 w-full overflow-hidden transition-colors duration-500 bg-background border-y border-border">
      
      {/* Background Pattern - Adaptive */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] text-foreground" 
           style={{ 
             backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
             backgroundSize: '40px 40px',
           }} 
      />
      
      {/* Accent de lumière en mode sombre - Institutional Green */}
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none hidden dark:block" />
      
      <div className={SECTION_PAD}>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
          
          {/* GAUCHE: BENTO GRID (Prend 55% de l'espace sur desktop) */}
          <div className="w-full lg:w-[55%] order-2 lg:order-1">
            <div className="relative group">
               {/* Effet de lueur derrière le bento */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <VisionBento />
            </div>
          </div>

          {/* DROITE: DESCRIPTION (Prend 45% de l'espace) */}
          <div className="w-full lg:w-[45%] order-1 lg:order-2 text-center lg:text-left">
            <VisionDescription />
          </div>

        </div>
      </div>
    </section>
  );
}