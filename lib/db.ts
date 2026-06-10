import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    '❌ DATABASE_URL manquante.\n' +
    'Ajouter dans .env.local:\n' +
    'DATABASE_URL="postgresql://postgres:[pass]@db.[ref].supabase.co:6543/postgres?pgbouncer=true"'
  )
}

// Always use the pooler URL (pgbouncer=true, port 6543 = transaction mode).
// connection_limit is capped at 2 so multiple Next.js HMR workers don't
// collectively exceed Supabase's pool_size of 15.
const buildUrl = () => {
  const base = process.env.DATABASE_URL!;
  try {
    const url = new URL(base);
    url.searchParams.set('pgbouncer', 'true');
    url.searchParams.set('connection_limit', '2');
    return url.toString();
  } catch {
    return base;
  }
};

export const db =
  globalThis.prisma ??
  new PrismaClient({
    datasources: { db: { url: buildUrl() } },
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}

export const prisma = db

export const sql = db.$queryRaw.bind(db)
