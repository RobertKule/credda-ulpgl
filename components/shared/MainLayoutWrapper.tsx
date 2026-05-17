"use client";

import { usePathname } from "@/navigation"; // Supposant que /navigation exporte usePathname
import { usePathname as useNextPathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import dynamic from "next/dynamic";
import PersistentGlobeBackground from "@/components/home/PersistentGlobeBackground";

const SystemBanner = dynamic(() => import("./SystemBanner"), { ssr: false });

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = useNextPathname();
  const isAdmin = pathname?.includes("/admin") || pathname?.split('/').includes("admin");
  const isHome = pathname === '/' || /^\/[a-z]{2}$/.test(pathname || '');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <SystemBanner />
      <Navbar />
      {!isHome && <PersistentGlobeBackground />}
      <div className="relative z-10 m-0 p-0 min-h-screen bg-transparent text-foreground overflow-x-hidden transition-all duration-500">
        {children}
      </div>
      <Footer />
    </>
  );
}
