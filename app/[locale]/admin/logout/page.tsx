"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  const { locale } = useParams<{ locale: string }>();

  useEffect(() => {
    signOut({ callbackUrl: `/${locale}/login` });
  }, [locale]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-md animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
        Sécurisation de la sortie...
      </p>
    </div>
  );
}
