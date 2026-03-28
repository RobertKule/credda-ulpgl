// app/[locale]/admin/layout.tsx
import { redirect } from "next/navigation";
import { getMessages, getTranslations } from "next-intl/server";
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

  const userRole = (session.user as any).role;

  // Enforce ADMIN and EDITOR roles
  if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN" && userRole !== "EDITOR") {
    redirect(`/${locale}/`);
  }

  const messages = await getMessages();
  const t = await getTranslations("AdminDashboard.sidebar");

  let menuItems = [
    { href: "/admin", label: t("dashboard"), icon: "LayoutDashboard" },
    { href: "/admin/articles", label: t("articles"), icon: "FileText" },
    { href: "/admin/programs", label: t("programs"), icon: "Layout" },
    { href: "/admin/gallery", label: t("gallery"), icon: "BookOpen" },
    { href: "/admin/members", label: t("team"), icon: "UserCircle" },
    { href: "/admin/clinical", label: t("clinical"), icon: "Scale" },
    { href: "/admin/resources", label: t("resources"), icon: "BookOpen" },
    { href: "/admin/sessions", label: t("sessions"), icon: "Calendar" },
    { href: "/admin/messages", label: t("messages"), icon: "MessageSquare" },
    { href: "/admin/announcements", label: t("announcements"), icon: "Megaphone" },
    { href: "/admin/users", label: t("users"), icon: "Users" },
  ];

  if (userRole === "EDITOR") {
    menuItems = menuItems.filter(item => 
      ['/admin', '/admin/articles', '/admin/gallery', '/admin/resources'].includes(item.href)
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen bg-background transition-colors duration-500">
        
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