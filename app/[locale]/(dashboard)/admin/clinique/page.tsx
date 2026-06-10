import React from "react";
import { 
  Scale, 
  History,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { getClinicalCases, getClinicalAuditLogs } from "./actions";
import ClinicalTable from "./ClinicalTable";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default async function CliniquePage() {
  const cases = await getClinicalCases();
  const auditLogs = await getClinicalAuditLogs();

  const stats = [
    { label: "Dossiers Totaux", value: cases.length, color: "text-indigo-600", bg: "bg-indigo-50", icon: Briefcase },
    { label: "Urgence Haute", value: cases.filter(c => c.urgency === 'HIGH' || c.urgency === 'CRITICAL').length, color: "text-red-600", bg: "bg-red-50", icon: AlertTriangle },
    { label: "Résolus", value: cases.filter(c => c.status === 'RESOLVED').length, color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 },
    { label: "Taux Succès", value: "85%", color: "text-purple-600", bg: "bg-purple-50", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8 pb-12 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Clinique Juridique
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">Direction de la protection de l'environnement et des droits humains.</p>
        </div>
        <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/25 transition-all active:scale-95 flex items-center gap-2">
          Nouveau Dossier
        </button>
      </header>

      {/* Dynamic Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4">
            <div className={cn("p-4 rounded-2xl", stat.bg)}>
               <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{stat.label}</div>
              <div className={cn("text-2xl font-black", stat.color)}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Secure Table */}
      <ClinicalTable initialCases={cases} />

      {/* Audit Logs Flux */}
      <section className="bg-slate-900 dark:bg-zinc-950 rounded-[2.5rem] p-10 text-white border-4 border-indigo-500/10 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 p-8 opacity-[0.03] pointer-events-none rotate-12">
          <Scale className="w-64 h-64" />
        </div>
        
        <div className="flex items-center justify-between mb-10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-black tracking-tight italic">Journal de Traçabilité</h2>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border border-slate-800 px-4 py-2 rounded-full">
            Real-time Monitoring
          </span>
        </div>

        <div className="space-y-3 relative z-10">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-5 bg-white/[0.03] hover:bg-white/[0.07] rounded-2xl border border-white/5 transition-all group backdrop-blur-sm">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black border border-indigo-500/20 shadow-inner">
                  {log.user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="font-black text-indigo-300 flex items-center gap-2 text-sm">
                    {log.user?.name || "Système"}
                    <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {log.action} : <span className="text-slate-200 font-bold">{log.details}</span>
                  </div>
                </div>
              </div>
              <div className="text-[9px] uppercase font-black tracking-widest text-slate-500 bg-black/40 px-4 py-2 rounded-xl group-hover:text-slate-300 transition-colors">
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          {auditLogs.length === 0 && (
            <div className="py-12 text-center text-slate-600 font-bold uppercase tracking-widest">
              Aucun log d'audit récent
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
