// components/skeletons/LoginSkeleton.tsx
"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginSkeleton() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* PARTIE GAUCHE - SKELETON */}
      <div className="hidden md:flex md:w-1/2 bg-[#050a15] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full border border-blue-500/30" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[300px] h-[300px] rounded-full border border-blue-500/20" />
        </div>

        <div className="relative z-10 max-w-md text-center md:text-left space-y-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Badge Skeleton */}
            <Skeleton className="h-6 w-32 bg-white/10 rounded-none mx-auto md:mx-0" />
            
            {/* Titre Skeleton */}
            <Skeleton className="h-16 w-full bg-white/10 rounded-none" />
            <Skeleton className="h-16 w-3/4 bg-white/10 rounded-none" />
            
            {/* Ligne décorative Skeleton */}
            <Skeleton className="h-1 w-20 bg-white/10 rounded-none hidden md:block" />
          </motion.div>

          {/* Description Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-white/10 rounded-none" />
            <Skeleton className="h-4 w-5/6 bg-white/10 rounded-none" />
            <Skeleton className="h-4 w-4/6 bg-white/10 rounded-none" />
          </div>

          {/* Footer Skeleton */}
          <div className="pt-8 flex items-center gap-4">
            <Skeleton className="h-8 w-8 bg-white/10 rounded-none" />
            <Skeleton className="h-4 w-48 bg-white/10 rounded-none" />
          </div>
        </div>
      </div>

      {/* PARTIE DROITE - SKELETON FORMULAIRE */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-slate-50">
        <div className="w-full max-w-sm space-y-10">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-24 bg-slate-200 rounded-none" />
            <Skeleton className="h-8 w-40 bg-slate-200 rounded-none" />
          </div>

          {/* Titre Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-slate-200 rounded-none" />
            <Skeleton className="h-4 w-64 bg-slate-200 rounded-none" />
          </div>

          {/* Formulaire Skeleton */}
          <div className="space-y-5">
            {/* Champ Email Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-12 w-full bg-slate-200 rounded-none" />
            </div>

            {/* Champ Password Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-12 w-full bg-slate-200 rounded-none" />
            </div>

            {/* Bouton Skeleton */}
            <Skeleton className="h-14 w-full bg-slate-200 rounded-none" />
          </div>
        </div>
      </div>
    </div>
  );
}