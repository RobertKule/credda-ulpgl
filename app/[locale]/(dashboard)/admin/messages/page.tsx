import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import MessagesInbox from "./MessagesInbox";

export default async function AdminMessagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect(`/${locale}/login`);

  return <MessagesInbox />;
}
