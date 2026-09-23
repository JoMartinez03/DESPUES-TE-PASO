"use server"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signOut } from "@/lib/auth"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth"

type RegisterResult = { ok: true } | { ok: false; error: string }

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  )
}

export async function register(input: RegisterInput): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Revisá los datos ingresados" }
  }

  const { name, username, email, password } = parsed.data

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { email: true },
    })
    if (existing) {
      return {
        ok: false,
        error:
          existing.email === email
            ? "Ya existe una cuenta con ese email"
            : "Ese username ya está en uso",
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    await prisma.user.create({
      data: { name, username, email, password: hashedPassword },
    })

    return { ok: true }
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "Ya existe una cuenta con ese email o username" }
    }
    console.error("Error al registrar usuario", error)
    return { ok: false, error: "No pudimos crear la cuenta. Intentá de nuevo." }
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" })
}