import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL manquante dans .env')
}

// Neon/Supabase pooler: keep pgbouncer=true so Prisma doesn't use
// prepared statements (incompatible with pgBouncer transaction mode).
const buildUrl = () => {
  return process.env.DATABASE_URL!;
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
