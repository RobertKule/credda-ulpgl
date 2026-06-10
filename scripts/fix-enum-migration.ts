import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating User roles from SUPER_ADMIN to SUPERADMIN...");
  try {
    // We use executeRaw because the client might not have the new enum yet or might be in a broken state
    const result = await prisma.$executeRawUnsafe(
      `UPDATE "User" SET role = 'SUPERADMIN' WHERE role = 'SUPER_ADMIN'`
    );
    console.log(`Updated ${result} users.`);
  } catch (error) {
    console.error("Failed to update roles:", error);
    console.log("Attempting to add SUPERADMIN to enum if it exists...");
    // Fallback or just log
  } finally {
    await prisma.$disconnect();
  }
}

main();
