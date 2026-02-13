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
  Users,
} from "lucide-react";
export default async function AdminLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode; 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  
  // Vérification de sécurité double (Layout + Middleware)
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect(`/${locale}/login`);

  // Récupération des messages pour les composants clients (Sidebar)
  const messages = await getMessages();
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
      <div className="flex min-h-screen bg-[#f8fafc]">
        <AdminSidebar locale={locale} menuItems={menuItems} />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="p-4 md:p-10">
            {children}
          </main>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}