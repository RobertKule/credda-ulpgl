import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import AdminSidebar from "@/components/admin/AdminSidebar";

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
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  
  // ✅ Vérification de sécurité
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect(`/${locale}/login`);

  // ✅ Messages pour les composants clients
  const messages = await getMessages();
  
  // ✅ Menu items avec icônes
  const menuItems = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/articles", label: "Articles", icon: "FileText" },
  { href: "/admin/publications", label: "Publications", icon: "BookOpen" },
  { href: "/admin/members", label: "Équipe", icon: "UserCircle" },
  { href: "/admin/messages", label: "Messages", icon: "Mail" },
  { href: "/admin/users", label: "Accès", icon: "Users" },
];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        
        {/* ✅ Sidebar */}
        <AdminSidebar locale={locale} menuItems={menuItems} />
        
        {/* ✅ Contenu principal */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          
          {/* ✅ Header mobile */}
          <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  id="menu-button"
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Menu"
                  onClick={() => {
                    const event = new CustomEvent('toggle-sidebar');
                    window.dispatchEvent(event);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600">
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  </svg>
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">C</span>
                  </div>
                  <span className="font-serif font-bold text-slate-900">CREDDA Admin</span>
                </div>
              </div>
              
              <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                🔒 Sécurisé
              </div>
            </div>
          </header>

          {/* ✅ Contenu principal */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 lg:hidden">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Administration
                </p>
              </div>
              {children}
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