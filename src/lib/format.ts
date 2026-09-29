const CURRENCY_SYMBOLS: Record<string, string> = {
  ARS: "$",
}

function symbolFor(currency: string) {
  return CURRENCY_SYMBOLS[currency] ?? currency
}

export function formatMoney(
  amount: number | string | { toString(): string },
  currency: string = "ARS",
): string {
  const value =
    typeof amount === "object" ? Number(amount.toString()) : Number(amount)
  const safe = Number.isFinite(value) ? value : 0
  const formatted = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(safe)
  return `${symbolFor(currency)}${formatted}`
}

export function formatDate(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value)
}

export function formatShortDate(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
  }).format(value)
}

export type SignedMoney = {
  /** `+` te deben · `−` debés · `""` estás al día. */
  symbol: "+" | "−" | ""
  /** Monto absoluto, sin signo. */
  text: string
  /** `true` cuando el balance es cero: no lleva signo. */
  settled: boolean
}

/**
 * Formatea un valor en dinero con el signo ya resuelto para balances.
 * `+` indica que te deben, `−` que debés; cero devuelve `settled: true` con
 * símbolo vacío para que las vistas muestren `$0` y no `+$0`.
 */
export function formatSignedMoney(
  amount: number | string | { toString(): string },
  currency: string = "ARS",
): SignedMoney {
  const value =
    typeof amount === "object" ? Number(amount.toString()) : Number(amount)
  const safe = Number.isFinite(value) ? value : 0
  const absolute = formatMoney(Math.abs(safe), currency)
  if (safe > 0) return { symbol: "+", text: absolute, settled: false }
  if (safe < 0) return { symbol: "−", text: absolute, settled: false }
  return { symbol: "", text: formatMoney(0, currency), settled: true }
}