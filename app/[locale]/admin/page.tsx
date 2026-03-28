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
  title: "Admin | CREDDA",
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
    dbLatestMessages,
    dbMonthlyGrowth,
    dbTotalGallery
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
    safeQuery(() => db.contactMessage.count({ where: { status: "UNREAD" } }), 0, "admin:unreadMessages"),
    safeQuery(() => db.article.count({ where: { published: true } }), 0, "admin:publishedArticles"),
    safeQuery(
      () => db.contactMessage.findMany({
        take: 3,
        orderBy: { createdAt: "desc" }
      }),
      [],
      "admin:latestMessages"
    ),
    // Monthly growth (Last 7 months) - Split by Domain
    safeQuery(
      async () => {
        const monthPromises = Array.from({ length: 7 }, (_, i) => {
          const index = 6 - i;
          const d = new Date();
          d.setMonth(d.getMonth() - index);
          const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
          const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
          
          return (async () => {
             const [research, clinical] = await Promise.all([
               db.article.count({ where: { domain: 'RESEARCH', createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
               db.article.count({ where: { domain: 'CLINICAL', createdAt: { gte: startOfMonth, lte: endOfMonth } } })
             ]);
             return {
               name: d.toLocaleDateString(locale, { month: 'short' }),
               research,
               clinical
             };
          })();
        });
        
        return await Promise.all(monthPromises);
      },
      [],
      "admin:monthlyGrowth"
    ),
    safeQuery(() => db.galleryImage.count(), 0, "admin:countGallery")
  ]);

  const pieData = [
    { name: "Articles", value: dbTotalArticles, color: "#C9A84C" },
    { name: "Publications", value: dbTotalPublications, color: "#2563eb" },
    { name: "Membres", value: dbTotalMembers, color: "#10b981" },
    { name: "Média", value: dbTotalGallery, color: "#6366f1" },
  ];

  const stats = [
    { 
      label: t('stats.articles.label'), 
      value: dbTotalArticles, 
      sub: t('stats.articles.sub', { count: dbPublishedArticles }),
      icon: <FileText size={22} />, 
      href: "/admin/articles",
      textColor: "text-[#C9A84C]"
    },
    { 
      label: t('stats.publications.label'), 
      value: dbTotalPublications, 
      sub: t('stats.publications.sub'),
      icon: <BookOpen size={22} />, 
      href: "/admin/articles?type=PUBLICATION", // Consolidated
      textColor: "text-blue-600"
    },
    { 
      label: t('stats.members.label'), 
      value: dbTotalMembers, 
      sub: t('stats.members.sub'),
      icon: <Users size={22} />, 
      href: "/admin/members",
      textColor: "text-emerald-600"
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-border pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-primary shadow-[0_0_8px_var(--primary)]" />
            <span className="text-[10px] text-primary dark:text-gold-light font-black uppercase tracking-[0.3em]">
              {t('overview.badge')}
            </span>
          </div>
          <h1 className="text-5xl font-serif font-black text-foreground tracking-tighter uppercase leading-none">
            {t.rich('overview.title', {
              italic: (chunks) => <span className="text-primary dark:text-gold-light italic font-light">{chunks}</span>
            })}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            {t('overview.subtitle', { locale: locale.toUpperCase(), date: new Date().toLocaleDateString(locale, { dateStyle: 'full' }) })}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-6 py-4 bg-card border border-border text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all shadow-sm rounded-md">
              <Globe size={16} /> {t('overview.viewSite')}
            </button>
          </Link>
          <Link href="/admin/articles/new">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 rounded-md">
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
            className="group relative bg-card border border-border p-8 aspect-square rounded-[2rem] hover:border-primary/50 hover:-translate-y-1 transition-all shadow-sm hover:shadow-2xl overflow-hidden flex flex-col justify-between"
          >
            <div className={`absolute -right-4 -top-4 w-32 h-32 bg-primary opacity-[0.03] dark:opacity-[0.05] rounded-md group-hover:scale-150 transition-transform duration-700 pointer-events-none`} />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className={`p-4 w-fit mb-4 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground border border-border transition-all duration-500 ${stat.textColor} bg-primary/5`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-5xl font-serif font-black text-foreground tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">{stat.label}</div>
              </div>
              <div className="pt-6 mt-auto border-t border-border flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground/60">{stat.sub}</span>
                <ArrowUpRight size={14} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ========== 2.5 GRAPHIQUES ET ANALYTICS ========== */}
      <DashboardCharts areaData={dbMonthlyGrowth} pieData={pieData} />

      {/* ========== 3. ZONE DE TRAVAIL PRINCIPALE ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Derniers Articles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Newspaper size={20} className="text-primary" />
              <h2 className="text-xl font-serif font-black uppercase tracking-tight text-foreground">{t('recentContent.title')}</h2>
            </div>
            <Link href="/admin/articles" className="text-[10px] font-black uppercase tracking-widest text-primary hover:tracking-[0.2em] transition-all">
              {t('recentContent.viewAll')} →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dbRecentArticles.length > 0 ? (
              dbRecentArticles.map((article: any) => (
                <div key={article.id} className="group bg-card border border-border p-6 rounded-3xl hover:border-primary/30 transition-all hover:shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[8px] font-black uppercase tracking-widest bg-muted px-2 py-1 rounded text-muted-foreground">
                        {article.category?.translations?.[0]?.title || 'Général'}
                      </span>
                      {article.published ? (
                        <div className="h-1.5 w-1.5 rounded-md bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-md bg-amber-500" />
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-2">
                       {article.translations?.[0]?.title || 'Sans titre'}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-[9px] font-bold text-muted-foreground/60">
                      {new Date(article.updatedAt).toLocaleDateString(locale)}
                    </span>
                    <Link href={`/admin/articles/${article.id}/edit`}>
                      <button className="p-2 bg-muted rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
                        <ArrowUpRight size={14} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-20 bg-muted/50 border border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                 <Database size={40} className="text-muted-foreground/20 mb-4" />
                 <p className="text-muted-foreground font-medium italic">{t('recentContent.empty')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Derniers Messages */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare size={20} className="text-primary" />
              <h2 className="text-xl font-serif font-black uppercase tracking-tight text-foreground">
                {t('recentMessages.title')}
              </h2>
            </div>
            <Link href="/admin/messages" className="text-[10px] font-black uppercase tracking-widest text-primary hover:tracking-[0.2em] transition-all">
              {t('recentMessages.viewAll')}
            </Link>
          </div>

          <div className="space-y-4">
            {dbLatestMessages.length > 0 ? (
              dbLatestMessages.map((msg: any) => (
                <div key={msg.id} className="bg-card border border-border p-5 rounded-3xl hover:shadow-md transition-all group">
                   <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                        {msg.name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black uppercase tracking-tight text-foreground truncate leading-none">{msg.name}</p>
                        <p className="text-[8px] font-bold text-muted-foreground/60 mt-1 uppercase tracking-widest">{new Date(msg.createdAt).toLocaleDateString(locale)}</p>
                      </div>
                      {msg.status === 'UNREAD' && (
                        <div className="h-1.5 w-1.5 rounded-md bg-primary animate-pulse" />
                      )}
                   </div>
                   <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic mb-4">
                     "{msg.message}"
                   </p>
                   <Link href="/admin/messages">
                     <button className="w-full py-2 bg-muted group-hover:bg-primary group-hover:text-primary-foreground text-[9px] font-black uppercase tracking-widest rounded-xl transition-all">
                        {t('recentMessages.consult')}
                     </button>
                   </Link>
                </div>
              ))
            ) : (
              <div className="py-12 bg-muted/50 border border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-center px-6">
                 <MessageSquare size={32} className="text-muted-foreground/20 mb-2" />
                 <p className="text-muted-foreground text-xs font-medium">{t('recentMessages.empty')}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}