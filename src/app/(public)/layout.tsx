import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Brand } from "@/components/layout/brand"

export default async function PublicLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()
  if (session?.user) redirect("/dashboard")

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex items-center justify-between px-5 py-4 lg:px-8">
        <Brand />
      </div>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        {children}
      </main>
      <footer className="px-5 py-4 text-center text-xs text-muted-foreground">
        DespuésTePaso — llevá las cuentas sin romper amistades.
      </footer>
    </div>
  )
}