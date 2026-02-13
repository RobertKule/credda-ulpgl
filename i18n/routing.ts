// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en', 'sw'],
  defaultLocale: 'fr',
  localePrefix: 'always'
});

export type Locale = (typeof routing.locales)[number];