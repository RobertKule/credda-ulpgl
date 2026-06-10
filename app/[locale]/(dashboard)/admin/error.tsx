"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home, ShieldAlert } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // On pourrait logguer l'erreur vers un service type Sentry ici
    console.error("[DASHBOARD_ERROR_BOUNDARY]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] border-4 border-red-500/10 p-10 shadow-2xl text-center space-y-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-12 -right-12 opacity-[0.03] pointer-events-none rotate-12">
          <ShieldAlert className="w-48 h-48 text-red-500" />
        </div>

        <div className="relative">
          <div className="mx-auto w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-3xl flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-zinc-900 p-1.5 rounded-full shadow-lg">
             <div className="bg-red-600 w-3 h-3 rounded-full" />
          </div>
        </div>

        <div className="space-y-3 relative">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
            Oups ! Rupture de Connexion
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">
            Une erreur inattendue est survenue lors de la communication avec la base de données ou les services de sécurité.
          </p>
          {error.digest && (
             <div className="mt-4 p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg font-mono text-[10px] text-slate-400 uppercase tracking-widest leading-none">
                Error ID: {error.digest}
             </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 relative">
          <button
            onClick={() => reset()}
            className="group flex items-center justify-center gap-3 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/25 transition-all active:scale-95"
          >
            <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
            Réessayer maintenant
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center gap-3 w-full py-4 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              CREDDA-ULPGL Infrastructure Status: <span className="text-amber-500">Degraded</span>
           </p>
        </div>
      </div>
    </div>
  );
}
