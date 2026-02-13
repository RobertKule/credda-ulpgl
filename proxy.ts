// proxy.ts
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';

const intlMiddleware = createMiddleware({
  locales: ['fr', 'en', 'sw'],
  defaultLocale: 'fr',
  localePrefix: 'always'
});

// Routes publiques (accessibles sans authentification)
const publicRoutes = [
  '/login',
  '/about',
  '/contact',
  '/research',
  '/clinical',
  '/publications',
  '/team',
  '/search'
];

// Routes admin (réservées aux administrateurs)
const adminRoutes = [
  '/admin',
  '/admin/articles',
  '/admin/publications',
  '/admin/members',
  '/admin/messages',
  '/admin/users'
];

// Routes éditeur (accessibles aux ADMIN et EDITOR)
const editorRoutes = [
  '/admin/articles/new',
  '/admin/articles/edit',
  '/admin/publications/new',
  '/admin/members/edit'
];

// Vérifier si le chemin correspond à un pattern
const matchesPattern = (pathname: string, patterns: string[]) => {
  return patterns.some(pattern => 
    pathname === pattern || 
    pathname.startsWith(pattern + '/') ||
    (pattern.includes('*') && pathname.match(new RegExp('^' + pattern.replace('*', '.*') + '$')))
  );
};

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // 1. BYPASS - Fichiers statiques, API, Next.js internals
  if (
    pathname.startsWith('/_next') || 
    pathname.includes('.') || 
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Extraire la locale de l'URL
  const segments = pathname.split('/');
  const locale = ['fr', 'en', 'sw'].includes(segments[1]) ? segments[1] : 'fr';
  
  // 2. RÉCUPÉRER LE TOKEN (NextAuth + Cookie personnalisé)
  let token = null;
  try {
    // Essayer d'abord avec NextAuth
    token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  } catch (error) {
    // Fallback sur le cookie personnalisé
    token = req.cookies.get('token')?.value ? { role: 'ADMIN' } : null;
  }

  const userRole = token?.role || null;
  const isAuthenticated = !!token;

  // 3. PAGE DE LOGIN - Pas de protection
  if (pathname.includes('/login')) {
    // Si déjà authentifié, rediriger vers admin
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
    }
    return intlMiddleware(req);
  }

  // 4. PROTECTION ADMIN (Rôle ADMIN uniquement)
  if (matchesPattern(pathname, adminRoutes)) {
    if (!isAuthenticated) {
      // Sauvegarder l'URL d'origine pour redirection après login
      const redirectUrl = new URL(`/${locale}/login`, req.url);
      redirectUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    if (userRole !== 'ADMIN') {
      // Accès refusé - rediriger vers accueil
      return NextResponse.redirect(new URL(`/${locale}/`, req.url));
    }
  }

  // 5. PROTECTION ÉDITEUR (Rôle ADMIN ou EDITOR)
  if (matchesPattern(pathname, editorRoutes)) {
    if (!isAuthenticated) {
      const redirectUrl = new URL(`/${locale}/login`, req.url);
      redirectUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    if (!['ADMIN', 'EDITOR'].includes(userRole || '')) {
      return NextResponse.redirect(new URL(`/${locale}/`, req.url));
    }
  }

  // 6. TOUTES LES AUTRES PAGES - Gestion normale des langues
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};