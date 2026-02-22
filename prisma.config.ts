import { defineConfig } from 'prisma/config'
import 'dotenv/config'; // Important pour charger les variables d'env

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts'
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})