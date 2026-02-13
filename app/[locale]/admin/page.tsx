import { 
  Users, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";
import { Link } from "@/navigation";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Admin | CREDDA",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;

  // --- RÉCUPÉRATION DES DONNÉES RÉELLES (Parallel Fetching) ---
  const [
    totalArticles,
    totalPublications,
    totalMembers,
    totalUsers,
    recentActivity
  ] = await Promise.all([
    db.article.count(),
    db.publication.count(),
    db.member.count(),
    db.user.count(),
    // On récupère les 5 derniers articles pour la vue d'ensemble
    db.article.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: { translations: { where: { language: locale } } }
    })
  ]);

  const stats = [
    { 
      label: "Articles de Fond", 
      value: totalArticles.toString(), 
      icon: <FileText className="text-blue-600" />, 
      trend: "Recherche & Clinique",
      color: "blue"
    },
    { 
      label: "Rapports PDF", 
      value: totalPublications.toString(), 
      icon: <BookOpen className="text-emerald-600" />, 
      trend: "Bibliothèque numérique",
      color: "emerald"
    },
    { 
      label: "Corps Chercheur", 
      value: totalMembers.toString(), 
      icon: <Users className="text-purple-600" />, 
      trend: "Membres actifs",
      color: "purple"
    },
    { 
      label: "Gestionnaires", 
      value: totalUsers.toString(), 
      icon: <ShieldCheck className="text-orange-600" />, 
      trend: "Comptes admin",
      color: "orange"
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* 1. HEADER DYNAMIQUE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Système Connecté : Neon Database</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">
            Vue d'ensemble <span className="text-blue-600 font-sans text-sm align-top ml-2">({locale.toUpperCase()})</span>
          </h1>
          <p className="text-slate-500 font-light italic">
            Statistiques en temps réel du portail CREDDA-ULPGL.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/articles/new">
            <button className="bg-blue-600 text-white px-6 py-3 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
              <Plus size={16} /> Nouvel Article
            </button>
          </Link>
        </div>
      </div>

      {/* 2. GRILLE DE STATISTIQUES RÉELLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-slate-50 group-hover:bg-blue-50 transition-colors">{stat.icon}</div>
              <Badge variant="outline" className="text-[9px] font-bold border-slate-100 uppercase tracking-tighter">Live</Badge>
            </div>
            <div className="text-4xl font-serif font-bold text-slate-900">{stat.value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">{stat.label}</div>
            <p className="text-[10px] text-slate-400 mt-4 italic border-t pt-4">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* 3. SECTION CENTRALE : ACTIONS & ACTIVITÉ RÉCENTE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Actions Rapides (2 colonnes sur large) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-10 space-y-8">
          <div className="flex items-center justify-between border-b pb-6">
            <h2 className="text-xl font-serif font-bold flex items-center gap-3">
              <Zap size={20} className="text-blue-600" /> Raccourcis de Gestion
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Articles", desc: "Recherche et clinique", href: "/admin/articles", color: "hover:border-blue-600", icon: <FileText size={16}/> },
              { title: "PDF", desc: "Rapports annuels", href: "/admin/publications", color: "hover:border-emerald-600", icon: <BookOpen size={16}/> },
              { title: "Équipe", desc: "Annuaire chercheurs", href: "/admin/members", color: "hover:border-purple-600", icon: <Users size={16}/> },
              { title: "Accès", desc: "Sécurité & Utilisateurs", href: "/admin/users", color: "hover:border-orange-600", icon: <ShieldCheck size={16}/> },
            ].map((action, i) => (
              <Link 
                key={i} 
                href={action.href} 
                className={`p-6 border border-slate-50 bg-slate-50/30 transition-all ${action.color} group relative overflow-hidden`}
              >
                <div className="relative z-10">
                  <div className="mb-4 text-slate-400 group-hover:text-blue-600 transition-colors">{action.icon}</div>
                  <h3 className="font-black text-xs uppercase tracking-widest flex items-center justify-between text-slate-900">
                    {action.title} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-2 font-medium">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activité Récente (1 colonne) */}
        <div className="bg-white border border-slate-100 p-10 space-y-8">
          <h2 className="text-xl font-serif font-bold flex items-center gap-3">
            <Activity size={20} className="text-blue-600" /> Dernières MAJ
          </h2>
          <div className="space-y-6">
            {recentActivity.map((art) => (
              <div key={art.id} className="flex gap-4 border-l-2 border-blue-100 pl-4 py-1">
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">
                    {art.translations[0]?.title || "Sans titre"}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-medium mt-1">
                    Modifié le {art.updatedAt.toLocaleDateString(locale)}
                  </p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && <p className="text-xs italic text-slate-400">Aucune activité récente.</p>}
            
            <Link href="/admin/articles" className="block text-center text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 pt-4 border-t">
              Voir tout le journal
            </Link>
          </div>
        </div>
      </div>

      {/* 4. FOOTER INFO PANEL */}
      <div className="bg-[#050a15] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 -skew-x-12 translate-x-1/4" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-6 max-w-2xl text-center md:text-left">
            <Badge className="bg-blue-600 rounded-none uppercase text-[9px] font-black tracking-widest">Alerte Intégrité</Badge>
            <h2 className="text-3xl font-serif font-bold italic leading-tight">Garantir la véracité des faits scientifiques.</h2>
            <p className="text-slate-400 font-light leading-relaxed">
              En tant qu'administrateur du CREDDA, vous êtes responsable de la qualité des données publiées. 
              Chaque rapport PDF doit avoir été validé par le conseil scientifique de l'ULPGL avant mise en ligne.
            </p>
          </div>
          <div className="shrink-0 space-y-4 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Support Développeur</p>
            <div className="p-4 border border-white/10 bg-white/5">
              <p className="text-xs font-mono">DB_STATUS: <span className="text-green-400 uppercase">Connected</span></p>
              <p className="text-[10px] text-slate-500 mt-2 italic">Neon Serverless PostgreSQL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}