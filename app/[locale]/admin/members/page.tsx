// app/[locale]/admin/members/page.tsx
import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import MembersList from "./MembersList";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AdminMembersPage({ params }: Props) {
  const { locale } = await params;

  const members = await db.member.findMany({
    include: { translations: { where: { language: locale } } },
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-10 pb-10">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-purple-600/10 p-1.5 rounded-lg">
              <Users size={18} className="text-purple-600" />
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Institutional Staff
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Research <span className="text-slate-400 font-light italic">Faculty</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage the board of directors, research experts, and academic contributors.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-widest h-12 px-6 rounded-none shadow-xl transition-all">
            <Link href="/admin/members/new" className="flex items-center gap-2">
              <UserPlus size={18} /> New Member
            </Link>
          </Button>
        </div>
      </div>

      <MembersList members={members as any} locale={locale} />
    </div>
  );
}