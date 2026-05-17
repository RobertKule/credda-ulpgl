// scripts/create-admin.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3] || process.env.MASTER_ADMIN_PASSWORD;
  const name = process.argv[4] || "Master Admin";

  if (!email || !password) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> [password] [name]");
    console.error("Or set MASTER_ADMIN_PASSWORD in .env");
    process.exit(1);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.error(`L'utilisateur avec l'email ${email} existe déjà.`);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "SUPER_ADMIN",
      status: "APPROVED",
    },
  });

  console.log(`✅ Super Admin créé avec succès : ${user.email}`);
}

main()
  .catch((e) => {
    console.error("Erreur lors de la création de l'admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
