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
    <div className="space-y-10 pb-20 bg-background transition-colors min-h-screen">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">
          <Link href="/admin/clinical" className="hover:text-primary transition-colors">Clinical Cases</Link>
          <ChevronRight size={12} />
          <span className="text-foreground transition-colors">Edition</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="bg-primary p-3 text-primary-foreground shadow-2xl shadow-primary/20 rounded-xl">
             <Edit3 size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-serif font-black text-foreground tracking-tight transition-colors">
              Refine <span className="text-primary italic font-light">Case</span>
              <span className="ml-3 italic font-light text-muted-foreground/30 text-3xl">#{caseItem.id.substring(0,8)}</span>
            </h1>
            <p className="text-muted-foreground/60 text-xs font-medium mt-1">Update clinical data and beneficiary information.</p>
          </div>
        </div>
      </div>

      <ClinicalCaseForm initialData={caseItem} isEditing={true} />
    </div>
  );
}
