import { 
  Users, FileText, BookOpen, Plus, ArrowUpRight, 
  ChevronRight, Database, 
  MessageSquare, Newspaper, Globe, Microscope, Scale
} from "lucide-react";

import { Link } from "@/navigation";
import { db } from "@/lib/db";
import { safeQuery } from "@/lib/db-safe";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import DashboardCharts from "@/components/admin/DashboardCharts";

export const metadata: Metadata = {
  title: "Tableau de Bord | CREDDA Administration",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminDashboard' });

  // --- RÉCUPÉRATION DES DONNÉES RÉELLES (AVEC FALLBACK) ---
  const [
    dbTotalArticles,
    dbTotalPublications,
    dbTotalMembers,
    dbTotalUsers,
    dbRecentArticles,
    dbUnreadMessages,
    dbPublishedArticles,
    dbLatestMessages
  ] = await Promise.all([
    safeQuery(() => db.article.count(), 0, "admin:countArticles"),
    safeQuery(() => db.publication.count(), 0, "admin:countPublications"),
    safeQuery(() => db.member.count(), 0, "admin:countMembers"),
    safeQuery(() => db.user.count(), 0, "admin:countUsers"),
    safeQuery(
      () =>
        db.article.findMany({
          take: 4,
          orderBy: { updatedAt: "desc" },
          include: {
            translations: { where: { language: locale } },
            category: { include: { translations: { where: { language: locale } } } }
          }
        }),
      [],
      "admin:recentArticles"
    ),
    safeQuery(
      () => db.contactMessage.count({ where: { status: "UNREAD" } }),
      0,
      "admin:unreadMessages"
    ),
    safeQuery(() => db.article.count({ where: { published: true } }), 0, "admin:publishedArticles"),
    safeQuery(
      () =>
        db.contactMessage.findMany({
          take: 3,
          orderBy: { createdAt: "desc" }
        }),
      [],
      "admin:latestMessages"
    )
  ]);

  const stats = [
    { 
      label: t('stats.articles.label'), 
      value: dbTotalArticles, 
      sub: t('stats.articles.sub', { count: dbPublishedArticles }),
      icon: <FileText size={22} />, 
      href: "/admin/articles",
      textColor: "text-blue-600"
    },
    { 
      label: t('stats.publications.label'), 
      value: dbTotalPublications, 
      sub: t('stats.publications.sub'),
      icon: <BookOpen size={22} />, 
      href: "/admin/publications",
      textColor: "text-emerald-600"
    },
    { 
      label: t('stats.members.label'), 
      value: dbTotalMembers, 
      sub: t('stats.members.sub'),
      icon: <Users size={22} />, 
      href: "/admin/members",
      textColor: "text-slate-900"
    },
    { 
      label: t('stats.messages.label'), 
      value: dbUnreadMessages, 
      sub: t('stats.messages.sub'),
      icon: <MessageSquare size={22} />, 
      href: "/admin/messages",
      textColor: dbUnreadMessages > 0 ? "text-amber-600" : "text-slate-600"
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      
      {/* ========== 1. HEADER EXÉCUTIF ========== */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.3em]">
              {t('overview.badge')}
            </span>
          </div>
          <h1 className="text-5xl font-serif font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
            {t.rich('overview.title', {
              italic: (chunks) => <span className="text-blue-600 dark:text-blue-500 italic font-light">{chunks}</span>
            })}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {t('overview.subtitle', { locale: locale.toUpperCase(), date: new Date().toLocaleDateString(locale, { dateStyle: 'full' }) })}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-6 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm rounded-none">
              <Globe size={16} /> {t('overview.viewSite')}
            </button>
          </Link>
          <Link href="/admin/articles/new">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-600/20 rounded-none">
              <Plus size={18} /> {t('overview.newContent')}
            </button>
          </Link>
        </div>
      </div>

      {/* ========== 2. CARTES DE STATISTIQUES (BENTO STYLE) ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link 
            key={i} 
            href={stat.href}
            className="group relative bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-8 aspect-square rounded-[2rem] hover:border-blue-600/50 dark:hover:border-blue-500/50 hover:-translate-y-1 transition-all shadow-sm hover:shadow-2xl overflow-hidden flex flex-col justify-between"
          >
            <div className={`absolute -right-4 -top-4 w-32 h-32 bg-blue-600 opacity-[0.03] dark:opacity-[0.05] rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none`} />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className={`p-4 w-fit mb-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white border border-blue-100 dark:border-blue-900/10 transition-all duration-500 ${stat.textColor} bg-blue-50 dark:bg-blue-600/5`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-5xl font-serif font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">{stat.label}</div>
              </div>
              <div className="pt-6 mt-auto border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">{stat.sub}</span>
                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ========== 2.5 GRAPHIQUES ET ANALYTICS ========== */}
      <DashboardCharts />

      {/* ========== 3. ZONE DE TRAVAIL PRINCIPALE ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Derniers Articles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Newspaper size={20} className="text-blue-600" />
              <h2 className="text-xl font-serif font-black uppercase tracking-tight text-slate-900 dark:text-white">{t('recentContent.title')}</h2>
            </div>
            <Link href="/admin/articles" className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:tracking-[0.2em] transition-all">
              {t('recentContent.viewAll')} →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dbRecentArticles.length > 0 ? (
              dbRecentArticles.map((article: any) => (
                <div key={article.id} className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-6 rounded-3xl hover:border-blue-600/30 dark:hover:border-blue-500/30 transition-all hover:shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[8px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-1 rounded text-slate-500 dark:text-slate-400">
                        {article.category?.translations?.[0]?.title || 'Général'}
                      </span>
                      {article.published ? (
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors line-clamp-2 leading-tight mb-2">
                       {article.translations?.[0]?.title || 'Sans titre'}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-white/5">
                    <span className="text-[9px] font-bold text-slate-400">
                      {new Date(article.updatedAt).toLocaleDateString(locale)}
                    </span>
                    <Link href={`/admin/articles/${article.id}/edit`}>
                      <button className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                        <ArrowUpRight size={14} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-20 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                 <Database size={40} className="text-slate-300 dark:text-white/10 mb-4" />
                 <p className="text-slate-400 dark:text-slate-500 font-medium italic">Aucun contenu récent à afficher</p>
              </div>
            )}
          </div>
        </div>

        {/* Derniers Messages */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare size={20} className="text-blue-600" />
              <h2 className="text-xl font-serif font-black uppercase tracking-tight text-slate-900 dark:text-white">{t('recentMessages.title')}</h2>
            </div>
            <Link href="/admin/messages" className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:tracking-[0.2em] transition-all">
              {t('recentMessages.viewAll')}
            </Link>
          </div>

          <div className="space-y-4">
            {dbLatestMessages.length > 0 ? (
              dbLatestMessages.map((msg: any) => (
                <div key={msg.id} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-5 rounded-3xl hover:shadow-md transition-all group">
                   <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-500 font-bold text-xs uppercase">
                        {msg.name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black uppercase tracking-tight text-slate-900 dark:text-white truncate leading-none">{msg.name}</p>
                        <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{new Date(msg.createdAt).toLocaleDateString(locale)}</p>
                      </div>
                      {msg.status === 'UNREAD' && (
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                      )}
                   </div>
                   <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed italic mb-4">
                     "{msg.message}"
                   </p>
                   <Link href="/admin/messages">
                     <button className="w-full py-2 bg-slate-50 dark:bg-white/5 group-hover:bg-blue-600 group-hover:text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all">
                        Consulter
                     </button>
                   </Link>
                </div>
              ))
            ) : (
              <div className="py-12 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center px-6">
                 <MessageSquare size={32} className="text-slate-300 dark:text-white/10 mb-2" />
                 <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Boîte de réception vide</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}