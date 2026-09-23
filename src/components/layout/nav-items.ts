import { Home, Handshake, User, Users } from "lucide-react"

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/personas", label: "Personas", icon: Users },
  { href: "/juntadas", label: "Juntadas", icon: Handshake },
  { href: "/perfil", label: "Perfil", icon: User },
] as const