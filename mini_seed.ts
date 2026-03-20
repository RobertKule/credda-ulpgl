import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

async function mini() {
  console.log('MINI SEED START');
  const connectionString = (process.env.DATABASE_URL || "").trim().replace(/^"|"$/g, '');
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  console.log('Querying Article count...');
  const count = await prisma.article.count();
  console.log('Articles:', count);
  await prisma.$disconnect();
  await pool.end();
  console.log('MINI SEED END');
}
mini().catch(console.error);
