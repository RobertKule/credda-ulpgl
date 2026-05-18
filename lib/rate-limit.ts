// lib/rate-limit.ts
const cache = new Map<string, { count: number; expires: number }>();

export async function rateLimit(email: string) {
  const now = Date.now();
  const entry = cache.get(email);

  if (!entry || now > entry.expires) {
    // Premier essai ou expiré
    cache.set(email, { count: 1, expires: now + 1000 * 60 * 15 });
    return { success: true };
  }

  if (entry.count >= 5) {
    return { success: false };
  }

  entry.count += 1;
  return { success: true };
}

export function resetRateLimit(email: string) {
  cache.delete(email);
}
