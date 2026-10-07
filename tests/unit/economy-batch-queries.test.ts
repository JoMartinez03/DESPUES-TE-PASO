import { beforeEach, describe, expect, it, vi } from "vitest"
import { Prisma } from "@/generated/prisma"
import { maxPayableFrom, sumPendingOutgoing, sumSigned } from "@/lib/transactions"
import type { BalanceRow } from "@/lib/transactions"

const {
  friendshipFindMany,
  transactionFindMany,
  transactionGroupBy,
  transactionCount,
  transactionAggregate,
} = vi.hoisted(() => ({
  friendshipFindMany: vi.fn(),
  transactionFindMany: vi.fn(),
  transactionGroupBy: vi.fn(),
  transactionCount: vi.fn(),
  transactionAggregate: vi.fn(),
}))

vi.mock("@/lib/prisma", () => ({
  prisma: {
    friendship: { findMany: friendshipFindMany },
    transaction: {
      findMany: transactionFindMany,
      groupBy: transactionGroupBy,
      count: transactionCount,
      aggregate: transactionAggregate,
    },
  },
}))

const { getQuickTransactionOptions, getFriends, getFriendSummaries } =
  await import("@/queries/friendships")
const { getDashboardSummary, summarizeBalances } = await import(
  "@/queries/dashboard"
)
const { netBalancesForUser, maxPayableBetween, balanceBetween } = await import(
  "@/queries/transactions"
)

const ANA = "usr-ana"
const TINO = "usr-tino"
const CARO = "usr-caro"
const LUIS = "usr-luis"
const MAURO = "usr-mauro"

const dec = (value: string) => new Prisma.Decimal(value)

type Pair = { debtorId: string; creditorId: string }

function userSummary(id: string) {
  return {
    id,
    name: id.replace("usr-", ""),
    username: id.replace("usr-", ""),
    avatar: null,
  }
}

function friendshipRow(requesterId: string, addresseeId: string) {
  return {
    id: `f-${requesterId}-${addresseeId}`,
    requesterId,
    addresseeId,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-02"),
    requester: { ...userSummary(requesterId), transferAlias: null },
    addressee: { ...userSummary(addresseeId), transferAlias: null },
  }
}

function row(
  type: "DEBT" | "PAYMENT",
  debtorId: string,
  creditorId: string,
  amount: string,
): BalanceRow {
  return { type, debtorId, creditorId, amount: dec(amount) }
}

/**
 * Dataset con un caso por regla de `maxPayable`, con la convención de balances
 * de src/lib/transactions.ts (deudor negativo, acreedor positivo):
 *
 * - ANA ↔ TINO: ANA debe 5000, TINO le confirma un pago de 1000 y le debe 500
 *   a Ana. Balance de Ana = -5000 - 1000 + 500 = -5500. Con 2000 pendiente
 *   saliente => max 3500.
 * - ANA ↔ CARO: ANA debe 10000, sin pendientes => max 10000.
 * - ANA ↔ LUIS: Luis debe 4000 a Ana => balance positivo, sin pago posible.
 * - ANA ↔ MAURO: ANA debe 7000 con 9000 pendiente => 0 (nunca negativo).
 */
let friendships: ReturnType<typeof friendshipRow>[]
let confirmedRows: BalanceRow[]
let pendingOutgoing: Map<string, Prisma.Decimal>
let incomingConfirmations: Array<{
  id: string
  amount: Prisma.Decimal
  currency: string
  debtor: ReturnType<typeof userSummary>
}>

function pendingRow(debtorId: string, creditorId: string, amount: string): BalanceRow {
  return row("PAYMENT", debtorId, creditorId, amount)
}

function matchesClauses(
  pair: Pair,
  clauses: Array<Partial<Pair>>,
): boolean {
  return clauses.some((clause) =>
    Object.entries(clause).every(
      ([field, value]) => pair[field as keyof Pair] === value,
    ),
  )
}

