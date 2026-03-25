import { 
  Users, FileText, BookOpen, Plus, ArrowUpRight, 
  ChevronRight, Database, 
  MessageSquare, Newspaper, Globe,Microscope,Scale
} from "lucide-react";

import { Link } from "@/navigation";
import { db } from "@/lib/db";
import { safeQuery } from "@/lib/db-safe";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
  let totalArticles = 0;
  let totalPublications = 0;
  let totalMembers = 0;
  let totalUsers = 0;
  let recentArticles: any[] = [];
  let unreadMessages = 0;
  let publishedArticles = 0;
  let latestMessages: any[] = [];

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

  totalArticles = dbTotalArticles;
  totalPublications = dbTotalPublications;
  totalMembers = dbTotalMembers;
  totalUsers = dbTotalUsers;
  recentArticles = dbRecentArticles;
  unreadMessages = dbUnreadMessages;
  publishedArticles = dbPublishedArticles;
  latestMessages = dbLatestMessages;

    const stats = [
    { 
      label: t('stats.articles.label'), 
      value: totalArticles, 
      sub: t('stats.articles.sub', { count: publishedArticles }),
      icon: <FileText size={22} />, 
      href: "/admin/articles",
      bgColor: "bg-blue-500",
      textColor: "text-blue-600"
    },
    { 
      label: t('stats.publications.label'), 
      value: totalPublications, 
      sub: t('stats.publications.sub'),
      icon: <BookOpen size={22} />, 
      href: "/admin/publications",
      bgColor: "bg-emerald-500",
      textColor: "text-emerald-600"
    },
    { 
      label: t('stats.members.label'), 
      value: totalMembers, 
      sub: t('stats.members.sub'),
      icon: <Users size={22} />, 
      href: "/admin/members",
      bgColor: "bg-purple-500",
      textColor: "text-purple-600"
    },
    { 
      label: t('stats.messages.label'), 
      value: unreadMessages, 
      sub: t('stats.messages.sub'),
      icon: <MessageSquare size={22} />, 
      href: "/admin/messages",
      bgColor: unreadMessages > 0 ? "bg-amber-500" : "bg-slate-400",
      textColor: unreadMessages > 0 ? "text-amber-600" : "text-slate-600"
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      
      {/* ========== 1. HEADER EXÉCUTIF ========== */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-border pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-[1px] w-8 bg-primary" />
            <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">
              {t('overview.badge')}
            </span>
          </div>
          <h1 className="text-5xl font-serif font-black text-foreground tracking-tighter uppercase">
            {t.rich('overview.title', {
              italic: (chunks) => <span className="text-primary italic">{chunks}</span>
            })}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            {t('overview.subtitle', { locale: locale.toUpperCase(), date: new Date().toLocaleDateString(locale, { dateStyle: 'full' }) })}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-6 py-4 bg-background border border-border text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all">
              <Globe size={16} /> {t('overview.viewSite')}
            </button>
          </Link>
          <Link href="/admin/articles/new">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10">
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
            className="group relative bg-card border border-border p-8 aspect-square rounded-2xl hover:border-primary/50 hover:-translate-y-1 transition-all shadow-sm hover:shadow-2xl overflow-hidden flex flex-col justify-between"
          >
            {/* Décoration en arrière-plan */}
            <div className={`absolute -right-4 -top-4 w-32 h-32 bg-primary opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none`} />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="text-primary bg-primary/10 p-4 w-fit mb-4 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground border border-primary/20 transition-all duration-300">
                {stat.icon}
              </div>
              <div>
                <div className="text-5xl font-serif font-black text-foreground tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">{stat.label}</div>
              </div>
              <div className="pt-6 mt-auto border-t border-border flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground/70">{stat.sub}</span>
                <ArrowUpRight size={14} className="text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ========== 3. ZONE DE TRAVAIL PRINCIPALE ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne : Articles récents (Focus) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-2xl font-serif font-black uppercase tracking-tighter text-foreground flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 text-primary flex items-center justify-center rounded-lg border border-primary/20"><Newspaper size={16} /></div> 
              {t('recent.title')}
            </h2>
            <Link href="/admin/articles" className="text-[10px] font-black uppercase text-primary hover:underline tracking-widest">
              {t('recent.manage')}
            </Link>
          </div>
          
          <div className="bg-card border border-border shadow-2xl divide-y divide-border">
            {recentArticles.map((article) => (
              <Link 
                href={`/admin/articles/edit/${article.id}`}
                key={article.id} 
                className="flex items-center p-8 hover:bg-muted/30 transition-colors group"
              >
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-border group-hover:border-primary/20">
                  {article.domain === "RESEARCH" ? <Microscope size={20} /> : <Scale size={20} />}
                </div>
                <div className="ml-6 flex-1 space-y-2">
                  <h4 className="text-base font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                    {article.translations[0]?.title || t('recent.untitled')}
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase text-primary tracking-widest">
                      {article.category?.translations[0]?.name || t('recent.general')}
                    </span>
                    <span className="text-[10px] text-muted-foreground/30">•</span>
                    <span className="text-[10px] text-muted-foreground italic">
                      {t('recent.modified', { date: new Date(article.updatedAt).toLocaleDateString(locale) })}
                    </span>
                  </div>
                </div>
                <div className={`px-4 py-2 text-[8px] font-black uppercase tracking-widest border ${article.published ? 'bg-primary/5 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'}`}>
                  {article.published ? t('recent.published') : t('recent.draft')}
                </div>
                <ChevronRight size={18} className="ml-8 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-2 transition-all" />
              </Link>
            ))}
            {recentArticles.length === 0 && <p className="p-10 text-center text-muted-foreground italic font-medium">{t('recent.empty')}</p>}
          </div>
        </div>

        {/* Colonne : Raccourcis & Messages */}
        <div className="space-y-8">
          
          {/* Boite de réception rapide */}
          <div className="bg-[#111110] text-white p-10 space-y-8 shadow-2xl relative overflow-hidden border border-white/5 border-t-primary/50">
             <div className="absolute -right-6 -bottom-6 text-primary opacity-5">
                <MessageSquare size={160} />
             </div>
             <div className="relative z-10">
               <h3 className="text-2xl font-serif font-black uppercase tracking-tighter mb-8">
                 {t.rich('inbox.title', {
                   italic: (chunks) => <span className="text-primary italic">{chunks}</span>
                 })}
               </h3>
               <div className="space-y-4">
                 {latestMessages.map(msg => (
                   <div key={msg.id} className="border-l border-primary/50 pl-5 py-2 group cursor-pointer hover:bg-white/5 transition-colors">
                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">{msg.subject}</p>
                      <p className="text-[10px] text-white/50 mt-1 uppercase tracking-widest">{msg.name}</p>
                   </div>
                 ))}
                 {unreadMessages > 0 && (
                   <Link href="/admin/messages" className="block pt-6 text-[10px] font-black uppercase text-primary hover:text-white transition-all">
                     {t('inbox.unread', { count: unreadMessages })} <ArrowUpRight className="inline ml-1" size={14} />
                   </Link>
                 )}
               </div>
             </div>
          </div>

          {/* Health Check Système */}
          <div className="bg-card border border-border p-10 space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> {t('health.title')}
            </h3>
            <div className="space-y-5">
               <div className="flex items-center justify-between text-xs font-bold">
                 <span className="text-muted-foreground uppercase tracking-widest">{t('health.storage')}</span>
                 <span className="text-foreground">{t('health.normal')}</span>
               </div>
               <div className="flex items-center justify-between text-xs font-bold">
                 <span className="text-muted-foreground uppercase tracking-widest">{t('health.latency')}</span>
                 <span className="text-primary font-serif italic text-sm">24ms</span>
               </div>
               <div className="w-full bg-muted h-1.5 mt-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[85%]" />
               </div>
               <p className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-widest text-center">{t('health.desc')}</p>
            </div>
          </div>

        </div>
      </div>

      {/* ========== 4. FOOTER INFO DÉVELOPPEUR ========== */}
      <div className="bg-card p-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 mt-12">
        <div className="flex items-center gap-3">
          <Database size={16} className="text-muted-foreground/50" />
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            {t('footer.node', { version: process.version })}
          </span>
        </div>
        <p className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-widest">
          {t('footer.sync', { time: new Date().toLocaleTimeString() })}
        </p>
      </div>

    </div>
  );
}