"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import { Layout, Users, FileText, Mail, Settings, BookOpen, 
  Scale, UserCircle, LogOut, PanelLeftClose, PanelLeftOpen,
  
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";
import {  } from "lucide-react";

// Map des icônes
const IconMap: Record<string, React.ReactNode> = {
  dashboard: <Layout size={20} />,
  Users: <Users size={20} />,
  FileText: <FileText size={20} />,
  BookOpen: <BookOpen size={20} />,
  UserCircle: <UserCircle size={20} />,
  Mail: <Mail size={20} />,
};

export default function AdminSidebar({ locale, menuItems }: { locale: string, menuItems: any[] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="bg-[#050a15] text-white flex flex-col sticky top-0 h-screen shadow-2xl z-50 transition-all duration-300"
    >
      <div className={cn("p-6 border-b border-white/5 flex items-center justify-between", isCollapsed && "justify-center")}>
        {!isCollapsed && <span className="text-xl font-serif font-black">CREDDA<span className="text-blue-500">.ADMIN</span></span>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-white/5 text-slate-400">
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 pt-8 space-y-2">
        {menuItems.map((item: any) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-all",
              isCollapsed && "justify-center px-0"
            )}
          >
            <span className="text-slate-500">{IconMap[item.icon]}</span>
            {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link href="/login" className={cn("flex items-center gap-4 px-4 py-3 text-red-400", isCollapsed && "justify-center px-0")}>
          <LogOut size={20} />
          {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest">Quitter</span>}
        </Link>
      </div>
    </motion.aside>
  );
}
