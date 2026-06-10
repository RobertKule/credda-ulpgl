import React from "react";

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
            <div className="h-8 w-64 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
          </div>
          <div className="h-4 w-96 bg-slate-100 dark:bg-zinc-900 rounded-lg" />
        </div>
        <div className="h-12 w-48 bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
      </header>

      {/* Stats Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4">
            <div className="p-4 w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-3 w-20 bg-slate-100 dark:bg-zinc-800 rounded" />
              <div className="h-6 w-12 bg-slate-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
           <div className="h-5 w-32 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
           <div className="h-5 w-8 bg-slate-100 dark:bg-zinc-800 rounded-lg" />
        </div>
        <div className="p-8 space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
                  <div className="h-3 w-1/4 bg-slate-100 dark:bg-zinc-900 rounded-lg" />
                </div>
              </div>
              <div className="h-4 w-24 bg-slate-100 dark:bg-zinc-800 rounded-full" />
              <div className="h-4 w-32 bg-slate-100 dark:bg-zinc-800 rounded-full hidden md:block" />
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Skeleton */}
      <div className="bg-slate-900 dark:bg-zinc-950 rounded-[2.5rem] p-10 space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-xl w-10 h-10" />
          <div className="h-6 w-48 bg-white/10 rounded-xl" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
             <div key={i} className="flex items-center justify-between p-5 bg-white/[0.03] rounded-2xl border border-white/5">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-white/5" />
                   <div className="space-y-2">
                      <div className="h-4 w-32 bg-white/10 rounded-lg" />
                      <div className="h-3 w-64 bg-white/5 rounded-lg" />
                   </div>
                </div>
                <div className="h-6 w-16 bg-white/5 rounded-xl" />
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
