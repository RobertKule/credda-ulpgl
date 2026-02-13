import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

function extractLocale(pathname: string) {
  const first = pathname.split('/')[1];
  if (['fr', 'en', 'sw'].includes(first)) return first;
  return 'fr';
}

const intlMiddleware = createMiddleware({
  locales: ['fr', 'en', 'sw'],
  defaultLocale: 'fr',
  localePrefix: 'always'
});

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.debug('[proxy] url=', request.url, 'pathname=', pathname);

  // Ignorer fichiers statiques et API
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Racine → rewrite vers /fr
  if (pathname === '/') {
    return NextResponse.rewrite(new URL('/fr', request.url));
  }

  // Login → rewrite vers /<locale>/login uniquement si pas déjà dessus
  if (pathname === '/login') {
    const locale = extractLocale(pathname);
    return NextResponse.rewrite(new URL(`/${locale}/login`, request.url));
  }
  if (pathname === '/fr/login' || pathname === '/en/login' || pathname === '/sw/login') {
    // On est déjà sur la bonne page → laisser la requête continuer normalement
    return NextResponse.next();
  }

  // Vérifier si locale est présente
  const firstSegment = pathname.split('/')[1];
  const hasValidLocale = ['fr','en','sw'].includes(firstSegment);

  // Ajouter locale si absente
  if (!hasValidLocale) {
    return NextResponse.rewrite(new URL(`/fr${pathname}`, request.url));
  }

  // Sinon, laisser intlMiddleware gérer
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
