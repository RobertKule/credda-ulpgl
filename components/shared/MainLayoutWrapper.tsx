"use client";

import { usePathname } from "@/navigation"; // Supposant que /navigation exporte usePathname
import { usePathname as useNextPathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import dynamic from "next/dynamic";
import PersistentGlobeBackground from "@/components/home/PersistentGlobeBackground";

import { useState, useEffect } from "react";
import GlobalLoader from "./GlobalLoader";
const SystemBanner = dynamic(() => import("./SystemBanner"), { ssr: false });
import { AnimatePresence } from "framer-motion";

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = useNextPathname();
  const isAdmin = pathname?.includes("/admin") || pathname?.split('/').includes("admin");
  const isHome = pathname === '/' || /^\/[a-z]{2}$/.test(pathname || '');
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
      <SystemBanner />
      <Navbar />
      {!isHome && <PersistentGlobeBackground />}
      <div className="relative z-10 m-0 p-0 min-h-screen bg-transparent text-foreground transition-all duration-500">
        {children}
      </div>
      <Footer />
    </>
  );
}
