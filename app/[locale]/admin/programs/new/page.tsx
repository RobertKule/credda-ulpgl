// app/[locale]/admin/programs/new/page.tsx
import { ProgramForm } from "@/components/admin/ProgramForm";
import { ChevronRight, Activity } from "lucide-react";
import { Link } from "@/navigation";

export default function NewProgramPage() {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          <Link href="/admin/programs" className="hover:text-purple-600 transition-colors">Programs</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900">Creation</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-purple-600 p-2 text-white shadow-lg shadow-purple-600/20">
             <Activity size={24} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Configure <span className="italic font-light text-slate-400 text-3xl">New Strategic Unit</span></h1>
        </div>
      </div>

      <ProgramForm />
    </div>
  );
}
