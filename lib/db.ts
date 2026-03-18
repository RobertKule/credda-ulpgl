// lib/db.ts
import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

// Configuration pour WebSocket si nécessaire (environnements non-Edge)
neonConfig.webSocketConstructor = ws

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
  adapter: PrismaNeon | undefined
}

const connectionString = process.env.DATABASE_URL!

if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({ 
    connectionString,
    max: process.env.NODE_ENV === 'development' ? 1 : 10,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  })
}

if (!globalForPrisma.adapter) {
  globalForPrisma.adapter = new PrismaNeon(globalForPrisma.pool as any)
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({ 
    adapter: globalForPrisma.adapter,
    log: [] // Silences default logging for a cleaner terminal
  })
}

export const db = globalForPrisma.prisma
export const prisma = db