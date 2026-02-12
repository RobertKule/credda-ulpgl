// prisma/seed.ts
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';

// WebSocket constructor pour Neon sur Node.js
neonConfig.webSocketConstructor = ws;

// Vérifie DATABASE_URL
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("❌ DATABASE_URL non définie dans ton fichier .env !");
}

// Initialisation Prisma avec adapter Neon
const prisma = new PrismaClient({
  adapter: new PrismaNeon(connectionString), // ⚡️ Ici on passe la string et non le pool
});

async function main() {
  console.log("⏳ Nettoyage de la base de données...");
  await prisma.articleTranslation.deleteMany();
  await prisma.article.deleteMany();
  await prisma.categoryTranslation.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.publicationTranslation.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.memberTranslation.deleteMany();
  await prisma.member.deleteMany();

  console.log("🌱 Début du seeding des données...");

  // Admin
  const hashedPassword = await bcrypt.hash("Admin@Credda2024", 10);
  await prisma.user.create({
    data: {
      email: "admin@credda-ulpgl.org",
      name: "Direction CREDDA",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Catégories
  const catGovernance = await prisma.category.create({
    data: {
      slug: "gouvernance",
      translations: {
        createMany: {
          data: [
            { language: "fr", name: "Gouvernance" },
            { language: "en", name: "Governance" },
            { language: "sw", name: "Utawala" },
          ],
        },
      },
    },
  });

  const catEnvironment = await prisma.category.create({
    data: {
      slug: "environnement",
      translations: {
        createMany: {
          data: [
            { language: "fr", name: "Environnement" },
            { language: "en", name: "Environment" },
            { language: "sw", name: "Mazingira" },
          ],
        },
      },
    },
  });

  // Articles RESEARCH
  for (let i = 1; i <= 3; i++) {
    await prisma.article.create({
      data: {
        slug: `rapport-recherche-${i}`,
        domain: "RESEARCH",
        published: true,
        featured: i === 1,
        categoryId: catGovernance.id,
        mainImage: "/images/director3.webp",
        translations: {
          createMany: {
            data: [
              {
                language: "fr",
                title: `Rapport Scientifique sur la Démocratie Vol.${i}`,
                excerpt: `Résumé analytique du rapport ${i}.`,
                content: `Contenu détaillé du rapport ${i}...`,
              },
              {
                language: "en",
                title: `Scientific Report on Democracy Vol.${i}`,
                excerpt: `Analytical summary of report ${i}.`,
                content: `Detailed content for report ${i}...`,
              },
            ],
          },
        },
      },
    });
  }

  // Article CLINICAL
  await prisma.article.create({
    data: {
      slug: "assistance-juridique-goma",
      domain: "CLINICAL",
      published: true,
      categoryId: catEnvironment.id,
      mainImage: "/images/director3.webp",
      translations: {
        create: {
          language: "fr",
          title: "Accompagnement des communautés de Goma",
          excerpt: "Assistance juridique à 50 familles pour conflits fonciers.",
          content: "Détails de l'intervention clinique...",
        },
      },
    },
  });

  // Publications
  await prisma.publication.create({
    data: {
      year: 2024,
      pdfUrl: "/docs/rapport-annuel.pdf",
      domain: "RESEARCH",
      translations: {
        create: {
          language: "fr",
          title: "Rapport Annuel de Gouvernance 2024",
          authors: "Pr. Kennedy Kihangi, Dr. Luc Smith",
          description: "Analyse exhaustive de la situation politique régionale.",
        },
      },
    },
  });

  // Membres
  await prisma.member.create({
    data: {
      image: "/images/director3.webp",
      order: 1,
      translations: {
        create: {
          language: "fr",
          name: "Pr. Dr. Kennedy Kihangi Bindu",
          role: "Directeur de Recherche",
          bio: "Expert en droit international et gouvernance démocratique.",
        },
      },
    },
  });

  console.log("🚀 Seeding terminé avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
