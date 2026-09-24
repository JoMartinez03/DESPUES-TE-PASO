import { Prisma } from "@/generated/prisma"

/**
 * Filas mínimas de Transaction necesarias para calcular balances.
 */
export type BalanceRow = {
  type: "DEBT" | "PAYMENT"
  debtorId: string
  creditorId: string
  amount: Prisma.Decimal
}

/**
 * Convención de balance (desde la perspectiva de `userId`):
 *
 *   balance > 0  => el otro usuario le debe a `userId`
 *   balance < 0  => `userId` le debe al otro usuario
 *   balance = 0  => están al día
 *
 * Solo deben considerarse movimientos CONFIRMED. Los DEBT suman a favor
 * de quien prestó; los PAYMENT se invierten: quien paga reduce su deuda.
 */
export function signedAmounts(
  rows: BalanceRow[],
  userId: string,
): Prisma.Decimal[] {
  const amounts: Prisma.Decimal[] = []
  for (const row of rows) {
    const value = new Prisma.Decimal(row.amount)
    if (row.type === "DEBT") {
      // El deudor le debe al acreedor.
      if (row.creditorId === userId) amounts.push(value)
      else if (row.debtorId === userId) amounts.push(value.negated())
    } else {
      // PAYMENT: el deudor pagó y aliviana su cuenta.
      if (row.creditorId === userId) amounts.push(value.negated())
      else if (row.debtorId === userId) amounts.push(value)
    }
  }
  return amounts
}

export function sumSigned(rows: BalanceRow[], userId: string): Prisma.Decimal {
  return signedAmounts(rows, userId).reduce(
    (acc, amount) => acc.plus(amount),
    new Prisma.Decimal(0),
  )
}

export function toDecimal(value: string | number | Prisma.Decimal): Prisma.Decimal {
  return new Prisma.Decimal(value.toString())
}

/**
 * Máximo que `userId` puede pagarle hoy a `friendId`:
 * la deuda actual (si es que le debe) menos los pagos PENDING ya registrados.
 */
export function maxPayableFrom(
  balance: Prisma.Decimal,
  pendingOutgoingSum: Prisma.Decimal,
): Prisma.Decimal {
  const owed = balance.lt(0) ? balance.abs() : new Prisma.Decimal(0)
  const max = owed.minus(pendingOutgoingSum)
  return max.gt(0) ? max : new Prisma.Decimal(0)
}