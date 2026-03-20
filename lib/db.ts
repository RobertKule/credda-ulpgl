// lib/db.ts
import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

// Fix for Node.js environments where WebSocket isn't global
if (typeof WebSocket === 'undefined' || (typeof process !== 'undefined' && process.env.NODE_ENV === 'development')) {
  neonConfig.webSocketConstructor = ws
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
  adapter: PrismaNeon | undefined
}

const rawConnectionString = process.env.DATABASE_URL || "";
const connectionString = rawConnectionString.trim().replace(/^"|"$/g, '');

if (process.env.NODE_ENV === 'development') {
  console.log("--- [DB NEON-SERVERLESS MODE] ---")
  console.log("DATABASE_URL present:", !!connectionString)
}

if (!connectionString) {
  console.error("❌ DATABASE_URL is missing in .env")
}

// Ensure connection string has correct SSL/Pooler parameters
const finalConnectionString = connectionString.includes('sslmode=') 
  ? connectionString 
  : (connectionString + (connectionString.includes('?') ? '&' : '?') + 'sslmode=require');

// In development, we force recreation if the current pool doesn't match the env
const currentConfig = (globalForPrisma.pool as any)?._configuredWith;
if (!globalForPrisma.pool || (process.env.NODE_ENV === 'development' && currentConfig !== finalConnectionString)) {
  if (globalForPrisma.pool) {
    console.log("🔄 Configuration changed or missing. Recreating Neon Pool...")
    globalForPrisma.pool.end().catch(() => {});
  } else {
    console.log("🚀 Initializing Neon Serverless Pool (WebSockets enabled)...")
  }

  const pool = new Pool({ connectionString: finalConnectionString });
  
  pool.on('error', (err: any) => {
    console.error('❌ Unexpected error on idle client', err);
  });

  (pool as any)._configuredWith = finalConnectionString;
  
  globalForPrisma.pool = pool;
  // Use 'as any' to solve type mismatch in some versions of adapter-neon
  globalForPrisma.adapter = new PrismaNeon(pool as any);
  globalForPrisma.prisma = undefined;
}

if (!globalForPrisma.prisma) {
  try {
    globalForPrisma.prisma = new PrismaClient({
      adapter: globalForPrisma.adapter,
      // Provide explicit datasource URL even with adapter to satisfy internal Prisma initialization
      // This solves the "No database host" error in some environments
      // @ts-ignore
      datasources: {
        db: {
          url: finalConnectionString
        }
      },
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  } catch (error) {
    console.error("❌ Failed to initialize PrismaClient with adapter:", error)
  }
}

export const db = globalForPrisma.prisma!
export const prisma = db