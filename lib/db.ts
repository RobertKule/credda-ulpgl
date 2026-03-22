import { loadEnvConfig } from '@next/env'
import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import type { Pool as NeonPoolType } from '@neondatabase/serverless'
import ws from 'ws'

if (typeof window === 'undefined') {
  loadEnvConfig(process.cwd())
  neonConfig.webSocketConstructor = ws
}

const rawUrl = process.env.DATABASE_URL
if (rawUrl === undefined || typeof rawUrl !== 'string') {
  throw new Error('DATABASE_URL is missing')
}
const connectionString = rawUrl.trim()
if (!connectionString) {
  throw new Error(
    'DATABASE_URL is empty — set a valid PostgreSQL connection string (e.g. Neon pooler URL)'
  )
}
if (!/^postgres(ql)?:\/\//i.test(connectionString)) {
  throw new Error(
    'DATABASE_URL must start with postgresql:// or postgres:// — check your .env (not loaded in dev?)'
  )
}

const globalForDb = globalThis as unknown as {
  prisma: PrismaClient | undefined
  neonPool: NeonPoolType | undefined
}

function getOrCreatePool(): NeonPoolType {
  if (!globalForDb.neonPool) {
    globalForDb.neonPool = new Pool({ connectionString })
  }
  return globalForDb.neonPool
}

function createPrismaClient(): PrismaClient {
  const pool = getOrCreatePool()
  const adapter = new PrismaNeon(pool as any)
  return new PrismaClient({ adapter })
}

const prisma = globalForDb.prisma ?? createPrismaClient()
globalForDb.prisma = prisma

export const db = prisma
