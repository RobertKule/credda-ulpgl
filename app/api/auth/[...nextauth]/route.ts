// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis")
        }

        const admin = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!admin) {
          throw new Error("Email ou mot de passe incorrect")
        }

        const isValid = await bcrypt.compare(credentials.password, admin.password)

        if (!isValid) {
          throw new Error("Email ou mot de passe incorrect")
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        }
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
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        // ✅ SOLUTION: Convertir en string puis en Role
        session.user.role = token.role as unknown as Role
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  }
})

export { handler as GET, handler as POST }