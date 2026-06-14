import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ProfileClient from "./ProfileClient";

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default async function AdminProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect(`/${locale}/login`);

  const user = session.user as SessionUser;

  // Fetch additional user data from database
  const userData = await db.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      bio: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });

  if (!userData) redirect(`/${locale}/login`);

  return (
    <ProfileClient
      user={userData}
      locale={locale}
    />
  );
}
