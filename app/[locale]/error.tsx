'use client';

import { useEffect } from 'react';
import { Link } from '@/navigation';
import { AlertTriangle, RefreshCcw, Home, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Production Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-2xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-card/50 backdrop-blur-2xl border border-border p-8 md:p-12 rounded-[2rem] overflow-hidden"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <AlertTriangle size={300} strokeWidth={1} />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
              <AlertTriangle className="text-primary" size={32} />
            </div>

            <h1 className="text-4xl md:text-5xl font-fraunces font-black tracking-tighter text-foreground mb-6">
              Something went <span className="text-primary italic font-light">unexpected</span>.
            </h1>
            
            <p className="text-muted-foreground text-lg font-outfit font-light mb-12 max-w-md leading-relaxed">
              We encountered a technical issue while processing this page. Our team has been notified.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => reset()}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all rounded-xl shadow-xl shadow-primary/20"
              >
                <RefreshCcw size={16} />
                Try again
              </button>
              
              <Link
                href="/"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-widest hover:bg-secondary/80 transition-all rounded-xl"
              >
                <Home size={16} />
                Back Home
              </Link>
            </div>

            <div className="mt-16 pt-8 border-t border-border/50 flex items-center justify-between text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/40">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Error Reported
              </div>
              <div className="font-mono">
                {error.digest ? `ID: ${error.digest}` : 'System Error'}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/30 font-bold">
            CREDDA-ULPGL Operational System
          </p>
        </motion.div>
      </div>
    </div>
  );
}
