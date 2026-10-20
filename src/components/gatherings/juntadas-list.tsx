import { PartyPopper } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { CreateGatheringSheet } from "@/components/gatherings/create-gathering-sheet"
import { GatheringCard } from "@/components/gatherings/gathering-card"
import type {
  GatheringCard as GatheringCardData,
} from "@/queries/gatherings"
import type { UserSummary } from "@/queries/friendships"

export function JuntadasList({
  gatherings,
  friends,
  showCreateAction = true,
}: {
  gatherings: GatheringCardData[]
  friends: UserSummary[]
  showCreateAction?: boolean
}) {
  const isEmpty = gatherings.length === 0
  // Con la lista vacía el CTA vive dentro del empty state: así no aparece dos
  // veces el mismo botón "Nueva juntada" en pantalla.
  const showHeaderAction = showCreateAction && !isEmpty

  return (
    <div className="space-y-6">
      <PageHeader
        title="Juntadas"
        description="Gastos y vueltos compartidos en grupo."
        action={
          showHeaderAction ? (
            <CreateGatheringSheet friends={friends} triggerVariant="sm" />
          ) : undefined
        }
      />

      {isEmpty ? (
        <EmptyState
          icon={PartyPopper}
          title="Todavía no hay juntadas"
          description="Creá una para dividir los gastos con tus amigos."
          action={
            showCreateAction ? (
              <CreateGatheringSheet friends={friends} triggerVariant="default" />
            ) : undefined
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {gatherings.map((gathering) => (
            <li key={gathering.id}>
              <GatheringCard gathering={gathering} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}