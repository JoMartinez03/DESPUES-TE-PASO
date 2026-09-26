/**
 * Nombre de pila para textos cortos (notificaciones, toasts, labels).
 * `?? name` nunca disparaba con `split`, así que se usa `||` a propósito:
 * un nombre vacío o con espacio inicial devuelve el nombre completo.
 */
export function firstName(name: string): string {
  return name.trim().split(" ")[0] || name
}
