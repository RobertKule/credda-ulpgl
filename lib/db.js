"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// lib/db.ts - VERSION CORRIGÉE AVEC ADAPTATEUR
var client_1 = require("@prisma/client");
var adapter_pg_1 = require("@prisma/adapter-pg");
var pg_1 = require("pg");
var globalForPrisma = globalThis;
// Configuration du pool de connexions PostgreSQL
var connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("❌ DATABASE_URL n'est pas définie dans l'environnement.");
}
var pool = new pg_1.Pool({ connectionString: connectionString });
var adapter = new adapter_pg_1.PrismaPg(pool);
// ✅ Instantiation avec l'adaptateur, comme requis par Prisma 7
exports.db = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient({
    adapter: adapter, // <-- L'ADAPTATEUR EST FOURNI ICI
    log: ["error"], // Vous pouvez garder les logs si vous le souhaitez
});
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.db;
