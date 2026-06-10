import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  });

  await client.connect();
  console.log("Connected to database.");

  try {
    // Step 1: Add the new enum values
    console.log("Adding SUPERADMIN and RESEARCHER to Role enum...");
    await client.query(`ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SUPERADMIN'`);
    await client.query(`ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'RESEARCHER'`);
    console.log("✓ Enum values added.");

    // Step 2: Update existing rows
    console.log("Updating existing SUPER_ADMIN rows to SUPERADMIN...");
    const result = await client.query(
      `UPDATE "User" SET role = 'SUPERADMIN' WHERE role = 'SUPER_ADMIN'`
    );
    console.log(`✓ Updated ${result.rowCount} users.`);

    // Step 3: Add new CaseStatus values
    console.log("Adding IN_PROGRESS to CaseStatus enum...");
    await client.query(`ALTER TYPE "CaseStatus" ADD VALUE IF NOT EXISTS 'IN_PROGRESS'`);
    console.log("✓ IN_PROGRESS added to CaseStatus.");

    // Step 4: Add PENDING to ContentStatus
    console.log("Adding PENDING to ContentStatus enum...");
    await client.query(`ALTER TYPE "ContentStatus" ADD VALUE IF NOT EXISTS 'PENDING'`);
    console.log("✓ PENDING added to ContentStatus.");

    console.log("\n✅ All enum migrations completed successfully!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
    console.log("Disconnected.");
  }
}

main();
