// app/[locale]/admin/publications/page.tsx
import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import PublicationManagementTable from "./PublicationManagementTable";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AdminPublicationsPage({ params }: Props) {
  const { locale } = await params;

  const publications = await db.publication.findMany({
    include: { translations: { where: { language: locale } } },
    orderBy: { year: "desc" },
  });

  return (
    <div className="space-y-10 pb-10">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-emerald-600/10 p-1.5 rounded-lg">
              <BookOpen size={18} className="text-emerald-600" />
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Digital Knowledge Library
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Scientific <span className="text-slate-400 font-light italic">Publications</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage the peer-reviewed library, clinical reports, and research archive.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest h-12 px-6 rounded-md shadow-xl transition-all">
            <Link href="/admin/publications/new" className="flex items-center gap-2">
              <Plus size={18} /> New Publication
            </Link>
          </Button>
        </div>
      </div>

      <PublicationManagementTable initialPublications={publications as any} locale={locale} />
    </div>
  );
}