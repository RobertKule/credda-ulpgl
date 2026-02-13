"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();

  useEffect(() => {
    const logout = async () => {
      await fetch(`/api/${locale}/admin/logout`, {
        method: "POST",
      });

      router.replace(`/${locale}/login`);
    };

    logout();
  }, [locale, router]);

  return <p className="p-8">Déconnexion...</p>;
}
