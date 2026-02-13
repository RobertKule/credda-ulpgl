import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter'; // ✅ CHANGEMENT ICI
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

// Interface pour l'utilisateur
interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  password: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        }) as User | null;

        if (!user) {
          throw new Error('Aucun utilisateur trouvé avec cet email');
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error('Mot de passe incorrect');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as Role;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    // Use locale-aware login paths to avoid middleware rewrite loops
    signIn: '/fr/login',
    error: '/fr/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };