import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { getToken } from 'next-auth/jwt'

const intlMiddleware = createMiddleware(routing)

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  if (
    pathname.includes('/not-found') ||
    pathname.includes('/_not-found') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  // Protect sensitive admin routes from EDITOR
  if (pathname.includes('/admin')) {
    const token = await getToken({ req });
    if (token && token.role === 'EDITOR') {
      const pathNoLocale = pathname.replace(/^\/[a-z]{2}/, '') || pathname;
      const allowedPaths = ['/admin', '/admin/articles', '/admin/gallery', '/admin/resources', '/admin/profile'];
      
      const isAllowed = allowedPaths.some(p => pathNoLocale === p || pathNoLocale.startsWith(p + '/'));
      
      if (!isAllowed) {
        const locale = pathname.split('/')[1] || 'fr';
        return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
      }
    }
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|not-found|.*\\..*).*)'],
}
