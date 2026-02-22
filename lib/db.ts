// lib/db.ts - VERSION CORRIGÉE AVEC ADAPTATEUR
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Configuration du pool de connexions PostgreSQL
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ DATABASE_URL n'est pas définie dans l'environnement.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// ✅ Instantiation avec l'adaptateur, comme requis par Prisma 7
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // <-- L'ADAPTATEUR EST FOURNI ICI
    log: ["error"], // Vous pouvez garder les logs si vous le souhaitez
  });

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = db;