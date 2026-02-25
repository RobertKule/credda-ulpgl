import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Allow skipping Redis if env vars are missing during local build/test
const isRateLimitEnabled = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize Redis only if enabled
const redis = isRateLimitEnabled ? Redis.fromEnv() : null;

// Define limiters only if redis is available
const ratelimit = redis ? {
  auth: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "15 m") }),
  api: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 m") }),
} : null;

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "127.0.0.1";

  // 1. Rate Limiting Logic (only for specific API routes)
  const isRateLimitedApi =
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/upload") ||
    pathname.startsWith("/api/contact");

  if (isRateLimitedApi) {
    if (ratelimit) {
      let limitResult;

      if (pathname.startsWith("/api/auth")) {
        limitResult = await ratelimit.auth.limit(`auth_${ip}`);
      } else {
        limitResult = await ratelimit.api.limit(`api_${ip}`);
      }

      if (limitResult && !limitResult.success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limitResult.limit.toString(),
              "X-RateLimit-Remaining": limitResult.remaining.toString(),
              "Retry-After": Math.ceil((limitResult.reset - Date.now()) / 1000).toString()
            }
          }
        );
      }
    }

    // If it's a rate-limited API route and passes, continue immediately
    // Prevents passing the request to next-intl or duplicate execution
    return NextResponse.next();
  }

  // 2. Ignore other API routes, Next.js system files, and static assets
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // 3. Next-Intl Routing Logic
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
  const hasValidLocale = ['fr', 'en', 'sw'].includes(firstSegment);

  // Ajouter locale si absente
  if (!hasValidLocale) {
    return NextResponse.rewrite(new URL(`/fr${pathname}`, request.url));
  }

  // Sinon, laisser intlMiddleware gérer
  return intlMiddleware(request);
}

// Export as proxy as well to ensure full compatibility with the existing configuration
export const proxy = middleware;

export const config = {
  matcher: [
    // Applies rate limits specifically to these API routes
    "/api/auth/:path*",
    "/api/upload",
    "/api/contact",
    // Applies next-intl routing to all other non-system, non-extension paths
    "/((?!api|_next|.*\\..*).*)"
  ],
};
