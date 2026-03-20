// app/[locale]/admin/clinical/new/page.tsx
import { ClinicalCaseForm } from "@/components/admin/ClinicalCaseForm";
import { ChevronRight, PlusCircle } from "lucide-react";
import { Link } from "@/navigation";

export default function NewClinicalCasePage() {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          <Link href="/admin/clinical" className="hover:text-emerald-700 transition-colors">Clinical Cases</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900">New Entry</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-emerald-800 p-2 text-white shadow-lg shadow-emerald-800/20">
             <PlusCircle size={24} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Register <span className="italic font-light text-slate-400 text-3xl">New Clinical Case</span></h1>
        </div>
      </div>

      <ClinicalCaseForm />
    </div>
  );
}
