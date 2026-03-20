import dotenv from 'dotenv'
import path from 'path'

// Explicitly load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionStringRaw = (process.env.DATABASE_URL || "").trim().replace(/^"|"$/g, '');
const connectionString = connectionStringRaw.includes('?') 
  ? `${connectionStringRaw}&uselibpqcompat=true&sslmode=require`
  : `${connectionStringRaw}?uselibpqcompat=true&sslmode=require`;
console.log('📡 DB URL (SSL Compatible) Length:', connectionString.length);

if (!connectionString) {
  throw new Error('❌ DATABASE_URL is missing!');
}

const pool = new Pool({ 
  connectionString,
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('🚀 Starting Seeding...');

  // 1. CATEGORIES
  let catResearch;
  try {
    catResearch = await prisma.category.create({
      data: {
        slug: 'recherche-fondamentale',
        translations: {
          create: [
            { language: 'fr', name: 'Recherche Fondamentale' },
            { language: 'en', name: 'Fundamental Research' },
            { language: 'sw', name: 'Utafiti wa Msingi' }
          ]
        }
      }
    });
    console.log('✅ Category created');
  } catch (e) {
    catResearch = await prisma.category.findUnique({ where: { slug: 'recherche-fondamentale' } });
    console.log('ℹ️ Category already exists.');
  }

  // 2. ARTICLES / PUBLICATIONS
  const publications = [
    {
      slug: 'impact-juridique-pollution-lac-kivu',
      title_fr: 'Impact Juridique de la Pollution du Lac Kivu',
      title_en: 'Legal Impact of Lake Kivu Pollution',
      desc_fr: 'Analyse des cadres réglementaires sur la gestion des eaux transfrontalières.',
      desc_en: 'Analysis of regulatory frameworks on transboundary water management.',
      content: '<p>L’analyse approfondie du cadre juridique régissant la protection du Lac Kivu révèle des lacunes critiques dans l’application des normes environnementales nationales et régionales...</p>'
    },
    {
      slug: 'justice-climatique-est-rdc',
      title_fr: 'Justice Climatique dans l’Est de la RDC',
      title_en: 'Climate Justice in Eastern DRC',
      desc_fr: 'Étude sur la résilience des communautés locales face aux déplacements climatiques.',
      desc_en: 'Study on the resilience of local communities facing climate displacements.',
      content: '<p>Ce rapport explore les mécanismes de réparation pour les populations victimes de catastrophes naturelles liées au climat dans les zones de conflit...</p>'
    }
  ];

  for (const pub of publications) {
    try {
      await prisma.article.create({
        data: {
          slug: pub.slug,
          domain: 'RESEARCH',
          published: true,
          featured: true,
          categoryId: catResearch?.id as string,
          translations: {
            create: [
              { language: 'fr', title: pub.title_fr, content: pub.content, excerpt: pub.desc_fr },
              { language: 'en', title: pub.title_en, content: pub.content, excerpt: pub.desc_en }
            ]
          }
        }
      });
      console.log(`✅ Publication created: ${pub.slug}`);
      await sleep(300);
    } catch (e) {
      console.log(`ℹ️ Publication ${pub.slug} already exists.`);
    }
  }

  // 3. EVENTS
  const eventsData = [
    {
      slug: 'symposium-droit-environnement-2026',
      date: new Date('2026-05-15T09:00:00Z'),
      location: 'Goma, Grand Karavia',
      title_fr: 'Symposium International sur le Droit de l’Environnement',
      title_en: 'International Symposium on Environmental Law',
      desc_fr: 'Une rencontre entre experts, magistrats et défenseurs des droits humains.',
      desc_en: 'A meeting between experts, magistrates, and human rights defenders.'
    }
  ];

  for (const ev of eventsData) {
    try {
      await prisma.event.create({
        data: {
          slug: ev.slug,
          date: ev.date,
          location: ev.location,
          type: 'CONFERENCE',
          isPublished: true,
          translations: {
            create: [
              { language: 'fr', title: ev.title_fr, description: ev.desc_fr },
              { language: 'en', title: ev.title_en, description: ev.desc_en }
            ]
          }
        }
      });
      console.log(`✅ Event created: ${ev.slug}`);
      await sleep(300);
    } catch (e) {
      console.log(`ℹ️ Event ${ev.slug} already exists.`);
    }
  }

  // 4. MEMBERS
  const membersData = [
    {
      email: 'dir@credda.ulpgl',
      name_fr: 'Prof. Jean de Dieu Kahindo',
      role_fr: 'Directeur de Recherche',
      bio_fr: 'Expert en droit foncier et environnemental avec plus de 20 ans d’expérience.'
    }
  ];

  for (const m of membersData) {
    try {
      await prisma.member.create({
        data: {
          email: m.email,
          order: 1,
          translations: {
            create: [
              { language: 'fr', name: m.name_fr, role: m.role_fr, bio: m.bio_fr }
            ]
          }
        }
      });
      console.log(`✅ Member created: ${m.email}`);
      await sleep(300);
    } catch (e) {
      console.log(`ℹ️ Member ${m.email} already exists.`);
    }
  }

  console.log('✅ Seeding Completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
