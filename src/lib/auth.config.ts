import type { NextAuthConfig } from "next-auth"
import { JWTSessionError } from "@auth/core/errors"

const PRIVATE_PATHS = ["/dashboard", "/personas", "/juntadas", "/perfil"]

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [],
  logger: {
    error(error) {
      if (
        error instanceof JWTSessionError &&
        process.env.NODE_ENV !== "production"
      ) {
        return
      }
      console.error(error)
    },
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = request.nextUrl
      const isPrivate = PRIVATE_PATHS.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
      )
      const isAuthPage = pathname === "/login" || pathname === "/registro"

      if (isPrivate && !isLoggedIn) {
        return Response.redirect(new URL("/login", request.nextUrl))
      }

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", request.nextUrl))
      }

      return true
    },
  },
} satisfies NextAuthConfig