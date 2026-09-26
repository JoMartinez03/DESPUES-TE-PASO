"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { Loader2, Search, UserPlus, Users } from "lucide-react"
import { searchUsersAction, sendFriendRequest } from "@/actions/friendships"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { UserAvatar } from "@/components/shared/user-avatar"
import { toast } from "@/components/ui/toast"
import type { SearchResult } from "@/queries/friendships"
import type { RelativeFriendshipStatus } from "@/lib/friendship"

type SearchState = "idle" | "loading" | "done"

function StatusBadge({ status }: { status: RelativeFriendshipStatus }) {
  if (status === "friends") return <Badge variant="outline">Amigos</Badge>
  if (status === "outgoing") return <Badge variant="secondary">Solicitud enviada</Badge>
  if (status === "incoming")
    return <Badge variant="secondary">Te envió una solicitud</Badge>
  return null
}

export function AddFriendSheet() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [searchState, setSearchState] = useState<SearchState>("idle")
  const [error, setError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Cierra la ventana entre dos clicks del mismo tick, que el estado todavía
  // no refleja. El backend igual deduplica la notificación.
  const lockedRef = useRef(false)
  const [, startTransition] = useTransition()

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  function handleSearch(value: string) {
    setQuery(value)
    const term = value.trim()
    if (timerRef.current) clearTimeout(timerRef.current)

    if (term.length < 2) {
      setResults([])
      setSearchState("idle")
      setError(null)
      return
    }

    setSearchState("loading")
    timerRef.current = setTimeout(() => {
      startTransition(async () => {
        try {
          const found = await searchUsersAction({ query: term })
          setResults(found)
          setSearchState("done")
          setError(null)
        } catch {
          setResults([])
          setSearchState("done")
          setError("No pudimos buscar. Intentá de nuevo.")
        }
      })
    }, 300)
  }

  function updateStatus(userId: string, status: RelativeFriendshipStatus) {
    setResults((prev) =>
      prev.map((result) => (result.id === userId ? { ...result, status } : result)),
    )
  }

  async function handleAdd(user: SearchResult) {
    if (lockedRef.current) return
    lockedRef.current = true
    setPendingId(user.id)
    try {
      const result = await sendFriendRequest({ userId: user.id })
      if (result.ok) {
        updateStatus(user.id, "outgoing")
        toast({
          title: "Solicitud enviada",
          description: result.message,
        })
      } else {
        if (result.code === "incoming_exists") updateStatus(user.id, "incoming")
        if (result.code === "already_friends") updateStatus(user.id, "friends")
        toast({ description: result.message })
      }
    } catch {
      toast({ description: "No pudimos enviar la solicitud. Intentá de nuevo." })
    } finally {
      lockedRef.current = false
      setPendingId(null)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button size="sm" className="gap-1.5" />}
      >
        <UserPlus className="size-4" />
        Agregar amigo
      </SheetTrigger>
      <SheetContent side="bottom" className="gap-0 rounded-t-2xl p-0 sm:mx-auto sm:max-w-md">
        <SheetHeader className="p-5 pb-2">
          <SheetTitle>Agregar amigo</SheetTitle>
          <SheetDescription>Buscá a tus amigos por nombre o username.</SheetDescription>
        </SheetHeader>
        <div className="space-y-3 p-5 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="friend-search">Buscar</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="friend-search"
                placeholder="ej: juan"
                className="pl-9"
                value={query}
                onChange={(event) => handleSearch(event.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[50dvh] overflow-y-auto">
            {searchState === "loading" ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Buscando…
              </div>
            ) : searchState === "idle" ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
                <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Users className="size-5" />
                </span>
                Escribí al menos 2 letras para buscar.
              </div>
            ) : error ? (
              <p className="py-8 text-center text-sm text-destructive">{error}</p>
            ) : results.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No encontramos a nadie con «{query.trim()}».
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {results.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                  >
                    <UserAvatar name={user.name} avatar={user.avatar} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
                    </div>
                    <StatusBadge status={user.status} />
                    {user.status === "none" ? (
                      <Button
                        size="sm"
                        onClick={() => handleAdd(user)}
                        disabled={pendingId === user.id || pendingId !== null}
                      >
                        {pendingId === user.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          "Agregar"
                        )}
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}