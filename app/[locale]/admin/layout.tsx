// app/[locale]/admin/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader"; // ✅ Nouveau composant client
import { Toaster } from "@/components/ui/toaster";

import {
  LayoutDashboard,
  FileText,
  BookOpen,
  UserCircle,
  Mail,
  Users
} from "lucide-react";

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { locale } = (await params) as { locale: string };

  // ✅ Vérification de sécurité (serveur uniquement)
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect(`/${locale}/login`);

  // ✅ Messages pour les composants clients
  const messages = await getMessages();

  // ✅ Menu items (données pures, pas de composants)
  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/admin/articles", label: "Articles", icon: "FileText" },
    { href: "/admin/publications", label: "Publications", icon: "BookOpen" },
    { href: "/admin/gallery", label: "Gallerie", icon: "BookOpen" },
    { href: "/admin/members", label: "Équipe", icon: "UserCircle" },
    { href: "/admin/messages", label: "Messages", icon: "Mail" },
    { href: "/admin/users", label: "Accès", icon: "Users" },
  ];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

        {/* ✅ Sidebar (composant client) */}
        <AdminSidebar locale={locale} menuItems={menuItems} />

        {/* ✅ Contenu principal */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">

          {/* ✅ Header mobile (composant client) */}
          <AdminHeader locale={locale} />

          {/* ✅ Contenu principal */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-x-hidden mt-32">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 lg:hidden">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Administration
                </p>
              </div>
              {children}
               <Toaster />
            </div>
          </main>

          {/* ✅ Footer mobile */}
          <footer className="lg:hidden bg-white border-t border-slate-200 px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
            CREDDA-ULPGL • Accès restreint
          </footer>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}