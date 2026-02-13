// proxy.ts
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { Role } from '@prisma/client';

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
    pathname.startsWith(pattern + '/')
  );
};

export default withAuth(
  function middleware(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Extraire la locale de l'URL
        const segments = pathname.split('/');
        const pathWithoutLocale = '/' + segments.slice(2).join('/');
        
        // Routes publiques - toujours autorisées
        if (matchesPattern(pathWithoutLocale, publicRoutes) || pathWithoutLocale === '/') {
          return true;
        }

        // Routes admin - nécessite rôle ADMIN
        if (matchesPattern(pathWithoutLocale, adminRoutes)) {
          return token?.role === Role.ADMIN;
        }

        // Routes éditeur - nécessite rôle ADMIN ou EDITOR
        if (matchesPattern(pathWithoutLocale, editorRoutes)) {
          return token?.role === Role.ADMIN || token?.role === Role.EDITOR;
        }

        // Par défaut, pas d'authentification requise
        return true;
      }
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};