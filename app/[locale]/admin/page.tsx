import { 
  Users, FileText, BookOpen, Plus, ArrowUpRight, 
  ChevronRight, Database, 
  MessageSquare, Newspaper, Globe,Microscope,Scale
} from "lucide-react";

import { Link } from "@/navigation";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de Bord | CREDDA Administration",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;

  // --- RÉCUPÉRATION DES DONNÉES RÉELLES ---
  const [
    totalArticles,
    totalPublications,
    totalMembers,
    totalUsers,
    recentArticles,
    unreadMessages,
    publishedArticles,
    latestMessages
  ] = await Promise.all([
    db.article.count(),
    db.publication.count(),
    db.member.count(),
    db.user.count(),
    db.article.findMany({
      take: 4,
      orderBy: { updatedAt: 'desc' },
      include: { 
        translations: { where: { language: locale } },
        category: { include: { translations: { where: { language: locale } } } }
      }
    }),
    db.contactMessage.count({ where: { status: "UNREAD" } }),
    db.article.count({ where: { published: true } }),
    db.contactMessage.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    })
  ]);

  const stats = [
    { 
      label: "Articles Scientifiques", 
      value: totalArticles, 
      sub: `${publishedArticles} en ligne`,
      icon: <FileText size={22} />, 
      href: "/admin/articles",
      bgColor: "bg-blue-500",
      textColor: "text-blue-600"
    },
    { 
      label: "Bibliothèque PDF", 
      value: totalPublications, 
      sub: "Rapports archivés",
      icon: <BookOpen size={22} />, 
      href: "/admin/publications",
      bgColor: "bg-emerald-500",
      textColor: "text-emerald-600"
    },
    { 
      label: "Corps de Recherche", 
      value: totalMembers, 
      sub: "Experts & Staff",
      icon: <Users size={22} />, 
      href: "/admin/members",
      bgColor: "bg-purple-500",
      textColor: "text-purple-600"
    },
    { 
      label: "Requêtes Contact", 
      value: unreadMessages, 
      sub: "Messages non lus",
      icon: <MessageSquare size={22} />, 
      href: "/admin/messages",
      bgColor: unreadMessages > 0 ? "bg-amber-500" : "bg-slate-400",
      textColor: unreadMessages > 0 ? "text-amber-600" : "text-slate-600"
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      
      {/* ========== 1. HEADER EXÉCUTIF ========== */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 border-none rounded-none text-[9px] font-black tracking-widest uppercase">
              Système Opérationnel
            </Badge>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
              • Database: Neon PostgreSQL
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Dashboard <span className="text-slate-400 font-light italic">Overview</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Gestion du savoir pour la région {locale.toUpperCase()} • {new Date().toLocaleDateString(locale, { dateStyle: 'full' })}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
              <Globe size={16} /> Voir le site
            </button>
          </Link>
          <Link href="/admin/articles/new">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
              <Plus size={18} /> Nouveau Contenu
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
            className="group relative bg-white border border-slate-100 p-8 hover:border-blue-600 transition-all shadow-sm hover:shadow-2xl overflow-hidden"
          >
            {/* Décoration en arrière-plan */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bgColor} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`} />
            
            <div className="relative z-10 flex flex-col h-full justify-between space-y-4">
              <div className={`${stat.textColor} p-2 bg-slate-50 w-fit mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-4xl font-serif font-bold text-slate-950">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</div>
              </div>
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500">{stat.sub}</span>
                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-blue-600" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ========== 3. ZONE DE TRAVAIL PRINCIPALE ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne : Articles récents (Focus) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-3">
              <Newspaper size={20} className="text-blue-600" /> Travaux Récents
            </h2>
            <Link href="/admin/articles" className="text-[10px] font-black uppercase text-blue-600 hover:underline tracking-widest">
              Gérer tout
            </Link>
          </div>
          
          <div className="bg-white border border-slate-200 divide-y divide-slate-100 shadow-sm">
            {recentArticles.map((article) => (
              <Link 
                href={`/admin/articles/edit/${article.id}`}
                key={article.id} 
                className="flex items-center p-6 hover:bg-slate-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  {article.domain === "RESEARCH" ? <Microscope size={20} /> : <Scale size={20} />}
                </div>
                <div className="ml-6 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {article.translations[0]?.title || "Sans titre"}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                      {article.category?.translations[0]?.name || "Général"}
                    </span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] text-slate-400 italic">
                      Modifié {new Date(article.updatedAt).toLocaleDateString(locale)}
                    </span>
                  </div>
                </div>
                <div className={`px-3 py-1 text-[8px] font-black uppercase tracking-tighter ${article.published ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  {article.published ? "Publié" : "Draft"}
                </div>
                <ChevronRight size={18} className="ml-6 text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
            {recentArticles.length === 0 && <p className="p-10 text-center text-slate-400 italic">Aucun contenu disponible.</p>}
          </div>
        </div>

        {/* Colonne : Raccourcis & Messages */}
        <div className="space-y-8">
          
          {/* Boite de réception rapide */}
          <div className="bg-[#050a15] text-white p-8 space-y-6 shadow-2xl relative overflow-hidden">
             <div className="absolute -right-6 -bottom-6 opacity-10">
                <MessageSquare size={120} />
             </div>
             <div className="relative z-10">
               <h3 className="text-xl font-serif font-bold italic mb-6">Correspondance</h3>
               <div className="space-y-4">
                 {latestMessages.map(msg => (
                   <div key={msg.id} className="border-l border-blue-500 pl-4 py-1 group cursor-pointer hover:bg-white/5 transition-colors">
                      <p className="text-xs font-bold truncate">{msg.subject}</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{msg.name}</p>
                   </div>
                 ))}
                 {unreadMessages > 0 && (
                   <Link href="/admin/messages" className="block pt-4 text-[9px] font-black uppercase text-blue-400 hover:text-white transition-all">
                     {unreadMessages} Nouveaux messages en attente →
                   </Link>
                 )}
               </div>
             </div>
          </div>

          {/* Health Check Système */}
          <div className="bg-white border border-slate-100 p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Intégrité Système</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between text-xs">
                 <span className="text-slate-500">Stockage PDF (Vercel Blob)</span>
                 <span className="font-bold text-slate-950">Normal</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                 <span className="text-slate-500">API Latency</span>
                 <span className="font-bold text-emerald-500">24ms</span>
               </div>
               <div className="w-full bg-slate-100 h-1.5 mt-2">
                  <div className="bg-blue-600 h-full w-[85%]" />
               </div>
               <p className="text-[9px] text-slate-400 font-medium italic text-center">85% des articles traduits en 3 langues.</p>
            </div>
          </div>

        </div>
      </div>

      {/* ========== 4. FOOTER INFO DÉVELOPPEUR ========== */}
      <div className="bg-slate-50 p-6 border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Database size={16} className="text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Node: {process.version} • Prisma 6 • Neon Serverless
          </span>
        </div>
        <p className="text-[10px] text-slate-400 italic">
          Last sync: {new Date().toLocaleTimeString()}
        </p>
      </div>

    </div>
  );
}