import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

async function db_check() {
  console.log('🚀 Loading .env from:', path.resolve(process.cwd(), '.env'));
  const connectionString = (process.env.DATABASE_URL || "").trim().replace(/^"|"$/g, '');
  console.log('📡 DB URL (masked):', connectionString.substring(0, 15) + '...');
  
  if (!connectionString) throw new Error('No DB URL');

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🧪 Testing DB connection...');
  try {
    const count = await prisma.article.count();
    console.log('✅ Articles Count:', count);
  } catch (e) {
    console.error('❌ DB Error:', e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

db_check().catch(console.error);
