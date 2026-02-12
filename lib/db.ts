import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configuration Neon
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error("❌ DATABASE_URL manquante");
}

// 1. Création de l'adaptateur
const pool = new Pool({ connectionString: url });
const adapter = new PrismaNeon(pool);

// 2. Création du client avec double injection de l'URL
export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    // On force l'URL ici pour satisfaire le moteur de Prisma 6
    datasources: {
      db: {
        url: url,
      },
    },
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;