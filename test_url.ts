import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log("URL:", process.env.DATABASE_URL);

import { Pool } from '@neondatabase/serverless';

try {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  console.log("Pool created successfully with connectionString.");
} catch(e) {
  console.error("Pool creation failed:", e);
}
