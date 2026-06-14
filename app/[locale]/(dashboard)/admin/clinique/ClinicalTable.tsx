"use client";

import React, { useState } from "react";
import { 
  FileSearch, 
  Calendar, 
  User, 
  Lock, 
  MoreHorizontal,
  Loader2,
  ExternalLink
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ClinicalTable({ initialCases }: { initialCases: any[] }) {
  const [loadingFile, setLoadingFile] = useState<string | null>(null);

  const handleOpenSecureDoc = async (caseId: string, fileKey: string) => {
    try {
      setLoadingFile(fileKey);
      window.open(fileKey, '_blank');
    } catch (error) {
      alert("Erreur lors de l'ouverture du document.");
    } finally {
      setLoadingFile(null);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans">
          <thead>
            <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30">
              <th className="px-6 py-5 text-sm font-bold text-slate-700 dark:text-zinc-300">Affaire</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-700 dark:text-zinc-300">Bénéficiaire</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-700 dark:text-zinc-300">Statut</th>
              <th className="px-6 py-5 text-right">Documents</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/50">
            {initialCases.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/30 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      item.urgency === "HIGH" || item.urgency === "CRITICAL" ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600 dark:bg-zinc-800"
                    )}>
                      <FileSearch className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{item.title}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400 font-medium">
                    <User className="w-4 h-4 text-slate-400" />
                    {item.beneficiary?.name || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    item.status === "NEW" ? "bg-indigo-100 text-indigo-700" : 
                    item.status === "ACTION_ENGAGED" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                  )}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    {item.documents?.map((doc: any) => (
                      <button
                        key={doc.id}
                        onClick={() => handleOpenSecureDoc(item.id, doc.url)}
                        disabled={loadingFile === doc.url}
                        className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg group/btn transition-all relative"
                        title="Consulter le document sécurisé"
                      >
                        {loadingFile === doc.url ? (
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                        ) : (
                          <div className="flex items-center gap-1">
                            <Lock className="w-4 h-4 text-slate-400 group-hover/btn:text-indigo-500" />
                            <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                          </div>
                        )}
                      </button>
                    ))}
                    {(!item.documents || item.documents.length === 0) && (
                      <span className="text-xs text-slate-300 italic">Aucun doc</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
