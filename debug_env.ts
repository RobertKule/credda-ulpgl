import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
console.log('CWD:', process.cwd());
console.log('ENV_PATH:', path.resolve(process.cwd(), '.env'));
console.log('DB_URL_EXIST:', !!process.env.DATABASE_URL);
console.log('DB_URL_LENGTH:', process.env.DATABASE_URL?.length || 0);
