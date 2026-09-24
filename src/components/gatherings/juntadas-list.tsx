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
  return (
    <div className="space-y-6">
      <PageHeader
        title="Juntadas"
        description="Gastos y vueltos compartidos en grupo."
        action={
          showCreateAction ? (
            <CreateGatheringSheet friends={friends} triggerVariant="sm" />
          ) : undefined
        }
      />

      {gatherings.length === 0 ? (
        <EmptyState
          icon={PartyPopper}
          title="Todavía no participás de ninguna juntada"
          description="Organizá una para dividir gastos con tus amigos sin vueltas."
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