import { requireUser } from "@/lib/session"
import { getGatheringsForUser } from "@/queries/gatherings"
import { getFriendSummaries } from "@/queries/friendships"
import { JuntadasList } from "@/components/gatherings/juntadas-list"

export default async function JuntadasPage() {
  const user = await requireUser()
  const [gatherings, friends] = await Promise.all([
    getGatheringsForUser(user.id),
    getFriendSummaries(user.id),
  ])

  return <JuntadasList gatherings={gatherings} friends={friends} />
}