// app/[locale]/admin/profile/page.tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/admin/ProfileForm";
import { UserCircle, Shield } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  const t = await getTranslations("AdminProfile");

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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-border pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <UserCircle size={18} className="text-primary" />
            </div>
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
              {t('header.badge')}
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight"
              dangerouslySetInnerHTML={{ __html: t('header.title').replace('<italic>', '<span class="text-muted-foreground font-light italic">').replace('</italic>', '</span>') }} 
          />
          <p className="text-sm text-muted-foreground font-medium italic">
            {t('header.subtitle')}
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-md border border-emerald-500/20 shadow-sm animate-pulse-slow">
           <Shield size={16} />
           <span className="text-[10px] font-black uppercase tracking-widest">{t('header.protected')}</span>
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
