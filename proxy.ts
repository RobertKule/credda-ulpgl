import createMiddleware from 'next-intl/middleware';

// On exporte directement la fonction nommée proxy
export default function proxy(req: any) {
  const handleI18n = createMiddleware({
    locales: ['fr', 'en', 'sw'],
    defaultLocale: 'fr',
    localePrefix: 'always'
  });
  
  return handleI18n(req);
}

export const config = {
  // On ne cible que les pages, on ignore tout le reste
  matcher: ['/((?!api|_next|.*\\..*).*)']
};