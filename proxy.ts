import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { getToken } from 'next-auth/jwt'

const intlMiddleware = createMiddleware(routing)

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Exclure Assets et APIs
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Protection du Dashboard
  const isDashboardRoute = pathname.match(/\/(fr|en|sw)\/admin/);
  
  if (isDashboardRoute) {
    const token = await getToken({ req });
    const locale = isDashboardRoute[1];

    if (!token) {
      const loginUrl = new URL(`/${locale}/login`, req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // RBAC
    const role = token.role as string;
    const pathNoLocale = pathname.replace(/^\/[a-z]{2}/, '');

    if (role === 'RESEARCHER') {
      const allowed = ['/admin', '/admin/researches', '/admin/profile'];
      const isAllowed = allowed.some(p => pathNoLocale === p || pathNoLocale.startsWith(p + '/'));
      if (!isAllowed) return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
    }
    
    if (role === 'EDITOR') {
      const allowed = ['/admin', '/admin/articles', '/admin/gallery', '/admin/publications', '/admin/clinique', '/admin/resources', '/admin/profile'];
      const isAllowed = allowed.some(p => pathNoLocale === p || pathNoLocale.startsWith(p + '/'));
      if (!isAllowed) return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
    }
  }

  // 3. next-intl gère le routage i18n — change de locale si nécessaire
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
