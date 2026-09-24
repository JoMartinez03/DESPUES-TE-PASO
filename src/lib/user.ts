import type { Session } from "next-auth"

export type SessionUser = Session["user"]

export type CurrentUser = {
  id: string
  name: string
  avatar: string | null
}