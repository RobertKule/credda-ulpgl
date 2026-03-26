// app/[locale]/admin/profile/page.tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/admin/ProfileForm";
import { UserCircle, Shield } from "lucide-react";

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (!session || !session.user) {
    redirect(`/${locale}/login`);
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email! }
  });

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Header Exécutif */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-600/10 p-1.5 rounded-lg">
              <UserCircle size={18} className="text-blue-600" />
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Gestion de Compte
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Mon <span className="text-slate-400 font-light italic">Profil</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium italic">
            "L'intégrité de vos données est la fondation de notre sécurité institutionnelle."
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-100 shadow-sm animate-pulse-slow">
           <Shield size={16} />
           <span className="text-[10px] font-black uppercase tracking-widest">Protégé par Auth.js</span>
        </div>
      </div>

      <ProfileForm user={{
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        role: user.role
      }} />
    </div>
  );
}
