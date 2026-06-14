"use client";

import { usePathname as useNextPathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import dynamic from "next/dynamic";
import PersistentGlobeBackground from "@/components/home/PersistentGlobeBackground";
import FooterTickerBar from "./FooterTickerBar";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import GlobalLoader from "./GlobalLoader";

interface Announcement {
  id: string;
  content: string;
  title?: string | null;
  level: "INFO" | "WARNING" | "URGENT";
}

export default function MainLayoutWrapper({
  children,
  announcements = [],
}: {
  children: React.ReactNode;
  announcements?: Announcement[];
}) {
  const pathname = useNextPathname();
  const isAdmin = pathname?.includes("/admin") || pathname?.split('/').includes("admin");
  const isHome = pathname === '/' || /^\/[a-z]{2}$/.test(pathname || '');
  const isAuthPage = !!(pathname?.includes("/login") || pathname?.includes("/request-access"));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence>
        {!mounted && <GlobalLoader />}
      </AnimatePresence>
      <Navbar announcements={announcements} />
      {!isHome && !isAuthPage && <PersistentGlobeBackground />}
      <div className="relative z-10 m-0 p-0 mt-20 min-h-screen bg-transparent text-foreground transition-all duration-500 overflow-x-hidden">
        {children}
      </div>
      <FooterTickerBar announcements={announcements} />
      <Footer />
    </>
  );
}
