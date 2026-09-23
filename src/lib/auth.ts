import NextAuth from "next-auth"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "@/lib/auth.config"
import { prisma } from "@/lib/prisma"
import { loginSchema } from "@/lib/validations/auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })
        if (!user) return null

        const valid = await bcrypt.compare(parsed.data.password, user.password)
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.avatar = user.avatar
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = (token.username as string | null) ?? null
        session.user.avatar = (token.avatar as string | null) ?? null
      }
      return session
    },
  },
})