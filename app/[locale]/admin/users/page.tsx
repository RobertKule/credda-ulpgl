// // app/[locale]/admin/users/page.tsx

// import UsersPageClient from "./UsersPageClient";

// interface Props {
//   params: Promise<{ locale: string }>;
// }

// export default async function UsersPage({ params }: Props) {
//   const { locale } = await params; // ✅ obligatoire

//   return <UsersPageClient locale={locale} />;
// }
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ShieldCheck, UserPlus, Trash2, Mail, Shield } from "lucide-react";
import { Link } from "@/navigation";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold">Gestion des Accès</h1>
          <p className="text-slate-500 text-sm">Administrateurs et éditeurs autorisés sur le portail.</p>
        </div>
        <Button asChild className="bg-slate-900 rounded-none px-6">
          <Link href="/admin/users/new" className="flex items-center gap-2">
            <UserPlus size={18} /> Nouveau Compte
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {users.map((u) => (
          <div key={u.id} className="bg-white border border-slate-200 p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6">
              <div className={`p-3 rounded-none ${u.role === 'ADMIN' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  {u.name} 
                  {u.role === 'ADMIN' && <Badge className="bg-blue-600 text-[8px]">ROOT</Badge>}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Mail size={12} /> {u.email}</span>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Inscrit le {u.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <DeleteButton id={u.id} type="member" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({ children, className }: any) {
  return <span className={`px-2 py-0.5 rounded text-white font-bold ${className}`}>{children}</span>
}