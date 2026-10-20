/**
 * Normalización de montos tipeados por el usuario (ARS, convención es-AR).
 *
 * Forma canónica interna: solo dígitos con PUNTO decimal y hasta 2 posiciones
 * decimales ("6600", "6600.8", "6600.83"). Es la única forma que aceptan las
 * validaciones de Zod y la que se convierte en `Prisma.Decimal`, donde vive la
 * precisión exacta del dinero.
 *
 * REGLAS
 * ------
 * - La coma decimal del teclado argentino ("6600,83") y el punto decimal
 *   ("6600.83") son equivalentes.
 * - NO se soportan separadores de miles dentro del input: una sola coma o un
 *   solo punto es el separador decimal.
 * - Si aparecen AMBOS símbolos (un paste formateado como "6.600,83" o
 *   "1,234.56"), el ÚLTIMO que aparece se interpreta como decimal y los demás
 *   se descartan como separadores de miles. Es la lectura no ambigua en los
 *   dos formatos.
 * - Nada de esto usa aritmética: ambas funciones devuelven TEXTO, así que en
 *   el camino del dinero no hay errores de punto flotante. La exactitud
 *   numérica recién aparece en `Prisma.Decimal`.
 */

/** Forma canónica validable: enteros con punto decimal y hasta 2 posiciones. */
export const MONEY_CANONICAL_REGEX = /^\d+(\.\d{1,2})?$/

/** Cantidad máxima de posiciones decimales admitidas. */
export const MONEY_MAX_FRACTION_DIGITS = 2

/**
 * Resuelve la ambigüedad de separadores del texto crudo. Si hay coma Y punto,
 * el último que aparece es el decimal y los demás símbolos se descartan como
 * separadores de miles. Devuelve el texto ya desambiguado y el símbolo que
 * queda como decimal (o el que ya traía el texto si solo hay un tipo).
 */
function resolveDecimalSeparator(text: string): {
  text: string
  separator: "," | "." | null
} {
  const lastComma = text.lastIndexOf(",")
  const lastDot = text.lastIndexOf(".")
  if (lastComma !== -1 && lastDot !== -1) {
    const separator: "," | "." = lastComma > lastDot ? "," : "."
    const thousands = separator === "," ? /\./g : /,/g
    return { text: text.replace(thousands, ""), separator }
  }
  return { text, separator: lastComma !== -1 ? "," : lastDot !== -1 ? "." : null }
}

/**
 * Filtra lo que el usuario puede escribir EN VIVO en un input monetario, sin
 * bloquear estados intermedios de escritura: "6600," y "6600,8" quedan tal
 * cual hasta completar el número. Conserva el separador que tipeó el usuario
 * (la coma argentina se ve coma mientras se escribe), trunca el decimal a 2
 * posiciones y descarta caracteres inválidos, signos y separadores repetidos.
 *
 * Para RECHAZAR valores con más de 2 decimales (en vez de truncarlos) está
 * `toCanonicalMoney`, que es lo que usan las validaciones.
 */
export function sanitizeMoneyInput(raw: string): string {
  const { text, separator } = resolveDecimalSeparator(raw)
  if (separator === null) return text.replace(/\D/g, "")

  // El primer separador del texto (ya desambiguado) es el decimal; cualquier
  // símbolo repetido se ignora sin mezclar dígitos de los costados.
  const index = text.indexOf(separator)
  const integer = text.slice(0, index).replace(/\D/g, "")
  const fraction = text
    .slice(index + 1)
    .replace(/\D/g, "")
    .slice(0, MONEY_MAX_FRACTION_DIGITS)
  return `${integer}${separator}${fraction}`
}

/**
 * Convierte lo que escribió el usuario a la forma canónica para validar y
 * persistir: coma -> punto y sin separadores de miles. Devuelve `null` cuando
 * el valor no tiene reparación posible: vacío, signos, letras u otros
 * caracteres inválidos, o más de 2 posiciones decimales. Un separador final
 * sin decimales se completa como entero ("6600," -> "6600"), que es justo el
 * estado intermedio de escritura.
 *
 * La validación de CONTENIDO (>0, tope máximo, NaN/Infinity) vive en Zod;
 * acá solo se resuelve la forma del texto.
 */
export function toCanonicalMoney(raw: string): string | null {
  const text = raw.trim()
  // Nada fuera de dígitos, coma y punto: rechaza signos, letras y espacios.
  if (!/^[\d.,]+$/.test(text)) return null

  const { text: resolved } = resolveDecimalSeparator(text)
  const match = /^(\d+)(?:[.,](\d{1,2})?)?$/.exec(resolved)
  if (!match) return null

  const integer = match[1]
  const fraction = match[2] ?? ""
  return fraction === "" ? integer : `${integer}.${fraction}`
}
