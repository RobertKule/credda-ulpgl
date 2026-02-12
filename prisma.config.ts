import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Utilise la variable d'environnement
    url: process.env.DATABASE_URL,
  },
});