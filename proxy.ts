import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/personas/:path*",
    "/juntadas/:path*",
    "/perfil/:path*",
    "/login",
    "/registro",
  ],
}