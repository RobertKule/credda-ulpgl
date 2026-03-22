import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function seedUser() {
  try {
    console.log("Initialize Neon HTTP driver...");
    const sql = neon(process.env.DATABASE_URL);
    
    console.log("Hashing password...");
    const hash = await bcrypt.hash('Rkule@02', 10);
    
    console.log("Executing Upsert Query over HTTP...");
    const res = await sql`
      INSERT INTO "User" (id, email, password, role, "createdAt") 
      VALUES ('admin-rkule-seed-777', 'rkule880@gmail.com', ${hash}, 'ADMIN', NOW())
      ON CONFLICT (email) DO UPDATE SET password = ${hash}, role = 'ADMIN'
    `;
    
    console.log("✅ Admin user UPSERTED SUCCESSFULLY via HTTP API!");
    process.exit(0);
  } catch (e) {
    console.error("Error inserting user via HTTP:", e);
    process.exit(1);
  }
}

seedUser();
