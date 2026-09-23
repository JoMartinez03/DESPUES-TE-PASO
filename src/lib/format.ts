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