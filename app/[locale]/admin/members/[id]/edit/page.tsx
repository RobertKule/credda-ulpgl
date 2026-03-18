// app/[locale]/admin/members/[id]/edit/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { MemberForm } from "@/components/admin/MemberForm";
import { ChevronRight, UserCircle2 } from "lucide-react";
import { Link } from "@/navigation";

interface Props {
  params: Promise<{ id: string, locale: string }>;
}

export default async function EditMemberPage({ params }: Props) {
  const { id, locale } = await params;
  
  const member = await db.member.findUnique({
    where: { id },
    include: { translations: true }
  });

  if (!member) notFound();

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          <Link href="/admin/members" className="hover:text-blue-600 transition-colors">Team Members</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900">Profile Editor</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 text-white shadow-lg shadow-blue-600/20">
             <UserCircle2 size={24} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">
            Refine Profile <span className="italic font-light text-slate-400 text-3xl">for {member.translations.find(t => t.language === 'fr')?.name || member.id}</span>
          </h1>
        </div>
      </div>

      <MemberForm initialData={member} locale={locale} />
    </div>
  );
}
