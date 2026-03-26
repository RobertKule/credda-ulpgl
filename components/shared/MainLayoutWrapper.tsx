"use client";

import { usePathname } from "@/navigation"; // Supposant que /navigation exporte usePathname
import { usePathname as useNextPathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import dynamic from "next/dynamic";

const SystemBanner = dynamic(() => import("./SystemBanner"), { ssr: false });

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = useNextPathname();
  const isAdmin = pathname?.includes("/admin") || pathname?.split('/').includes("admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <SystemBanner />
      <Navbar />
      <div className="m-0 p-0 pt-24 mt-12 min-h-[calc(100vh-6rem)] bg-background text-foreground overflow-x-hidden transition-all duration-500">
        {children}
      </div>
      <Footer />
    </>
  );
}
