import { describe, expect, it } from "vitest"
import {
  centeredSquareArea,
  clampCropArea,
  scaleArea,
} from "@/lib/avatar-crop"

const LANDSCAPE = { width: 4032, height: 3024 }
const PORTRAIT = { width: 3024, height: 4032 }

describe("centeredSquareArea", () => {
  it("toma el cuadrado completo de una horizontal, sin desplazamiento", () => {
    expect(centeredSquareArea(LANDSCAPE.width, LANDSCAPE.height)).toEqual({
      x: 504,
      y: 0,
      width: 3024,
      height: 3024,
    })
  })

  it("centra el cuadrado en una vertical", () => {
    expect(centeredSquareArea(PORTRAIT.width, PORTRAIT.height)).toEqual({
      x: 0,
      y: 504,
      width: 3024,
      height: 3024,
    })
  })

  it("no mueve nada cuando la imagen ya es cuadrada", () => {
    expect(centeredSquareArea(1200, 1200)).toEqual({
      x: 0,
      y: 0,
      width: 1200,
      height: 1200,
    })
  })

  it("nunca devuelve un lado en cero", () => {
    expect(centeredSquareArea(0, 0)).toEqual({ x: 0, y: 0, width: 1, height: 1 })
  })
})

describe("clampCropArea", () => {
  it("deja intacto un rectángulo que ya entra", () => {
    const area = { x: 100, y: 200, width: 800, height: 800 }
    expect(clampCropArea(area, LANDSCAPE.width, LANDSCAPE.height)).toEqual(area)
  })

  it("empuja dentro de la imagen un rectángulo que se sale por arriba", () => {
    expect(clampCropArea({ x: -40, y: -40, width: 800, height: 800 }, 4032, 3024))
      .toEqual({ x: 0, y: 0, width: 800, height: 800 })
  })

  it("empuja dentro de la imagen un rectángulo que se sale por abajo", () => {
    expect(clampCropArea({ x: 3900, y: 2900, width: 800, height: 800 }, 4032, 3024))
      .toEqual({ x: 3232, y: 2224, width: 800, height: 800 })
  })

  it("reduce un rectángulo más grande que la imagen", () => {
    const area = clampCropArea({ x: 0, y: 0, width: 9000, height: 9000 }, 4032, 3024)
    expect(area).toEqual({ x: 0, y: 0, width: 3024, height: 3024 })
  })

  it("reduce un rectángulo más grande que la vertical sin recentrarlo", () => {
    const area = clampCropArea({ x: 0, y: 0, width: 9000, height: 9000 }, 3024, 4032)
    expect(area).toEqual({ x: 0, y: 0, width: 3024, height: 3024 })
  })

  it("nunca deja un lado en cero, que sería un recorte vacío", () => {
    const area = clampCropArea({ x: 10, y: 10, width: 0, height: 0 }, 4032, 3024)
    expect(area.width).toBe(1)
    expect(area.height).toBe(1)
    expect(area.x).toBe(10)
    expect(area.y).toBe(10)
  })

  it("tolera coordenadas corruptas sin devolver NaN", () => {
    const area = clampCropArea(
      { x: Number.NaN, y: Number.NaN, width: Number.NaN, height: Number.NaN },
      4032,
      3024,
    )
    expect(area).toEqual({ x: 0, y: 0, width: 1, height: 1 })
  })

  it("mantiene el rectángulo dentro de los límites para cualquier zoom", () => {
    for (const zoom of [1, 1.5, 2, 3.7, 4]) {
      for (const image of [LANDSCAPE, PORTRAIT]) {
        const side = Math.min(image.width, image.height) / zoom
        const area = clampCropArea(
          { x: 99999, y: -99999, width: side, height: side },
          image.width,
          image.height,
        )
        expect(area.x).toBeGreaterThanOrEqual(0)
        expect(area.y).toBeGreaterThanOrEqual(0)
        expect(area.x + area.width).toBeLessThanOrEqual(image.width)
        expect(area.y + area.height).toBeLessThanOrEqual(image.height)
        expect(area.width).toBeGreaterThan(0)
        expect(area.height).toBeGreaterThan(0)
      }
    }
  })
})

describe("scaleArea", () => {
  it("reexpresa el área entre dos resoluciones", () => {
    expect(
      scaleArea({ x: 100, y: 200, width: 800, height: 800 }, { width: 4000, height: 3000 }, { width: 2000, height: 1500 }),
    ).toEqual({ x: 50, y: 100, width: 400, height: 400 })
  })

  it("no toca el área cuando las resoluciones coinciden", () => {
    const area = { x: 100, y: 200, width: 800, height: 800 }
    expect(scaleArea(area, { width: 4000, height: 3000 }, { width: 4000, height: 3000 })).toBe(area)
  })

  it("devuelve el área tal cual si la escala no es un número", () => {
    const area = { x: 100, y: 200, width: 800, height: 800 }
    expect(scaleArea(area, { width: 0, height: 0 }, { width: 10, height: 10 })).toBe(area)
  })
})
