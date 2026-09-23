import Link from "next/link"
import { PartyPopper, Plus } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"

export default function JuntadasPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Juntadas"
        description="Gastos y vueltos compartidos en grupo."
        action={
          <Button size="sm" className="gap-1.5" render={<Link href="/juntadas/nueva" />}>
            <Plus className="size-4" />
            Nueva juntada
          </Button>
        }
      />

      <EmptyState
        icon={PartyPopper}
        title="Todavía no participás de ninguna juntada"
        description="Organizá una para dividir gastos con tus amigos sin vueltas."
        action={
          <Button render={<Link href="/juntadas/nueva" />}>
            <Plus className="size-4" />
            Nueva juntada
          </Button>
        }
      />
    </div>
  )
}