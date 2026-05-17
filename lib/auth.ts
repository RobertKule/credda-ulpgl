// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db as prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { rateLimit, resetRateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        // 1. Validation avec Zod
        const parsed = loginSchema.safeParse(credentials);
        
        if (!parsed.success) {
          throw new Error(parsed.error.issues[0].message);
        }

        const { email, password } = parsed.data;

        // 2. Rate Limiting
        const limit = await rateLimit(email);
        if (!limit.success) {
          throw new Error("Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.");
        }

        // 2. Recherche en base de données uniquement
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            password: true,
            role: true,
            name: true,
            status: true,
            image: true,
          }
        });

        if (!user) {
          // Message générique pour éviter le user enumeration
          throw new Error("Email ou mot de passe incorrect");
        }

        // 3. Vérification du statut du compte
        if (user.status === "PENDING") {
          throw new Error("Votre compte est en attente de validation par un administrateur.");
        }
        if (user.status === "REJECTED") {
          throw new Error("Votre demande de compte a été rejetée.");
        }

        // 4. Comparaison du hash bcrypt
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          throw new Error("Email ou mot de passe incorrect");
        }

        // Reset rate limit on success
        resetRateLimit(email);

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
    maxAge: 8 * 60 * 60 // 8 heures
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.image as string | null | undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/** Server-side session (next-auth v4); use in API routes and RSC. */
export async function auth() {
  return getServerSession(authOptions);
}
