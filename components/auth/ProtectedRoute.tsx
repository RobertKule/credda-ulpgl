'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from '@/navigation';
import { useEffect } from 'react';
import { Role } from '@prisma/client';
import { useLocale } from "next-intl";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [Role.ADMIN, Role.EDITOR] 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
const locale = useLocale();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push(`/${locale}/login`);
    } else if (session.user?.role && !allowedRoles.includes(session.user.role)) {
      router.push('/');
    }
  }, [session, status, router, allowedRoles]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || !session.user?.role || !allowedRoles.includes(session.user.role)) {
    return null;
  }

  return <>{children}</>;
}