beforeEach(() => {
  vi.clearAllMocks()

  friendships = [
    friendshipRow(ANA, TINO),
    friendshipRow(CARO, ANA),
    friendshipRow(ANA, LUIS),
    friendshipRow(ANA, MAURO),
  ]

  confirmedRows = [
    row("DEBT", ANA, TINO, "5000"),
    row("DEBT", ANA, CARO, "10000"),
    row("DEBT", LUIS, ANA, "4000"),
    row("DEBT", ANA, MAURO, "7000"),
    row("PAYMENT", TINO, ANA, "1000"),
    row("DEBT", TINO, ANA, "500"),
  ]

  pendingOutgoing = new Map([
    [TINO, dec("2000")],
    [MAURO, dec("9000")],
  ])

  // Pagos PENDING que Ana debe confirmar (el remitente registró el pago).
  incomingConfirmations = [
    {
      id: "txn-conf-1",
      amount: dec("5000"),
      currency: "ARS",
      debtor: userSummary(TINO),
    },
    {
      id: "txn-conf-2",
      amount: dec("1500"),
      currency: "ARS",
      debtor: userSummary(MAURO),
    },
  ]

  friendshipFindMany.mockResolvedValue(friendships)

  // Mock fiel a los filtros de las queries reales, para que el lote y las
  // consultas por par operen sobre el mismo conjunto de filas.
  transactionFindMany.mockImplementation(async (args: { where?: Record<string, unknown> }) => {
    const where = (args.where ?? {}) as {
      status?: string
      type?: string
      OR?: Array<Partial<Pair>>
    }
    const clauses = where.OR ?? []

    if (where.type === "PAYMENT" && where.status === "PENDING") {
      // Listado de confirmaciones entrantes: filas con `debtor` poblado.
      if ("pendingConfirmationFromId" in where) {
        return incomingConfirmations.map((row) => ({ ...row }))
      }
      const out: BalanceRow[] = []
      for (const [creditorId, amount] of pendingOutgoing) {
        if (matchesClauses({ debtorId: ANA, creditorId }, clauses)) {
          out.push(pendingRow(ANA, creditorId, amount.toString()))
        }
      }
      return out
    }

    let result = confirmedRows
    if (clauses.length) {
      result = result.filter((r) => matchesClauses(r, clauses))
    }
    return result.map((r) => ({ ...r }))
  })

  transactionGroupBy.mockImplementation(async () =>
    [...pendingOutgoing.entries()].map(([creditorId, amount]) => ({
      creditorId,
      _sum: { amount },
    })),
  )

  transactionCount.mockResolvedValue(0)

  transactionAggregate.mockImplementation(
    async (args: { where: { debtorId: string; creditorId: string } }) => ({
      _sum: { amount: pendingOutgoing.get(args.where.creditorId) ?? dec("0") },
    }),
  )
})

/**
 * Implementación de referencia del cálculo ANTERIOR (dos consultas por amigo):
 * balance del par + SUM de los pagos PENDING salientes.
 */
function legacyMaxPayable(
  userId: string,
  friendId: string,
): Prisma.Decimal {
  const pair = confirmedRows.filter(
    (r) =>
      (r.debtorId === userId && r.creditorId === friendId) ||
      (r.debtorId === friendId && r.creditorId === userId),
  )
  return maxPayableFrom(
    sumSigned(pair, userId),
    pendingOutgoing.get(friendId) ?? dec("0"),
  )
}

