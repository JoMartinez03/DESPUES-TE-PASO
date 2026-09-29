/**
 * SMOKE ECONÓMICO — corre contra la base real (Neon) sin tocar datos ajenos.
 *
 * A diferencia de `tests/integration/*`, esta suite:
 *   - NO usa `useCleanDatabase()` (que hace TRUNCATE de todas las tablas);
 *   - crea únicamente usuarios `smoke_*` con un runId único;
 *   - borra SOLO esos usuarios al terminar (CASCADE se lleva sus amistades,
 *     transactions, gatherings, expenses y notifications).
 *
 * Para correrla:
 *   $env:SMOKE_DATABASE_URL="<url de neon>"; npm run test:smoke
 *
 * Si `SMOKE_DATABASE_URL` no está, la suite completa se saltea.
 */
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createGathering, closeGathering, updateGatheringParticipants } from "@/actions/gatherings"
import { createExpense, updateExpense, deleteExpense } from "@/actions/expenses"
import { createDebt, registerPayment, confirmPayment } from "@/actions/transactions"
import { getDashboardSummary } from "@/queries/dashboard"
import { getFriends } from "@/queries/friendships"
import {
  getGatheringTotal,
  getGatheringView,
  getHistoricalGatheringEconomics,
} from "@/queries/gatherings"
import {
  balanceBetween,
  getPendingPaymentsBetween,
  maxPayableBetween,
  netBalancesForUser,
} from "@/queries/transactions"

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

const enabled = Boolean(process.env.SMOKE_DATABASE_URL)
const describeSmoke = describe.skipIf(!enabled)

