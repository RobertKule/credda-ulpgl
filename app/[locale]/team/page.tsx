// app/[locale]/team/page.tsx
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import {
  Mail, Linkedin, Users, GraduationCap,
  SearchX, Globe, ChevronRight
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function TeamPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TeamPage' });

  const members = await db.member.findMany({
    include: {
      translations: { where: { language: locale } }
    },
    orderBy: { order: "asc" }
  });

  return (
    <main className="min-h-screen bg-white">
      {/* --- HEADER --- */}
      <header className="bg-[#050a15] text-white py-24 border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl space-y-6">
            <Badge className="bg-blue-600 rounded-none px-4 py-1 uppercase tracking-[0.2em] text-[10px] font-bold">
              {t('header.badge')}
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold italic leading-tight">
              <span dangerouslySetInnerHTML={{ __html: t.raw('header.title') }} />
            </h1>
            <p className="text-xl text-slate-400 font-light leading-relaxed">
              {t('header.description')}
            </p>
          </div>
        </div>
      </header>

      {/* --- GRID ÉQUIPE --- */}
      <section className="container mx-auto px-6 py-24">
        {members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {members.map((member) => {
              const content = member.translations[0];
              if (!content) return null;

              return (
                <div key={member.id} className="group space-y-6">
                  {/* Photo de profil : Grayscale to Color */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 border border-slate-100">
                    {member.image ? (
                      <Image
                        src={member.image.replace(/\\/g, '/').replace(/^public\//, '/')}
                        alt={content.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200">
                        <Users size={80} strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-blue-900/5 group-hover:bg-transparent transition-colors" />
                  </div>

                  {/* Infos */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
                        {content.name}
                      </h2>
                      <p className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em]">
                        {content.role}
                      </p>
                    </div>

                    <div className="h-px w-12 bg-blue-600 transition-all group-hover:w-full duration-500" />

                    {content.bio && (
                      <p className="text-slate-500 text-sm font-light leading-relaxed line-clamp-3">
                        {content.bio}
                      </p>
                    )}

                    {/* Social links */}
                    <div className="flex gap-4 pt-2">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 border border-slate-100 text-slate-400 hover:text-blue-600 transition-all group"
                          title={t('contact.email')}
                        >
                          <Mail size={16} />
                        </a>
                      )}
                      <a
                        href="#"
                        className="p-2 border border-slate-100 text-slate-400 hover:text-blue-600 transition-all group"
                        title={t('contact.linkedin')}
                      >
                        <Linkedin size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center max-w-2xl mx-auto">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full" />
              <SearchX size={80} className="mx-auto text-slate-300 relative z-10" strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">
              {t('empty.title')}
            </h3>
            <p className="text-slate-500 font-light text-lg">
              {t('empty.description')}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}