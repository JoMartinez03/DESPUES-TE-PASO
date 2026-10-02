import { LogOut } from "lucide-react"
import { notFound } from "next/navigation"
import { logout } from "@/actions/auth"
import { PageHeader } from "@/components/shared/page-header"
import { NicknameForm } from "@/components/profile/nickname-form"
import { ProfilePhoto } from "@/components/profile/profile-photo"
import { PushNotificationsCard } from "@/components/profile/push-notifications"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { formatDate } from "@/lib/format"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"
import { getProfileUser } from "@/queries/profile"

export default async function PerfilPage() {
  await requireUser()
  const session = await auth()
  const user = session!.user

  const profile = await getProfileUser(user.id)
  if (!profile) notFound()

  // Estado inicial de la tarjeta de notificaciones push. El detalle de si ESTE
  // dispositivo está suscrito lo responde el navegador en el cliente.
  const pushDevices = await prisma.pushSubscription.count({
    where: { userId: user.id },
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Perfil" />

      <Card className="rounded-2xl">
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          <UserAvatar
            name={profile.name}
            avatar={profile.avatar}
            size="xl"
            className="[&_[data-slot=avatar-fallback]]:text-lg"
          />
          <ProfilePhoto hasAvatar={Boolean(profile.avatar)} />
          <NicknameForm name={profile.name} />
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardContent className="flex flex-col items-start gap-3 py-6">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Notificaciones
            </h2>
            <p className="text-sm text-muted-foreground">
              Recibí avisos cuando tus amigos registren deudas o pagos.
            </p>
          </div>
          <PushNotificationsCard subscribedDevices={pushDevices} />
        </CardContent>
      </Card>

      <dl className="space-y-2">
        <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
          <dt className="text-sm text-muted-foreground">Miembro desde</dt>
          <dd className="text-sm font-medium text-foreground">
            {formatDate(profile.createdAt)}
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