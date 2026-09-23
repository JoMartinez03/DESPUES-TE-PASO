import { LogOut } from "lucide-react"
import { logout } from "@/actions/auth"
import { PageHeader } from "@/components/shared/page-header"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { formatDate } from "@/lib/format"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

export default async function PerfilPage() {
  await requireUser()
  const session = await auth()
  const user = session!.user

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      username: true,
      email: true,
      avatar: true,
      createdAt: true,
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Perfil" />

      <Card className="rounded-2xl">
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          <UserAvatar
            name={profile?.name ?? "Usuario"}
            avatar={profile?.avatar}
            size="lg"
            className="[&_[data-slot=avatar-fallback]]:text-lg"
          />
          <div className="space-y-1">
            <p className="flex flex-wrap items-center justify-center gap-2">
              <span className="font-heading text-xl font-semibold text-foreground">
                {profile?.name}
              </span>
              {profile ? (
                <Badge variant="secondary" className="text-xs">
                  @{profile.username}
                </Badge>
              ) : null}
            </p>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>
        </CardContent>
      </Card>

      <dl className="space-y-2">
        <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
          <dt className="text-sm text-muted-foreground">Miembro desde</dt>
          <dd className="text-sm font-medium text-foreground">
            {profile ? formatDate(profile.createdAt) : "—"}
          </dd>
        </div>
      </dl>

      <form action={logout}>
        <Button
          type="submit"
          variant="destructive"
          size="lg"
          className="w-full"
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </Button>
      </form>
    </div>
  )
}