const RUN_ID = `smoke_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
const createdUserIds: string[] = []

let sequence = 0

async function createSmokeUser(name: string) {
  sequence += 1
  const user = await prisma.user.create({
    data: {
      name,
      username: `${RUN_ID}_${name.toLowerCase()}_${sequence}`,
      email: `${RUN_ID}_${sequence}@smoke.invalid`,
      password: "hash-inexistente",
    },
    select: { id: true, name: true },
  })
  createdUserIds.push(user.id)
  return user
}

async function befriend(a: string, b: string) {
  const [left, right] = [a, b].sort()
  await prisma.friendship.create({
    data: {
      requesterId: left,
      addresseeId: right,
      pairKey: `${left}:${right}`,
      status: "ACCEPTED",
    },
    select: { id: true },
  })
}

async function signInAs(userId: string) {
  vi.mocked(auth).mockResolvedValue({ user: { id: userId } } as never)
}

/**
 * Borra TODO lo que creó el smoke, en orden de dependencia.
 *
 * `transactions.debtorId/creditorId/creatorId/pendingConfirmationFromId` están
 * en `onDelete: Restrict`, así que no alcanza con borrar los usuarios: hay que
 * bajar primero transactions, gatherings, friendships y notifications.
 *
 * Todo se acota a los ids del usuario `RUN_ID`, así que datos de terceros
 * quedan intactos.
 */
/**
 * Borra TODO lo que creó el smoke, en orden de dependencia.
 *
 * Se scopea por el prefijo de username de la corrida (`RUN_ID`) y no por el
 * array en memoria, para que también funcione si el proceso se reinicia o se
 * corta: alcanza con borrar los `smoke_<runId>_*`.
 *
 * `transactions.debtorId/creditorId/creatorId/pendingConfirmationFromId` están
 * en `onDelete: Restrict`, así que no alcanza con borrar los usuarios: hay que
 * bajar primero transactions, gatherings, friendships y notifications.
 */
async function purgeRun(): Promise<void> {
  const smokeUsers = await prisma.user.findMany({
    where: { username: { startsWith: `${RUN_ID}_` } },
    select: { id: true },
  })
  const ids = smokeUsers.map((user) => user.id)
  if (ids.length === 0) {
    createdUserIds.length = 0
    return
  }
  const isSmokeUser = { in: ids }

  await prisma.transaction.deleteMany({
    where: {
      OR: [
        { creatorId: isSmokeUser },
        { debtorId: isSmokeUser },
        { creditorId: isSmokeUser },
        { pendingConfirmationFromId: isSmokeUser },
      ],
    },
  })

  // CASCADE se lleva gathering_participants, expenses, expense_participants y
  // las DEBT derivadas (Transaction.expenseId es Cascade).
  await prisma.gathering.deleteMany({
    where: {
      OR: [
        { creatorId: isSmokeUser },
        { participants: { some: { userId: isSmokeUser } } },
      ],
    },
  })

  await prisma.friendship.deleteMany({
    where: { OR: [{ requesterId: isSmokeUser }, { addresseeId: isSmokeUser }] },
  })

  await prisma.notification.deleteMany({ where: { userId: isSmokeUser } })

  await prisma.user.deleteMany({ where: { id: isSmokeUser } })

  createdUserIds.length = 0
}

let purging: Promise<void> | null = null

function purgeOnce(): Promise<void> {
  purging ??= purgeRun().finally(() => {
    purging = null
  })
  return purging
}

/**
 * Si alguien corta la corrida (Ctrl+C), `afterAll` no llega a correr y quedan
 * usuarios basura en Neon. Estos handlers limpian igual.
 */
function installSignalHandlers(): void {
  const onSignal = (signal: string) => {
    process.stderr.write(
      `\n[smoke] ${signal} recibido. Limpiando los datos de la corrida ${RUN_ID}...\n`,
    )
    purgeOnce()
      .then(() => {
        process.stderr.write("[smoke] Limpieza completa.\n")
        process.exit(130)
      })
      .catch((error: unknown) => {
        process.stderr.write(
          `[smoke] La limpieza falló: ${String(error)}\n` +
            `Quedaron usuarios ${RUN_ID}_* por borrar.\n`,
        )
        process.exit(1)
      })
  }
  process.once("SIGINT", () => onSignal("SIGINT"))
  process.once("SIGTERM", () => onSignal("SIGTERM"))
}

function number(value: { toString(): string }): number {
  return Number(value.toString())
}

/** Crea una juntada con las actions reales y devuelve su id. */
async function newGathering(name: string, participantIds: string[]) {
  const result = await createGathering({ name, participantIds })
  expect(result.ok).toBe(true)
  if (!result.ok || !result.gatheringId) {
    throw new Error(`No se pudo crear la juntada ${name}: ${result.message}`)
  }
  return result.gatheringId
}

/** Texto que ve el usuario, derivado del signo, igual que en las vistas. */
function stance(balance: { toString(): string }): string {
  const amount = number(balance)
  if (amount > 0) return "Te debe"
  if (amount < 0) return "Le debés"
  return "Al día"
}

/**
 * Neon va por internet y cada caso encadena varias queries seriales con locks
 * FOR UPDATE, así que el timeout por defecto de 20s queda corto.
 */
const SMOKE_TIMEOUT = 120_000

describeSmoke(
  "perspectiva de balances y cierre de juntadas",
  { timeout: SMOKE_TIMEOUT },
  () => {
  beforeEach(async () => {
    if (enabled) await purgeOnce()
  })

  afterAll(async () => {
    if (!enabled) return
    await purgeOnce()
    await prisma.$disconnect()
  })

  if (enabled) installSignalHandlers()

  it("CASO 1 — pagador participa: el pagador queda como acreedor", async () => {
    const jose = await createSmokeUser("Jose")
    const tino = await createSmokeUser("Tino")
    await befriend(jose.id, tino.id)

    await signInAs(jose.id)
    const gathering = await newGathering("Caso 1", [tino.id])
    const gatheringId = gathering

    const expense = await createExpense({
      gatheringId,
      title: "Pizza",
      amount: "10000",
      payerId: jose.id,
      participantIds: [jose.id, tino.id],
      splitType: "EQUAL",
    })
    expect(expense.ok).toBe(true)

    expect(number(await balanceBetween(jose.id, tino.id))).toBe(5000)
    expect(number(await balanceBetween(tino.id, jose.id))).toBe(-5000)
    expect(stance(await balanceBetween(jose.id, tino.id))).toBe("Te debe")
    expect(stance(await balanceBetween(tino.id, jose.id))).toBe("Le debés")

    const expenseRow = await prisma.expense.findFirstOrThrow({
      where: { gatheringId },
      select: { id: true },
    })
    const debt = await prisma.transaction.findFirstOrThrow({
      where: { expenseId: expenseRow.id },
    })
    expect(debt.type).toBe("DEBT")
    expect(debt.debtorId).toBe(tino.id)
    expect(debt.creditorId).toBe(jose.id)
    expect(debt.status).toBe("CONFIRMED")
    expect(number(debt.amount)).toBe(5000)
  })

  it("CASO 2 — pagador NO participa: el pagador cobra todo", async () => {
    const jose = await createSmokeUser("Jose")
    const tino = await createSmokeUser("Tino")
    await befriend(jose.id, tino.id)

    await signInAs(jose.id)
    const gatheringId = await newGathering("Caso 2", [tino.id])

    const expense = await createExpense({
      gatheringId,
      title: "Regalo",
      amount: "10000",
      payerId: jose.id,
      participantIds: [tino.id],
      splitType: "EQUAL",
    })
    expect(expense.ok).toBe(true)

    expect(number(await balanceBetween(jose.id, tino.id))).toBe(10000)
    expect(number(await balanceBetween(tino.id, jose.id))).toBe(-10000)
    expect(number(await maxPayableBetween(tino.id, jose.id))).toBe(10000)
  })

  it("CASO 3 — tres personas: José +6000, Tino -3000, Mauro -3000", async () => {
    const jose = await createSmokeUser("Jose")
    const tino = await createSmokeUser("Tino")
    const mauro = await createSmokeUser("Mauro")
    await befriend(jose.id, tino.id)
    await befriend(jose.id, mauro.id)
    await befriend(tino.id, mauro.id)

    await signInAs(jose.id)
    const gatheringId = await newGathering("Caso 3", [tino.id, mauro.id])

    const expense = await createExpense({
      gatheringId,
      title: "Cena trio",
      amount: "9000",
      payerId: jose.id,
      participantIds: [jose.id, tino.id, mauro.id],
      splitType: "EQUAL",
    })
    expect(expense.ok).toBe(true)

    expect(number(await balanceBetween(jose.id, tino.id))).toBe(3000)
    expect(number(await balanceBetween(jose.id, mauro.id))).toBe(3000)
    expect(number(await balanceBetween(tino.id, jose.id))).toBe(-3000)
    expect(number(await balanceBetween(mauro.id, jose.id))).toBe(-3000)

    // La suma económica entre todos cierra en 0. `netBalancesForUser` devuelve
    // un Map por Contacto (no incluye al propio usuario), así que la suma total
    // se arma sumando el neto de cada uno de los tres.
    const netFor = async (userId: string) => {
      const nets = await netBalancesForUser(userId)
      return [...nets.values()].reduce((acc, v) => acc + number(v), 0)
    }
    const total =
      (await netFor(jose.id)) + (await netFor(tino.id)) + (await netFor(mauro.id))
    expect(total).toBe(0)
  })

  it("CASO 4 — deudas recíprocas se compensan: José +3000", async () => {
    const jose = await createSmokeUser("Jose")
    const tino = await createSmokeUser("Tino")
    await befriend(jose.id, tino.id)

    // José registra que él pagó 5000 => Tino es el deudor y José el acreedor.
    await signInAs(jose.id)
    const manual = await createDebt({
      userId: tino.id,
      description: "Tino pago la pizza",
      amount: "5000",
      paidBy: "me",
    })
    expect(manual.ok).toBe(true)

    // José registra que Tino pagó 2000 => José es el deudor.
    const reverse = await createDebt({
      userId: tino.id,
      description: "Tino pago la coca",
      amount: "2000",
      paidBy: "friend",
    })
    expect(reverse.ok).toBe(true)

    expect(number(await balanceBetween(jose.id, tino.id))).toBe(3000)
    expect(number(await balanceBetween(tino.id, jose.id))).toBe(-3000)
    expect(stance(await balanceBetween(jose.id, tino.id))).toBe("Te debe")
    expect(stance(await balanceBetween(tino.id, jose.id))).toBe("Le debés")
  })

  it("CASO 5 — PAYMENT: PENDING no mueve el balance, CONFIRMED lo salda", async () => {
    const jose = await createSmokeUser("Jose")
    const tino = await createSmokeUser("Tino")
    await befriend(jose.id, tino.id)

    await signInAs(jose.id)
    const gatheringId = await newGathering("Caso 5", [tino.id])
    await createExpense({
      gatheringId,
      title: "Pizza",
      amount: "10000",
      payerId: jose.id,
      participantIds: [jose.id, tino.id],
      splitType: "EQUAL",
    })
    expect(number(await balanceBetween(jose.id, tino.id))).toBe(5000)

    // Tino registra el pago.
    await signInAs(tino.id)
    const payment = await registerPayment({
      userId: jose.id,
      amount: "5000",
    })
    expect(payment.ok).toBe(true)

    // Mientras está PENDING el balance confirmado no se mueve.
    expect(number(await balanceBetween(jose.id, tino.id))).toBe(5000)
    expect(number(await balanceBetween(tino.id, jose.id))).toBe(-5000)
    const pending = await getPendingPaymentsBetween(jose.id, tino.id)
    expect(pending).toHaveLength(1)
    expect(pending[0].direction).toBe("incoming")

    // José confirma.
    const pendingRow = await prisma.transaction.findFirstOrThrow({
      where: { type: "PAYMENT", status: "PENDING" },
    })
    await signInAs(jose.id)
    const confirmed = await confirmPayment({
      transactionId: pendingRow.id,
    })
    expect(confirmed.ok).toBe(true)

    expect(number(await balanceBetween(jose.id, tino.id))).toBe(0)
    expect(number(await balanceBetween(tino.id, jose.id))).toBe(0)
    expect(stance(await balanceBetween(jose.id, tino.id))).toBe("Al día")
  })

  it("CASO 6 — cerrar la juntada salda sus deudas y conserva el historial", async () => {
    const jose = await createSmokeUser("Jose")
    const tino = await createSmokeUser("Tino")
    await befriend(jose.id, tino.id)

    await signInAs(jose.id)
    const gatheringId = await newGathering("Caso 6", [tino.id])
    await createExpense({
      gatheringId,
      title: "Pizza",
      amount: "10000",
      payerId: jose.id,
      participantIds: [jose.id, tino.id],
      splitType: "EQUAL",
    })
    const expenseId = (
      await prisma.expense.findFirstOrThrow({ where: { gatheringId } })
    ).id

    expect(number(await balanceBetween(jose.id, tino.id))).toBe(5000)

    const closed = await closeGathering({ gatheringId })
    expect(closed.ok).toBe(true)

    // La deuda dejó de afectar los balances.
    expect(number(await balanceBetween(jose.id, tino.id))).toBe(0)
    expect(number(await balanceBetween(tino.id, jose.id))).toBe(0)

    // Y las DEBT derivadas se fueron.
    const derived = await prisma.transaction.count({
      where: { expenseId, type: "DEBT" },
    })
    expect(derived).toBe(0)

    // El historial sigue en pie.
    const view = await getGatheringView(gatheringId, jose.id)
    expect(view?.status).toBe("CLOSED")
    expect(view?.closedAt).not.toBeNull()
    expect(view?.expenses).toHaveLength(1)
    expect(view?.expenses[0].title).toBe("Pizza")
    expect(number(view!.expenses[0].amount)).toBe(10000)
    expect(view?.expenses[0].payer.id).toBe(jose.id)
    expect(view?.expenses[0].participants).toHaveLength(2)
    expect(number(await getGatheringTotal(gatheringId))).toBe(10000)

    const shareCount = await prisma.expenseParticipant.count({
      where: { expenseId },
    })
    expect(shareCount).toBe(2)

    // El panel histórico se reconstruye desde Expense, no desde Transaction.
    // `balanceCents` está en CENTAVOS: $5.000 = 500000 centavos.
    const history = await getHistoricalGatheringEconomics(gatheringId)
    expect(history.ok).toBe(true)
    if (history.ok) {
      const joseRow = history.balances.find((b) => b.userId === jose.id)
      const tinoRow = history.balances.find((b) => b.userId === tino.id)
      expect(joseRow?.balanceCents).toBe(500000)
      expect(tinoRow?.balanceCents).toBe(-500000)
      expect(joseRow!.balanceCents + tinoRow!.balanceCents).toBe(0)
    }
  })

  it("CASO 7 — el cierre es aislado: solo desaparecen las deudas de esa juntada", async () => {
    const jose = await createSmokeUser("Jose")
    const tino = await createSmokeUser("Tino")
    await befriend(jose.id, tino.id)

    await signInAs(jose.id)
    // DEBT manual Tino → José 2000 (José pagó, así que es acreedor)
    await createDebt({
      userId: tino.id,
      description: "Manual",
      amount: "2000",
      paidBy: "me",
    })

    // Juntada A: Tino → José 5000
    const a = await newGathering("A", [tino.id])
    await createExpense({
      gatheringId: a,
      title: "A pizza",
      amount: "10000",
      payerId: jose.id,
      participantIds: [jose.id, tino.id],
      splitType: "EQUAL",
    })

    // Juntada B: José → Tino 1000
    const b = await newGathering("B", [tino.id])
    await createExpense({
      gatheringId: b,
      title: "B coca",
      amount: "2000",
      payerId: tino.id,
      participantIds: [jose.id, tino.id],
      splitType: "EQUAL",
    })

    // +2000 (manual) +5000 (A) -1000 (B) = +6000
    expect(number(await balanceBetween(jose.id, tino.id))).toBe(6000)

    await closeGathering({ gatheringId: a })

    // +2000 (manual) +0 (A) -1000 (B) = +1000
    expect(number(await balanceBetween(jose.id, tino.id))).toBe(1000)
    expect(number(await balanceBetween(tino.id, jose.id))).toBe(-1000)

    // La DEBT manual y la de la juntada B siguen existiendo.
    // OJO: el filtro tiene que acotar al par del smoke. La base real tiene
    // deudas manuales de otros usuarios y un count global las contaría.
    const manual = await prisma.transaction.count({
      where: {
        type: "DEBT",
        expenseId: null,
        debtorId: tino.id,
        creditorId: jose.id,
      },
    })
    expect(manual).toBe(1)
    const bExpenses = await prisma.expense.findMany({
      where: { gatheringId: b },
      select: { id: true },
    })
    const bDebts = await prisma.transaction.count({
      where: { type: "DEBT", expenseId: { in: bExpenses.map((e) => e.id) } },
    })
    expect(bDebts).toBe(1)

    // Y la juntada B sigue activa.
    const bView = await getGatheringView(b, jose.id)
    expect(bView?.status).toBe("ACTIVE")
  })

  it("CASO 8 — cerrar dos veces es idempotente y no duplica notificaciones", async () => {
    const jose = await createSmokeUser("Jose")
    const tino = await createSmokeUser("Tino")
    await befriend(jose.id, tino.id)

    await signInAs(jose.id)
    const gatheringId = await newGathering("Caso 8", [tino.id])
    await createExpense({
      gatheringId,
      title: "Pizza",
      amount: "10000",
      payerId: jose.id,
      participantIds: [jose.id, tino.id],
      splitType: "EQUAL",
    })

    const first = await closeGathering({ gatheringId })
    expect(first.ok).toBe(true)
    expect(first.ok && first.code).not.toBe("already_closed")

    const closedAt = (
      await prisma.gathering.findUniqueOrThrow({ where: { id: gatheringId } })
    ).closedAt

    const second = await closeGathering({ gatheringId })
    expect(second.ok).toBe(true)
    expect(second.ok && second.code).toBe("already_closed")

    // closedAt no cambió
    const after = await prisma.gathering.findUniqueOrThrow({
      where: { id: gatheringId },
    })
    expect(after.closedAt?.getTime()).toBe(closedAt?.getTime())

    const notifications = await prisma.notification.count({
      where: { relatedGatheringId: gatheringId, title: "Juntada cerrada" },
    })
    expect(notifications).toBe(1)
  })

  it("CASO 9 — una juntada cerrada es read-only server-side", async () => {
    const jose = await createSmokeUser("Jose")
    const tino = await createSmokeUser("Tino")
    await befriend(jose.id, tino.id)

    await signInAs(jose.id)
    const gatheringId = await newGathering("Caso 9", [tino.id])
    await createExpense({
      gatheringId,
      title: "Pizza",
      amount: "10000",
      payerId: jose.id,
      participantIds: [jose.id, tino.id],
      splitType: "EQUAL",
    })
    const expenseId = (
      await prisma.expense.findFirstOrThrow({ where: { gatheringId } })
    ).id

    await closeGathering({ gatheringId })

    const created = await createExpense({
      gatheringId,
      title: "Extra",
      amount: "1000",
      payerId: jose.id,
      participantIds: [jose.id, tino.id],
      splitType: "EQUAL",
    })
    expect(created).toMatchObject({ ok: false, code: "closed" })

    const updated = await updateExpense({
      expenseId,
      gatheringId,
      title: "Cambiado",
      amount: "10000",
      payerId: jose.id,
      participantIds: [jose.id, tino.id],
      splitType: "EQUAL",
    })
    expect(updated).toMatchObject({ ok: false, code: "closed" })

    const removed = await deleteExpense({ expenseId })
    expect(removed.ok).toBe(false)

    const participants = await updateGatheringParticipants({
      gatheringId,
      participantIds: [jose.id],
    })
    expect(participants.ok).toBe(false)

    // Nada cambió: sigue el mismo gasto con el mismo monto.
    const still = await prisma.expense.findUniqueOrThrow({
      where: { id: expenseId },
      select: { title: true, amount: true },
    })
    expect(still.title).toBe("Pizza")
    expect(number(still.amount)).toBe(10000)
  })

  it("CASO 10 — dashboard antes y después del cierre", async () => {
    const jose = await createSmokeUser("Jose")
    const tino = await createSmokeUser("Tino")
    await befriend(jose.id, tino.id)

    await signInAs(jose.id)
    const gatheringId = await newGathering("Caso 10", [tino.id])
    await createExpense({
      gatheringId,
      title: "Pizza",
      amount: "10000",
      payerId: jose.id,
      participantIds: [jose.id, tino.id],
      splitType: "EQUAL",
    })

    const before = await getDashboardSummary(jose.id)
    expect(number(before.owed)).toBe(5000)
    expect(number(before.owe)).toBe(0)

    await closeGathering({ gatheringId })

    const after = await getDashboardSummary(jose.id)
    expect(number(after.owed)).toBe(0)
    expect(number(after.owe)).toBe(0)
  })

  it("CASO 11 — /personas antes y después del cierre muestra el saldo restante", async () => {
    const jose = await createSmokeUser("Jose")
    const tino = await createSmokeUser("Tino")
    await befriend(jose.id, tino.id)

    await signInAs(jose.id)
    // Deuda manual que NO debe verse afectada: Tino → José 2000
    await createDebt({
      userId: tino.id,
      description: "Manual",
      amount: "2000",
      paidBy: "me",
    })
    // Juntada A: 5000
    const a = await newGathering("A", [tino.id])
    await createExpense({
      gatheringId: a,
      title: "A pizza",
      amount: "10000",
      payerId: jose.id,
      participantIds: [jose.id, tino.id],
      splitType: "EQUAL",
    })
    // Juntada B: -1000
    const b = await newGathering("B", [tino.id])
    await createExpense({
      gatheringId: b,
      title: "B coca",
      amount: "2000",
      payerId: tino.id,
      participantIds: [jose.id, tino.id],
      splitType: "EQUAL",
    })

    const friendsBefore = await getFriends(jose.id)
    const cardBefore = friendsBefore.find((f) => f.id === tino.id)
    expect(number(cardBefore!.balance.amount)).toBe(6000)
    expect(stance(cardBefore!.balance.amount)).toBe("Te debe")

    const tinoBefore = await getFriends(tino.id)
    const tinoCard = tinoBefore.find((f) => f.id === jose.id)
    expect(number(tinoCard!.balance.amount)).toBe(-6000)
    expect(stance(tinoCard!.balance.amount)).toBe("Le debés")

    await closeGathering({ gatheringId: a })

    // Solo queda el saldo manual menos la juntada B.
    const friendsAfter = await getFriends(jose.id)
    const cardAfter = friendsAfter.find((f) => f.id === tino.id)
    expect(number(cardAfter!.balance.amount)).toBe(1000)
    expect(stance(cardAfter!.balance.amount)).toBe("Te debe")

    const tinoAfter = await getFriends(tino.id)
    const tinoCardAfter = tinoAfter.find((f) => f.id === jose.id)
    expect(number(tinoCardAfter!.balance.amount)).toBe(-1000)
    expect(stance(tinoCardAfter!.balance.amount)).toBe("Le debés")
  })
  },
)
