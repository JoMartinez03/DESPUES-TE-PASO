import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

export const { auth } = NextAuth(authConfig)
export { auth as proxy }

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/personas/:path*",
    "/juntadas/:path*",
    "/perfil/:path*",
    "/login",
    "/registro",
  ],
}