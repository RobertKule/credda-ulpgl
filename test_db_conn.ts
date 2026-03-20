import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = (process.env.DATABASE_URL || "").trim().replace(/^"|"$/g, '')
console.log("DATABASE_URL length:", connectionString.length)

async function test() {
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    console.log("Attempting to connect to database...");
    // @ts-ignore
    const count = await prisma.member.count()
    console.log("Connection successful! Member count:", count)
  } catch (error) {
    console.error("Database connection failed:", error)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

test()
