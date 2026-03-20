// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db as prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        // 1. Vérifier les comptes admin "seed" / hardcoded
        const adminFromSeed = [
          { email: "masteradmin@credda.org", password: process.env.MASTER_ADMIN_PASSWORD || "CreddaMaster2026!", role: "SUPER_ADMIN" as const },
          { email: "admin@credda-ulpgl.org", password: "Admin123!", role: "ADMIN" as const },
          { email: "editor@credda-ulpgl.org", password: "Editor123!", role: "EDITOR" as const },
          { email: "kulewakangitsirobert@gmail.com", password: "credda@2026", role: "ADMIN" as const }
        ].find(a => a.email === credentials.email && a.password === credentials.password);

        if (adminFromSeed) {
          return {
            id: adminFromSeed.email,
            email: adminFromSeed.email,
            name: adminFromSeed.email.split('@')[0],
            role: adminFromSeed.role,
          };
        }

        // 2. Recherche en base de données
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("Email ou mot de passe incorrect");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Email ou mot de passe incorrect");
        }

        if (user.status !== "APPROVED") {
          throw new Error("Votre compte est en attente d'approbation ou a été désactivé.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as any;
        (session.user as any).image = token.image as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  }
};
