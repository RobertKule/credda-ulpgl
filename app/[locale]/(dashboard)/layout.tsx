import React from "react";
import { auth } from "@/lib/auth";
import DashboardClientLayout from "./DashboardClientLayout";

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  return (
    <DashboardClientLayout locale={locale} session={session}>
      {children}
    </DashboardClientLayout>
  );
}
