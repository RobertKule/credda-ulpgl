"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function LoadingModal() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Traitement en cours...");

  useEffect(() => {
    const handleShow = (e: any) => {
      setLoading(true);
      if (e.detail?.message) setMessage(e.detail.message);
    };
    const handleHide = () => setLoading(false);

    window.addEventListener("show-loading", handleShow);
    window.addEventListener("hide-loading", handleHide);

    return () => {
      window.removeEventListener("show-loading", handleShow);
      window.removeEventListener("hide-loading", handleHide);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl border border-white/10 flex flex-col items-center space-y-6 max-w-sm w-full mx-4 text-center"
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-600/20 rounded-md" />
              <Loader2 className="w-20 h-20 text-primary animate-spin absolute top-0 left-0" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                Opération Sécurisée
              </h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">
                {message}
              </p>
            </div>

            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
               <motion.div 
                 initial={{ x: "-100%" }}
                 animate={{ x: "100%" }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                 className="w-1/2 h-full bg-primary"
               />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper functions for easy use
export const showLoading = (message?: string) => {
  window.dispatchEvent(new CustomEvent("show-loading", { detail: { message } }));
};

export const hideLoading = () => {
  window.dispatchEvent(new CustomEvent("hide-loading"));
};