describe("getQuickTransactionOptions · sin N+1", () => {
  it("resuelve TODOS los amigos con 3 consultas fijas", async () => {
    await getQuickTransactionOptions(ANA)

    expect(friendshipFindMany).toHaveBeenCalledTimes(1)
    expect(transactionFindMany).toHaveBeenCalledTimes(1)
    expect(transactionGroupBy).toHaveBeenCalledTimes(1)
    // La consulta por amigo que existía antes (aggregate por par).
    expect(transactionAggregate).not.toHaveBeenCalled()
  })

  it("mantiene 3 consultas con 10 amigos y también con 1 amigo", async () => {
    friendshipFindMany.mockResolvedValue(
      Array.from({ length: 10 }, (_, index) => friendshipRow(ANA, `usr-${index}`)),
    )

    await getQuickTransactionOptions(ANA)
    expect(transactionFindMany).toHaveBeenCalledTimes(1)
    expect(transactionGroupBy).toHaveBeenCalledTimes(1)

    vi.clearAllMocks()
    friendshipFindMany.mockResolvedValue([friendshipRow(ANA, TINO)])
    await getQuickTransactionOptions(ANA)
    expect(transactionFindMany).toHaveBeenCalledTimes(1)
    expect(transactionGroupBy).toHaveBeenCalledTimes(1)
  })

  it("pide los pendientes como UNA agregación por acreedor", async () => {
    await getQuickTransactionOptions(ANA)

    expect(transactionGroupBy).toHaveBeenCalledWith({
      by: ["creditorId"],
      where: { type: "PAYMENT", status: "PENDING", debtorId: ANA },
      _sum: { amount: true },
    })
  })
})

describe("getQuickTransactionOptions · misma semántica que el cálculo por amigo", () => {
  it("produce el mismo maxPayable que la referencia para cada amigo", async () => {
    const { friends, payments } = await getQuickTransactionOptions(ANA)

    expect(friends.map((f) => f.id)).toEqual([TINO, CARO, LUIS, MAURO])

    const expected = friendships
      .map((f) => (f.requesterId === ANA ? f.addressee : f.requester))
      .map((friend) => ({
        id: friend.id,
        maxPayable: legacyMaxPayable(ANA, friend.id),
      }))
      .filter((option) => option.maxPayable.gt(0))

    expect(payments.map((p) => p.id)).toEqual(expected.map((e) => e.id))
    expect(payments.map((p) => p.maxPayable)).toEqual(
      expected.map((e) => e.maxPayable.toFixed(2)),
    )
  })

  it("casos concretos: Tino 3500, Caro 10000, Luis y Mauro fuera de pagos", async () => {
    const { payments } = await getQuickTransactionOptions(ANA)
    const byId = new Map(payments.map((p) => [p.id, p.maxPayable]))

    expect(byId.get(TINO)).toBe("3500.00")
    expect(byId.get(CARO)).toBe("10000.00")
    // Luis le debe a Ana: no hay nada que pagarle.
    expect(byId.has(LUIS)).toBe(false)
    // El pendiente de Mauro supera la deuda.
    expect(byId.has(MAURO)).toBe(false)
  })

  it("el pago PENDING se descuenta del máximo", () => {
    const derived = maxPayableFrom(
      dec("-5500"),
      sumPendingOutgoing([{ direction: "outgoing", amount: dec("2000") }]),
    )
    expect(derived).toEqual(dec("3500"))
  })

  it("un pendiente mayor que la deuda deja el máximo en 0, nunca negativo", () => {
    const derived = maxPayableFrom(
      dec("-7000"),
      sumPendingOutgoing([{ direction: "outgoing", amount: dec("9000") }]),
    )
    expect(derived).toEqual(dec("0"))
  })

  it("un saldo POSITIVO no genera opción de pago", () => {
    expect(maxPayableFrom(dec("4000"), sumPendingOutgoing([]))).toEqual(dec("0"))
  })

  it("los pagos RECIBIDOS no descuentan el máximo", () => {
    expect(
      sumPendingOutgoing([
        { direction: "incoming", amount: dec("5000") },
        { direction: "outgoing", amount: dec("1000") },
      ]),
    ).toEqual(dec("1000"))
  })

  it("no hay compensación entre amigos distintos", async () => {
    const { payments } = await getQuickTransactionOptions(ANA)
    const byId = new Map(payments.map((p) => [p.id, p.maxPayable]))

    // La deuda con Tino no reduce el máximo con Caro, ni al revés.
    expect(byId.get(CARO)).toBe("10000.00")
    expect(byId.get(TINO)).toBe("3500.00")
  })

  it("redondea a dos decimales igual que antes", async () => {
    confirmedRows = [
      row("DEBT", ANA, TINO, "33.333"),
      row("DEBT", ANA, CARO, "10.005"),
    ]
    pendingOutgoing = new Map()

    const { payments } = await getQuickTransactionOptions(ANA)
    const byId = new Map(payments.map((p) => [p.id, p.maxPayable]))

    expect(byId.get(TINO)).toBe(legacyMaxPayable(ANA, TINO).toFixed(2))
    expect(byId.get(CARO)).toBe(legacyMaxPayable(ANA, CARO).toFixed(2))
  })
})

