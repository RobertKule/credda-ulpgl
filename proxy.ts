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

  // 1. Bypass total pour les fichiers système, images et API
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

  // 2. SI ON EST SUR LOGIN : On applique uniquement la langue et on S'ARRÊTE
  // Cela empêche la boucle de redirection
  if (isLoginPage) {
    return intlMiddleware(req);
  }

  // 3. PROTECTION ADMIN : Si on veut aller sur /admin sans token
  if (isAdminPage && !token) {
    const segments = pathname.split('/');
    // On essaie de récupérer la langue dans l'URL ou on met 'fr' par défaut
    const locale = ['fr', 'en', 'sw'].includes(segments[1]) ? segments[1] : 'fr';
    
    // On redirige vers login. IMPORTANT: URL absolue avec le domaine
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // 4. POUR TOUT LE RESTE : Langues normales
  return intlMiddleware(req);
}

export const config = {
  // On matche tout sauf les dossiers exclus
  matcher: ['/((?!api|_next|.*\\..*).*)']
};