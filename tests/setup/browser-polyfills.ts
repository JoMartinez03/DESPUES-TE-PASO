/**
 * jsdom no implementa `Blob.prototype.arrayBuffer`, que sí existe en todos los
 * navegadores modernos (y en Node). Se polyfillea sólo si falta, para no pisar
 * la implementación real en el entorno node.
 */
if (typeof Blob !== "undefined" && !Blob.prototype.arrayBuffer) {
  Blob.prototype.arrayBuffer = function arrayBuffer(this: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as ArrayBuffer)
      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(this)
    })
  }
}

// Los matchers de jest-dom sólo tienen sentido donde existe `document`.
if (typeof document !== "undefined") {
  await import("@testing-library/jest-dom/vitest")
}

export {}
