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
  console.log('🚀 Starting Database Seeding...');

  // 1. MASTER ADMIN
  const masterAdminEmail = 'masteradmin@credda.org';
  const masterAdminPasswordStr = process.env.MASTER_ADMIN_PASSWORD || 'CreddaMaster2026!';
  const hashedPassword = await bcrypt.hash(masterAdminPasswordStr, 12);

  const masterAdmin = await prisma.user.upsert({
    where: { email: masterAdminEmail },
    update: {
      password: hashedPassword,
      role: 'MASTER_ADMIN' as Role,
    },
    create: {
      email: masterAdminEmail,
      name: 'Master Admin CREDDA',
      password: hashedPassword,
      role: 'MASTER_ADMIN' as Role,
    },
  });

  console.log('-----------------------------------');
  console.log('Master Admin Account Created/Updated');
  console.log(`Email: ${masterAdminEmail}`);
  console.log(`Password: ${masterAdminPasswordStr}`);
  console.log('-----------------------------------');

  // 2. INITIAL CLINIC (Goma Center)
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

  // 3. INITIAL MOBILE CLINICS
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

  // 4. CATEGORIES
  await prisma.category.upsert({
    where: { slug: 'environment' },
    update: {},
    create: {
      slug: 'environment',
      translations: {
        createMany: {
          data: [
            { language: 'fr', name: 'Environnement' },
            { language: 'en', name: 'Environment' },
            { language: 'sw', name: 'Mazingira' },
          ],
        },
      },
    },
  });

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
