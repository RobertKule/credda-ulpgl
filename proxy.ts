// proxy.ts
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['fr', 'en', 'sw'],
  defaultLocale: 'fr',
  localePrefix: 'always'
});

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. BYPASS - Fichiers statiques, API, Next.js internals
  if (
    pathname.startsWith('/_next') || 
    pathname.includes('.') || 
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;
  const isAdminPage = pathname.includes('/admin');
  const isLoginPage = pathname.includes('/login');

  // 2. PAGE DE LOGIN - Pas de protection, juste la gestion des langues
  if (isLoginPage) {
    return intlMiddleware(req);
  }

  // 3. PROTECTION ADMIN - Redirection vers login si non authentifié
  if (isAdminPage && !token) {
    // Extraire la locale de l'URL ou utiliser 'fr' par défaut
    const segments = pathname.split('/');
    const locale = ['fr', 'en', 'sw'].includes(segments[1]) ? segments[1] : 'fr';
    
    // Redirection vers la page de login
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // 4. TOUTES LES AUTRES PAGES - Gestion normale des langues
  return intlMiddleware(req);
}

export const config = {
  // Matcher optimisé - ignore les fichiers statiques et les API
  matcher: ['/((?!api|_next|.*\\..*).*)']
};