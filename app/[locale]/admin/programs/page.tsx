// app/[locale]/admin/programs/page.tsx
import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Layout } from "lucide-react";
import ProgramManagementTable from "./ProgramManagementTable";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AdminProgramsPage({ params }: Props) {
  const { locale } = await params;

  const programs = await db.program.findMany({
    include: { translations: { where: { language: locale } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-purple-600/10 p-1.5 rounded-lg">
              <Layout size={18} className="text-purple-600" />
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Strategic Initiatives
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Programs <span className="text-slate-400 font-light italic">& Units</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage institutional research programs, specialized units, and flagship initiatives.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-widest h-12 px-6 rounded-md shadow-xl transition-all">
            <Link href="/admin/programs/new" className="flex items-center gap-2">
              <Plus size={18} /> New Program
            </Link>
          </Button>
        </div>
      </div>

      <ProgramManagementTable initialPrograms={programs as any} locale={locale} />
    </div>
  );
}
