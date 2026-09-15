import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { rateLimit } from "@/lib/rate-limit"

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 }, // 1 hour - auto logout for admin protection
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email / Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        // Brute-force protection: 5 attempts / 15 min per identifier
        const key = `login:${String(credentials.email).toLowerCase().trim()}`
        if (!rateLimit(key, 5, 15 * 60 * 1000)) throw new Error("Trop de tentatives - réessayez dans 15 minutes")
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        // Also allow username "admin123" alias
        let target = user
        if (!target && credentials.email === 'admin123') {
          target = await prisma.user.findUnique({ where: { email: 'admin123' } })
        }
        if (!target) return null
        const valid = await bcrypt.compare(credentials.password, target.password)
        if (!valid) return null
        return { id: target.id, name: target.name, email: target.email, image: target.image }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      if (token) (session.user as any).id = token.id
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
