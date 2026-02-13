import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCircle, Mail, GripVertical, Edit } from "lucide-react";
import Image from "next/image";
import DeleteButton from "@/components/admin/DeleteButton";

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Corps de Recherche</h1>
          <p className="text-slate-500 text-sm">Gérez les membres de la direction et les chercheurs associés.</p>
        </div>
        <Button asChild className="bg-slate-900 hover:bg-blue-600 rounded-none">
          <Link href="/admin/members/new" className="flex items-center gap-2">
            <UserPlus size={18} /> Ajouter un membre
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {members.map((m) => (
          <div key={m.id} className="bg-white border border-slate-200 p-4 flex items-center justify-between group hover:border-blue-200 transition-all shadow-sm">
            <div className="flex items-center gap-6">
              <div className="text-slate-300">
                <GripVertical size={20} />
              </div>
              <div className="relative w-14 h-14 bg-slate-100 overflow-hidden border border-slate-100">
                {m.image ? (
                  <Image src={m.image} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <UserCircle size={30} />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{m.translations[0]?.name}</h3>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
                  {m.translations[0]?.role}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                  <Mail size={10} /> {m.email || "Non renseigné"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-900" asChild>
  <Link href={`/admin/members/edit/${m.id}`}>
    <Edit size={18} />
  </Link>
</Button>
              <DeleteButton id={m.id} type="member" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}