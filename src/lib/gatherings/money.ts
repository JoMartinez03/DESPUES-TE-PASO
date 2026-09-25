/**
 * Operaciones monetarias puras para juntadas.
 *
 * TODO el cálculo monetario trabaja en centavos (enteros) para no perder ni
 * inventar plata con floats. La conversión a texto con 2 decimales se hace
 * recién al persistir como Prisma.Decimal.
 *
 * REGLA ÚNICA DE REDONDEO — DIVISIÓN EN PARTES IGUALES
 * ----------------------------------------------------
 * 1. El monto total se convierte a centavos (unidades mínimas).
 * 2. Se calcula la parte base con división entera: base = totalCents / n.
 * 3. Los participantes se ordenan de forma estable y determinística por userId
 *    (comparación ascendente de los ids).
 * 4. Los centavos restantes (totalCents % n) se distribuyen de a 1, comenzando
 *    por los primeros participantes de ese orden.
 *
 * Ejemplo: $100 / 3 con orden estable por userId A < B < C
 *   A -> $33,34
 *   B -> $33,33
 *   C -> $33,33
 *
 * Invariante: la suma de los shareAmount SIEMPRE es exactamente el total.
 * No importa visualmente quién recibe el centavo extra: el criterio es estable,
 * reproducible y nunca se pierden centavos.
 */

/**
 * Convierte un monto en texto ("100", "10.5", "10.05") a centavos enteros.
 * Requiere un formato `^\d+(\.\d{1,2})?$` (validado antes por Zod).
 */
export function parseMoneyToCents(value: string): number {
  const [intPart, fracPartRaw = ""] = value.split(".")
  const fracPart = fracPartRaw.padEnd(2, "0")
  return Number(intPart) * 100 + Number(fracPart)
}

/** Convierte centavos a un texto con 2 decimales, listo para Prisma.Decimal. */
export function centsToAmountString(cents: number): string {
  const sign = cents < 0 ? "-" : ""
  const absolute = Math.abs(cents)
  const intPart = Math.floor(absolute / 100)
  const fracPart = absolute % 100
  return `${sign}${intPart}.${String(fracPart).padStart(2, "0")}`
}

/**
 * Suma centavos. Devuelve el total exacto.
 */
export function sumCents(values: Iterable<number>): number {
  let acc = 0
  for (const value of values) acc += value
  return acc
}

function compareStringsAscending(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

/**
 * Reparte un monto total (en centavos) en partes iguales entre los
 * participantes. Ordena los ids de forma estable (ascendente) y distribuye el
 * resto de a 1 centavo empezando por los primeros del orden.
 *
 * Devuelve un Map<userId, centavos> en el orden estable.
 */
export function splitEqualCents(
  totalCents: number,
  participantIds: string[],
): Map<string, number> {
  const n = participantIds.length
  if (n === 0) return new Map()

  const sorted = [...participantIds].sort(compareStringsAscending)
  const base = Math.floor(totalCents / n)
  const remainder = totalCents % n

  const result = new Map<string, number>()
  sorted.forEach((userId, index) => {
    result.set(userId, index < remainder ? base + 1 : base)
  })
  return result
}