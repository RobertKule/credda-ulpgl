import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip proxy for system paths and not-found
  if (
    pathname.includes('not-found') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Allow next-intl to handle everything else
  return intlMiddleware(request);
}

export const middleware = proxy;

export const config = {
  matcher: [
    // Applies next-intl routing to all other non-system, non-extension paths
    '/((?!api|_next/static|_next/image|favicon.ico|not-found|robots.txt|sitemap.xml).*)',
  ],
};
