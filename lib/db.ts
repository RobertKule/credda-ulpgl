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

export const db =
  globalThis.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}

export const prisma = db

export const sql = db.$queryRaw.bind(db)
