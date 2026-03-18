// app/[locale]/admin/programs/[id]/edit/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { ChevronRight, Edit3 } from "lucide-react";
import { Link } from "@/navigation";

interface Props {
  params: Promise<{ id: string, locale: string }>;
}

export default async function EditProgramPage({ params }: Props) {
  const { id } = await params;
  
  const program = await db.program.findUnique({
    where: { id },
    include: { translations: true }
  });

  if (!program) notFound();

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          <Link href="/admin/programs" className="hover:text-purple-600 transition-colors">Programs</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900">Editor</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-purple-600 p-2 text-white shadow-lg shadow-purple-600/20">
             <Edit3 size={24} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Refine <span className="italic font-light text-slate-400 text-3xl">{program.slug}</span></h1>
        </div>
      </div>

      <ProgramForm initialData={program} isEditing={true} />
    </div>
  );
}
