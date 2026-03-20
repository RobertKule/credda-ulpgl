const { Client } = require('pg');
require('dotenv').config();

const connectionString = (process.env.DATABASE_URL || "").trim().replace(/^"|"$/g, '');

async function test() {
  console.log("Testing direct PG connection to:", connectionString.split('@')[1]);
  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query('SELECT NOW()');
    console.log("Result:", res.rows[0]);
  } catch (err) {
    console.error("Connection failed:", err.message);
  } finally {
    await client.end();
  }
}

test();
