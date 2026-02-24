import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
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

export async function middleware(request: NextRequest) {
    // Pass through if not enabled
    if (!ratelimit) {
        return NextResponse.next();
    }

    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "127.0.0.1";
    const path = request.nextUrl.pathname;

    let limitResult;

    if (path.startsWith("/api/auth")) {
        limitResult = await ratelimit.auth.limit(`auth_${ip}`);
    } else if (path.startsWith("/api/upload") || path.startsWith("/api/contact")) {
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

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/api/auth/:path*",
        "/api/upload",
        "/api/contact"
    ],
};