describe("/personas/[id] · maxPayable derivado sin releer transacciones", () => {
  it("el derivado desde la lista de pendientes iguala a maxPayableBetween", async () => {
    const legacy = await maxPayableBetween(ANA, TINO)

    // Camino nuevo: el mismo balance + los pendientes que ya trajo la lista.
    const balance = await balanceBetween(ANA, TINO)
    const pendingPayments = [
      { direction: "outgoing" as const, amount: dec("1000") },
      { direction: "outgoing" as const, amount: dec("1000") },
    ]

    const derived = maxPayableFrom(balance, sumPendingOutgoing(pendingPayments))

    expect(derived).toEqual(legacy)
    expect(derived).toEqual(dec("3500"))
  })

  it("el balance del par se lee una sola vez (misma query, sin repetidos)", async () => {
    await balanceBetween(ANA, TINO)
    expect(transactionFindMany).toHaveBeenCalledTimes(1)
    expect(transactionFindMany.mock.calls[0][0].where).toEqual({
      status: "CONFIRMED",
      OR: [
        { debtorId: ANA, creditorId: TINO },
        { debtorId: TINO, creditorId: ANA },
      ],
    })
  })

  it("sin pendientes el máximo es la deuda completa", () => {
    expect(maxPayableFrom(dec("-2500"), sumPendingOutgoing([]))).toEqual(dec("2500"))
  })

  it("con saldo a favor no hay nada que pagar", () => {
    expect(maxPayableFrom(dec("2500"), sumPendingOutgoing([]))).toEqual(dec("0"))
  })
})

