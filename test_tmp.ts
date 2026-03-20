import 'dotenv/config';
import { db } from './lib/db';

async function testConnection() {
  try {
    const categories = await db.category.count();
    console.log("Categories:", categories);
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
testConnection();
