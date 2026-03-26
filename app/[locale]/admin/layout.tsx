// app/[locale]/admin/layout.tsx
import { redirect } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import LoadingModal from "@/components/admin/LoadingModal";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session || !session.user) {
    redirect(`/${locale}/login`);
  }

  // Enforce ADMIN roles
  if ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPER_ADMIN") {
    redirect(`/${locale}/`);
  }

  const messages = await getMessages();

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/admin/articles", label: "Articles", icon: "FileText" },
    { href: "/admin/publications", label: "Publications", icon: "BookOpen" },
    { href: "/admin/programs", label: "Programmes", icon: "Layout" },
    { href: "/admin/gallery", label: "Gallerie", icon: "BookOpen" },
    { href: "/admin/members", label: "Équipe", icon: "UserCircle" },
    { href: "/admin/clinical", label: "Cas Cliniques", icon: "Scale" },
    { href: "/admin/resources", label: "Ressources", icon: "BookOpen" },
    { href: "/admin/sessions", label: "Itinérances", icon: "Calendar" },
    { href: "/admin/messages", label: "Messages", icon: "Mail" },
    { href: "/admin/users", label: "Accès", icon: "Users" },
  ];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
        
        {/* Sidebar */}
        <AdminSidebar locale={locale} menuItems={menuItems} />

        {/* Espace de Travail */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Bar Unifiée */}
          <AdminTopBar locale={locale} />

          {/* Zone de Contenu */}
          <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-x-hidden">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
               {children}
            </div>
          </main>

          {/* Footer Interne (Optionnel) */}
          <footer className="px-10 py-6 border-t border-slate-200 dark:border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/20 flex justify-between items-center transition-all">
             <span>© {new Date().getFullYear()} CREDDA Research Centre</span>
             <span className="hidden sm:inline">Système d'Accès Sécurisé • v2.5.0</span>
          </footer>
        </div>

        {/* Global Components */}
        <Toaster />
        <LoadingModal />
      </div>
    </NextIntlClientProvider>
  );
}