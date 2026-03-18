import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Starting Comprehensive Database Seeding...');

  // 1. MASTER ADMIN
  const masterAdminEmail = 'masteradmin@credda.org';
  const masterAdminPasswordStr = process.env.MASTER_ADMIN_PASSWORD || 'CreddaMaster2026!';
  const hashedPassword = await bcrypt.hash(masterAdminPasswordStr, 12);

  const masterAdmin = await prisma.user.upsert({
    where: { email: masterAdminEmail },
    update: {
      password: hashedPassword,
      role: 'SUPER_ADMIN' as Role,
      status: 'APPROVED',
    },
    create: {
      email: masterAdminEmail,
      name: 'Master Admin CREDDA',
      password: hashedPassword,
      role: 'SUPER_ADMIN' as Role,
      status: 'APPROVED',
    },
  });

  console.log('✅ Master Admin Ready');

  // 2. CATEGORIES
  const envCategory = await prisma.category.upsert({
    where: { slug: 'environment' },
    update: {},
    create: {
      slug: 'environment',
      translations: {
        createMany: {
          data: [
            { language: 'fr', name: 'Droit de l\'Environnement' },
            { language: 'en', name: 'Environmental Law' },
            { language: 'sw', name: 'Sheria ya Mazingira' },
          ],
        },
      },
    },
  });

  const landCategory = await prisma.category.upsert({
    where: { slug: 'land-disputes' },
    update: {},
    create: {
      slug: 'land-disputes',
      translations: {
        createMany: {
          data: [
            { language: 'fr', name: 'Conflits Fonciers' },
            { language: 'en', name: 'Land Disputes' },
            { language: 'sw', name: 'Migogoro ya Ardhi' },
          ],
        },
      },
    },
  });
  
  console.log('✅ Categories Ready');

  // 3. ARTICLES
  await prisma.article.upsert({
    where: { slug: 'climate-justice-kivu' },
    update: {},
    create: {
      slug: 'climate-justice-kivu',
      domain: 'RESEARCH',
      published: true,
      featured: true,
      categoryId: envCategory.id,
      mainImage: 'https://images.unsplash.com/photo-1621252178044-67dce8620ed7?q=80&w=1200',
      translations: {
        createMany: {
          data: [
            { 
              language: 'fr', 
              title: 'Justice Climatique au Nord-Kivu : Défis et Perspectives', 
              excerpt: 'Une analyse approfondie des impacts du changement climatique sur les communautés locales du Nord-Kivu.',
              content: 'Le changement climatique n\'est pas qu\'une crise environnementale, c\'est une crise des droits humains. Au Nord-Kivu, les communautés font face à des défis sans précédent...'
            },
            { 
              language: 'en', 
              title: 'Climate Justice in North Kivu: Challenges and Perspectives', 
              excerpt: 'An in-depth analysis of the impacts of climate change on local communities in North Kivu.',
              content: 'Climate change is not just an environmental crisis, it is a human rights crisis. In North Kivu, communities face unprecedented challenges...'
            },
            { 
              language: 'sw', 
              title: 'Haki ya Hali ya Hewa Kivu Kaskazini: Changamoto na Mitazamo', 
              excerpt: 'Uchambuzi wa kina kuhusu athari za mabadiliko ya hali ya hewa kwa jamii za Kivu Kaskazini.',
              content: 'Mabadiliko ya hali ya hewa si tu mgogoro wa mazingira, ni mgogoro wa haki za binadamu...'
            },
          ]
        }
      }
    }
  });

  // 4. MEMBERS (TEAM)
  await prisma.member.create({
    data: {
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400',
      email: 'director@credda-ulpgl.org',
      order: 1,
      translations: {
        createMany: {
          data: [
            { language: 'fr', name: 'Dr. Jean Mukanya', role: 'Directeur de Recherche', bio: 'Expert en droit international de l\'environnement.' },
            { language: 'en', name: 'Dr. Jean Mukanya', role: 'Research Director', bio: 'Expert in international environmental law.' },
            { language: 'sw', name: 'Dr. Jean Mukanya', role: 'Mkurugenzi wa Utafiti', bio: 'Mtaalamu wa sheria ya mazingira ya kimataifa.' },
          ]
        }
      }
    }
  });

  // 5. LEGAL RESOURCES
  await prisma.legalResource.upsert({
    where: { slug: 'guide-droits-fonciers-2026' },
    update: {},
    create: {
      slug: 'guide-droits-fonciers-2026',
      category: 'guide',
      featured: true,
      published: true,
      translations: {
        createMany: {
          data: [
            { language: 'fr', title: 'Guide Pratique des Droits Fonciers', description: 'Un manuel complet pour les praticiens du droit et les communautés locales.', content: 'Ce guide détaille les procédures d\'acquisition et de défense des droits fonciers en RDC...' },
            { language: 'en', title: 'Practical Guide to Land Rights', description: 'A comprehensive manual for legal practitioners and local communities.', content: 'This guide details the procedures for acquiring and defending land rights in the DRC...' },
            { language: 'sw', title: 'Mwongozo wa Vitendo wa Haki za Ardhi', description: 'Mwongozo wa kina kwa wataalamu wa sheria na jamii za mitaa.', content: 'Mwongozo huu unaelezea taratibu za kupata na kutetea haki za ardhi DRC...' },
          ]
        }
      }
    }
  });

  // 6. CLINIC SESSIONS
  await prisma.clinicSession.upsert({
    where: { id: 'goma-main-clinic' },
    update: {},
    create: {
      id: 'goma-main-clinic',
      title: 'Centre de Consultation Clinique Goma',
      location: 'Campus Salomon, Himbi, Goma',
      lat: -1.6706,
      lng: 29.2195,
      date: new Date('2026-03-25T09:00:00Z'),
      description: 'Consultations hebdomadaires gratuites en droit de l\'environnement et foncier.',
      isMobile: false,
      capacity: 100,
      registeredCount: 0,
    },
  });

  await prisma.clinicSession.upsert({
    where: { id: 'mobile-clinic-masisi' },
    update: {},
    create: {
      id: 'mobile-clinic-masisi',
      title: 'Clinique Mobile Masisi - Protection des Forêts',
      location: 'Territoire de Masisi, Nord-Kivu',
      lat: -1.4000,
      lng: 28.8000,
      date: new Date('2026-04-10T08:00:00Z'),
      description: 'Sensibilisation aux droits fonciers des communautés locales.',
      isMobile: true,
      capacity: 50,
      registeredCount: 12,
    },
  });

  // 7. PUBLICATIONS
  await prisma.publication.upsert({
    where: { slug: 'rapport-biodiversite-2025' },
    update: {},
    create: {
      slug: 'rapport-biodiversite-2025',
      year: 2025,
      pdfUrl: '#',
      doi: '10.1234/credda.2025.01',
      domain: 'RESEARCH',
      translations: {
        createMany: {
          data: [
            { language: 'fr', title: 'Rapport Annuel sur la Biodiversité', authors: 'Équipe de Recherche CREDDA', description: 'Analyse de la perte de biodiversité et des réponses juridiques.' },
            { language: 'en', title: 'Annual Biodiversity Report', authors: 'CREDDA Research Team', description: 'Analysis of biodiversity loss and legal responses.' },
            { language: 'sw', title: 'Ripoti ya Mwaka ya Bioanuwai', authors: 'Timu ya Utafiti CREDDA', description: 'Uchambuzi wa upotevu wa bioanuwai na majibu ya kisheria.' },
          ]
        }
      }
    }
  });

  // 8. GALLERY IMAGES
  await prisma.galleryImage.create({
    data: {
      src: 'https://images.unsplash.com/photo-1526976663112-0042218df776?q=80&w=1200',
      title: 'Conférence CREDDA 2025',
      category: 'Événement',
      featured: true,
      order: 1
    }
  });

  await prisma.galleryImage.create({
    data: {
      src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200',
      title: 'Descente sur Terrain - Masisi',
      category: 'Terrain',
      featured: true,
      order: 2
    }
  });

  console.log('✅ Visual Mock Data Ready');
  console.log('✅ Seeding Completed Successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:');
    console.dir(e, { depth: null });
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    if (pool) await pool.end();
  });
