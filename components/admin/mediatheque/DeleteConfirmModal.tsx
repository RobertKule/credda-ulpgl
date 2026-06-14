"use client";

import React from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import type { MediaItem } from "@/lib/mediatheque/types";

interface DeleteConfirmModalProps {
  media: MediaItem | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  media,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {media && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-md bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center shrink-0">
                <Trash2 size={22} />
              </div>
              <div className="space-y-2 pr-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Supprimer ce média ?
                </h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">
                    &ldquo;{media.title}&rdquo;
                  </span>{" "}
                  sera définitivement retiré de la médiathèque. Cette action est irréversible.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Suppression…" : "Supprimer"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
