import { beforeEach, describe, expect, it, vi } from "vitest"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { updateTransferAlias } from "@/actions/profile"

// `vi.mock` se hoistea arriba de todo: los mocks tienen que existir antes de que
// se evalúe el import de la action, así que las dependencias se crean en
// `vi.hoisted`.
const { update } = vi.hoisted(() => ({ update: vi.fn() }))

vi.mock("@/lib/prisma", () => ({ prisma: { user: { update } } }))
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("@vercel/blob", () => ({ put: vi.fn(), del: vi.fn() }))

function signInAs(userId: string | null) {
  vi.mocked(auth).mockResolvedValue(
    userId ? ({ user: { id: userId } } as never) : (null as never),
  )
}

function lastUpdate() {
  return update.mock.calls.at(-1)?.[0]
}

beforeEach(() => {
  vi.clearAllMocks()
  update.mockResolvedValue({})
  signInAs("usr-ana")
})

describe("updateTransferAlias", () => {
  it("CASO 2: guarda el alias del usuario de la sesión", async () => {
    const result = await updateTransferAlias({ transferAlias: "tino.mp" })

    expect(result).toEqual({ ok: true })
    expect(update).toHaveBeenCalledTimes(1)
    expect(lastUpdate()).toEqual({
      where: { id: "usr-ana" },
      data: { transferAlias: "tino.mp" },
    })
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout")
  })

  it("CASO 3: reemplaza el alias anterior", async () => {
    await updateTransferAlias({ transferAlias: "tino.mp" })
    await updateTransferAlias({ transferAlias: "tino.uala" })

    expect(update).toHaveBeenCalledTimes(2)
    expect(lastUpdate()?.data).toEqual({ transferAlias: "tino.uala" })
  })

  it("CASO 4: un campo vacío borra el alias y nunca guarda cadena vacía", async () => {
    await updateTransferAlias({ transferAlias: "" })
    expect(lastUpdate()?.data).toEqual({ transferAlias: null })

    await updateTransferAlias({ transferAlias: "   " })
    expect(lastUpdate()?.data).toEqual({ transferAlias: null })
  })

  it("CASO 5: ignora el userId del cliente y sólo toca el usuario de la sesión", async () => {
    const result = await updateTransferAlias({
      transferAlias: "tino.mp",
      userId: "usr-beto",
    } as never)

    expect(result).toEqual({ ok: true })
    expect(lastUpdate()).toEqual({
      where: { id: "usr-ana" },
      data: { transferAlias: "tino.mp" },
    })
  })

  it("no guarda nada sin sesión", async () => {
    signInAs(null)

    const result = await updateTransferAlias({ transferAlias: "tino.mp" })

    expect(result).toEqual({ ok: false, error: "No hay sesión activa." })
    expect(update).not.toHaveBeenCalled()
  })

  it("rechaza formatos inválidos sin tocar la base", async () => {
    const result = await updateTransferAlias({ transferAlias: "tino mp" })

    expect(result.ok).toBe(false)
    expect(result).toEqual({
      ok: false,
      error:
        "El alias no puede tener espacios. Usá letras, números, punto, guion o guion bajo.",
    })
    expect(update).not.toHaveBeenCalled()
  })

  it("normaliza el alias con trim antes de guardarlo", async () => {
    await updateTransferAlias({ transferAlias: "  tino.mp  " })

    expect(lastUpdate()?.data).toEqual({ transferAlias: "tino.mp" })
  })
})