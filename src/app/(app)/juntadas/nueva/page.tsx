import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { CalendarPlus } from "lucide-react"

export default function NuevaJuntadaPage() {
  return (
    <div className="space-y-6">
      <PageHeader backHref="/juntadas" title="Nueva juntada" />

      <Card className="rounded-2xl">
        <CardContent className="space-y-4">
          <EmptyState
            icon={CalendarPlus}
            title="Crear juntadas llegará pronto"
            description="Dejamos el lugar preparado para que armes juntadas con tus amigos y dividan los gastos."
          />
          <div className="flex justify-center">
            <Badge variant="secondary">Próximamente</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}