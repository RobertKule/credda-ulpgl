import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    '❌ DATABASE_URL manquante.\n' +
    'Ajouter dans .env.local:\n' +
    'DATABASE_URL="postgresql://postgres:[pass]@db.[ref].supabase.co:5432/postgres"'
  )
}

// On laisse la DATABASE_URL telle quelle, sans forcer de limites ici
// On utilisera celle configurée dans le .env pour plus de flexibilité
const databaseUrl = process.env.DATABASE_URL
export const db =
  globalThis.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}

export const prisma = db

export const sql = db.$queryRaw.bind(db)