describe("dashboard · una sola fuente económica", () => {
  it("el resumen sale de los mismos balances que la lista de amigos", async () => {
    const [summary, friends] = await Promise.all([
      getDashboardSummary(ANA),
      getFriends(ANA),
    ])

    const derived = summarizeBalances(
      new Map(friends.map((f) => [f.id, f.balance.amount])),
    )

    expect(summary.owed).toEqual(derived.owed)
    expect(summary.owe).toEqual(derived.owe)
  })

  it("los valores por amigo coinciden con las StatCards", async () => {
    const balances = await netBalancesForUser(ANA)
    const summary = summarizeBalances(balances)

    expect(balances.get(TINO)).toEqual(dec("-5500"))
    expect(balances.get(CARO)).toEqual(dec("-10000"))
    expect(balances.get(LUIS)).toEqual(dec("4000"))
    expect(balances.get(MAURO)).toEqual(dec("-7000"))

    // "Te deben": solo Luis (4000). "Debés": Tino + Caro + Mauro (22500).
    expect(summary.owed).toEqual(dec("4000"))
    expect(summary.owe).toEqual(dec("22500"))
  })

  it("resumen y lista piden los balances con la MISMA query", async () => {
    await getDashboardSummary(ANA)
    const summaryQuery = transactionFindMany.mock.calls[0][0]

    vi.clearAllMocks()
    await getFriends(ANA)
    const friendsQuery = transactionFindMany.mock.calls[0][0]

    // Al pasar por el mismo `netBalancesForUser` (envuelto en `cache()` de React),
    // dentro de un render estas dos llamadas se resuelven con una sola lectura.
    expect(friendsQuery).toEqual(summaryQuery)
    expect(summaryQuery.where).toEqual({
      status: "CONFIRMED",
      OR: [{ debtorId: ANA }, { creditorId: ANA }],
    })
  })

  it("toConfirm y la Card salen del MISMO listado: una query, sin count, sin N+1", async () => {
    const summary = await getDashboardSummary(ANA)

    // Fuente única: el conteo es la longitud del listado.
    expect(summary.confirmations).toHaveLength(2)
    expect(summary.toConfirm).toBe(summary.confirmations.length)

    // balances + confirmaciones = 2 lecturas fijas; jamás un count por fila.
    expect(transactionFindMany).toHaveBeenCalledTimes(2)
    expect(transactionCount).not.toHaveBeenCalled()

    const confirmationQuery = transactionFindMany.mock.calls[1][0]
    expect(confirmationQuery.where).toEqual({
      type: "PAYMENT",
      status: "PENDING",
      pendingConfirmationFromId: ANA,
    })
    // El remitente viene poblado en la MISMA query: sin lecturas por fila.
    expect(confirmationQuery.select).toEqual({
      id: true,
      amount: true,
      currency: true,
      debtor: { select: { id: true, name: true, username: true, avatar: true } },
    })
    expect(summary.confirmations.map((c) => c.payer.id)).toEqual([
      TINO,
      MAURO,
    ])
  })

  it("sin pagos por confirmar: toConfirm = 0 y lista vacía", async () => {
    incomingConfirmations = []
    const summary = await getDashboardSummary(ANA)

    expect(summary.toConfirm).toBe(0)
    expect(summary.confirmations).toHaveLength(0)
    expect(transactionCount).not.toHaveBeenCalled()
  })

  it("los amigos con saldo 0 no suman a ninguna tarjeta", () => {
    const result = summarizeBalances(
      new Map([
        [TINO, dec("0")],
        [CARO, dec("-500")],
      ]),
    )

    expect(result.owed).toEqual(dec("0"))
    expect(result.owe).toEqual(dec("500"))
  })
})

describe("cache() · sólo deduplicación dentro del request", () => {
  it("fuera de un render de React no memoriza: cada llamada vuelve a leer", async () => {
    await netBalancesForUser(ANA)
    await netBalancesForUser(ANA)
    expect(transactionFindMany).toHaveBeenCalledTimes(2)

    vi.clearAllMocks()
    friendshipFindMany.mockResolvedValue(friendships)
    await getFriendSummaries(ANA)
    await getFriendSummaries(ANA)
    expect(friendshipFindMany).toHaveBeenCalledTimes(2)
  })

  it("la clave es el userId: dos usuarios no comparten balances", async () => {
    await netBalancesForUser(ANA)
    await netBalancesForUser(TINO)

    const queried = transactionFindMany.mock.calls.map((call) => call[0].where)
    expect(queried).toHaveLength(2)
    expect(queried[0].OR).toEqual([{ debtorId: ANA }, { creditorId: ANA }])
    expect(queried[1].OR).toEqual([{ debtorId: TINO }, { creditorId: TINO }])
  })

  it("el lote y el resumen del dashboard leen los mismos balances", async () => {
    const [quick, summary] = await Promise.all([
      getQuickTransactionOptions(ANA),
      getDashboardSummary(ANA),
    ])

    const owedByFriend = new Map(
      quick.payments.map((p) => [p.id, dec(p.maxPayable)]),
    )
    // Caro debe 10000 y no tiene pagos registrados => su máximo es la deuda.
    expect(owedByFriend.get(CARO)).toEqual(dec("10000"))
    expect(summary.owe).toEqual(dec("22500"))
    expect(summary.owed).toEqual(dec("4000"))
  })
})
