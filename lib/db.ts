// lib/db.ts
import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

// Fix for Node.js environments where WebSocket isn't global
if (typeof WebSocket === 'undefined') {
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
  console.log("DATABASE_URL length:", connectionString.length)
}

if (!connectionString) {
  console.error("❌ DATABASE_URL is missing in .env")
}

// Ensure connection string has correct SSL parameters for Neon if needed
const finalConnectionString = connectionString + (connectionString.includes('?') ? '&' : '?') + 'sslmode=require';

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
  
  pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
  });

  (pool as any)._configuredWith = finalConnectionString;
  
  globalForPrisma.pool = pool;
  globalForPrisma.adapter = new PrismaNeon(pool);
  globalForPrisma.prisma = undefined;
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    adapter: globalForPrisma.adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const db = globalForPrisma.prisma
export const prisma = db