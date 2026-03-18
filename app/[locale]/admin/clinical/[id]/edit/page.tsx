// app/[locale]/admin/clinical/[id]/edit/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ClinicalCaseForm } from "@/components/admin/ClinicalCaseForm";
import { ChevronRight, Edit3 } from "lucide-react";
import { Link } from "@/navigation";

interface Props {
  params: Promise<{ id: string, locale: string }>;
}

export default async function EditClinicalCasePage({ params }: Props) {
  const { id } = await params;
  
  const caseItem = await db.clinicalCase.findUnique({
    where: { id },
    include: { beneficiary: true }
  });

  if (!caseItem) notFound();

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          <Link href="/admin/clinical" className="hover:text-emerald-700 transition-colors">Clinical Cases</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900">Edition</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-emerald-800 p-2 text-white shadow-lg shadow-emerald-800/20">
             <Edit3 size={24} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Refine Case <span className="italic font-light text-slate-400 text-3xl">#{caseItem.id.substring(0,8)}</span></h1>
        </div>
      </div>

      <ClinicalCaseForm initialData={caseItem} isEditing={true} />
    </div>
  );
}
