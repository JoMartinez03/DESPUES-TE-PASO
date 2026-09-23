"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from "@/actions/auth"
import { registerSchema } from "@/lib/validations/auth"

type FieldErrors = {
  name?: string
  username?: string
  email?: string
  password?: string
}

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFieldErrors({})
    setServerError(undefined)

    const parsed = registerSchema.safeParse({ name, username, email, password })
    if (!parsed.success) {
      const next: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors
        if (key && !next[key]) next[key] = issue.message
      }
      setFieldErrors(next)
      return
    }

    setLoading(true)
    const result = await register(parsed.data)
    if (!result.ok) {
      setLoading(false)
      setServerError(result.error)
      return
    }

    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    })
    setLoading(false)
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ServerError message={serverError} />
      <div className="space-y-1.5">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Como te conocen tus amigos"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(fieldErrors.name)}
        />
        <ErrorText message={fieldErrors.name} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          autoCapitalize="none"
          autoComplete="username"
          placeholder="ej: juanperez"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          aria-invalid={Boolean(fieldErrors.username)}
        />
        <ErrorText message={fieldErrors.username} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="vos@ejemplo.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
        />
        <ErrorText message={fieldErrors.email} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(fieldErrors.password)}
        />
        <ErrorText message={fieldErrors.password} />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : "Crear cuenta"}
      </Button>
    </form>
  )
}

function ServerError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </p>
  )
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive">{message}</p>
}