import dotenv from 'dotenv'
import path from 'path'

// Explicitly load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  })
  console.log('🚀 Starting CREDDA-ULPGL seed (Strict Admin Only)...');

  // ── 0. ADMIN USERS ──────────────────────────────────────────────────────
  try {
    console.log('⏳ Hashing passwords...');
    const masterPassword = 'Rkule@02';
    const adminPassword = 'credda@2026';
    const hashedSuperAdmin = await bcrypt.hash(masterPassword, 10);
    const hashedAdmin = await bcrypt.hash(adminPassword, 10);

    // 1. SUPERADMIN
    await prisma.user.upsert({
      where: { email: 'rkule880@gmail.com' },
      update: { password: hashedSuperAdmin, role: 'SUPERADMIN', status: 'APPROVED' },
      create: { email: 'rkule880@gmail.com', name: 'Super Admin', password: hashedSuperAdmin, role: 'SUPERADMIN', status: 'APPROVED' }
    });
    console.log('✅ Super admin created/updated: rkule880@gmail.com');

    // 2. ADMIN
    await prisma.user.upsert({
      where: { email: 'admin@credda-ulpgl.org' },
      update: { password: hashedAdmin, role: 'ADMIN', status: 'APPROVED' },
      create: { email: 'admin@credda-ulpgl.org', name: 'Admin CREDDA', password: hashedAdmin, role: 'ADMIN', status: 'APPROVED' }
    });
    console.log('✅ Admin created/updated: admin@credda-ulpgl.org');

  } catch (e) {
    console.error('❌ Failed to upsert admin users:', e);
  }

  console.log('');
  console.log('🎉 CREDDA-ULPGL database base initialized successfully!');
  console.log('─────────────────────────────────────────────');
  console.log('Super Admin:  rkule880@gmail.com / Rkule@02');
  console.log('Admin:        admin@credda-ulpgl.org / credda@2026');
  console.log('─────────────────────────────────────────────');

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1)
  })
  .finally(() => {
    process.exit(0);
  });