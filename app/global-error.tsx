'use client';

import { useEffect } from 'react';
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log fatal errors using the new Pino logger
    logger.error({ 
      err: error, 
      digest: error.digest,
      msg: 'Fatal global error caught in global-error.tsx' 
    });
  }, [error]);

  return (
    <html>
      <body className="bg-slate-900 text-white font-sans antialiased h-screen w-screen flex items-center justify-center">
        <div className="max-w-xl w-full p-8 text-center space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Erreur Critique Système</h1>
          <p className="text-slate-400 text-sm">
            Une erreur fondamentale s'est produite lors du rendu de l'application. 
            Le support technique a été notifié (ID: {error.digest || 'Inconnu'}).
          </p>
          <button 
            onClick={() => reset()}
            className="px-6 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-slate-200 transition-colors"
          >
            Tenter une récupération
          </button>
        </div>
      </body>
    </html>
  );
}
