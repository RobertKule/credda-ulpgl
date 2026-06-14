"use client";
import React from "react";
import { X, Scale, User, MapPin, Calendar, FileText, MessageSquare, Clock, AlertTriangle, CheckCircle2, Gavel } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    NEW:               { label: "Nouveau",      cls: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300" },
    IN_PROGRESS:       { label: "En cours",     cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    IN_ANALYSIS:       { label: "En analyse",   cls: "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-600" },
    MEETING_SCHEDULED: { label: "Rendez-vous",  cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    ACTION_ENGAGED:    { label: "Action engagée",cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    RESOLVED:          { label: "Résolu",        cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    CLOSED:            { label: "Clôturé",       cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  };
  const s = map[status] ?? { label: status, cls: "bg-slate-100 text-slate-600" };
  return <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${s.cls}`}>{s.label}</span>;
}

function UrgencyIcon({ urgency }: { urgency: string }) {
  if (urgency === "CRITICAL" || urgency === "HIGH") return <AlertTriangle className="w-4 h-4 text-red-500" />;
  if (urgency === "MEDIUM") return <Clock className="w-4 h-4 text-amber-500" />;
  return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
}

export default function CaseDetailPanel({ item, onClose }: { item: any; onClose: () => void }) {
  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-xl bg-white dark:bg-zinc-950 z-50 flex flex-col border-l border-slate-200 dark:border-zinc-800 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between p-6 bg-slate-50 dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-800 rounded-xl">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{item.trackingCode || item.id.slice(0,8)}</p>
                  <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight line-clamp-2 max-w-xs">{item.title}</h2>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-white dark:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-white shadow-sm mt-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Urgency */}
              <div className="flex items-center gap-3 flex-wrap">
                <StatusBadge status={item.status} />
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <UrgencyIcon urgency={item.urgency} />
                  Urgence {item.urgency}
                </span>
                {item.assignedTo && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-green-800 bg-green-50 dark:bg-green-950/20 px-2.5 py-1 rounded-full">
                    <User className="w-3 h-3" /> {item.assignedTo.name}
                  </span>
                )}
              </div>

              {/* Beneficiary */}
              {item.beneficiary && (
                <div className="p-4 bg-green-50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/30 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-2">Bénéficiaire / Demandeur</p>
                  <p className="font-bold text-slate-900 dark:text-white">{item.beneficiary.name}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    {item.beneficiary.email && <span>✉ {item.beneficiary.email}</span>}
                    {item.beneficiary.phone && <span>📞 {item.beneficiary.phone}</span>}
                    {item.beneficiary.location && (
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.beneficiary.location}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Problem & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Type de problème</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{item.problemType}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" />Localisation</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{item.location}</p>
                </div>
              </div>

              {item.incidentDate && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>Incident le <strong>{new Date(item.incidentDate).toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" })}</strong></span>
                </div>
              )}

              {/* Description */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Description des faits</p>
                <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed bg-slate-50 dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">{item.description}</p>
              </div>

              {/* Actions & Expectations */}
              {item.actionsTaken && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-2 flex items-center gap-1"><Gavel className="w-3 h-3" />Actions engagées</p>
                  <p className="text-sm text-slate-700 dark:text-zinc-300 bg-green-50 dark:bg-green-950/10 p-4 rounded-2xl border border-green-100 dark:border-green-900/30">{item.actionsTaken}</p>
                </div>
              )}

              {/* Documents */}
              {item.documents?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1"><FileText className="w-3 h-3" />Pièces ({item.documents.length})</p>
                  <div className="space-y-2">
                    {item.documents.map((doc: any) => (
                      <a key={doc.id} href={doc.url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl hover:border-green-600 transition-colors group">
                        <FileText className="w-4 h-4 text-green-700 shrink-0" />
                        <span className="text-sm font-medium text-slate-700 dark:text-zinc-300 truncate group-hover:text-green-800">{doc.title || doc.url}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {item.notes?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1"><MessageSquare className="w-3 h-3" />Notes récentes</p>
                  <div className="space-y-2">
                    {item.notes.map((note: any) => (
                      <div key={note.id} className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 rounded-xl">
                        <p className="text-sm text-slate-700 dark:text-zinc-300">{note.content}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{new Date(note.createdAt).toLocaleDateString("fr-FR")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="flex gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-zinc-800">
                <span>Créé le {new Date(item.createdAt).toLocaleDateString("fr-FR")}</span>
                <span>Mis à jour le {new Date(item.updatedAt).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
