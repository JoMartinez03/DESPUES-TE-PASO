// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton } from "@/components/shared/page-header-skeleton"
import AppLoading from "@/app/(app)/loading"
import PersonasLoading from "@/app/(app)/personas/loading"
import PersonaLoading from "@/app/(app)/personas/[id]/loading"
import JuntadasLoading from "@/app/(app)/juntadas/loading"
import JuntadaLoading from "@/app/(app)/juntadas/[id]/loading"
import PerfilLoading from "@/app/(app)/perfil/loading"

afterEach(cleanup)

describe("Skeleton (accesibilidad)", () => {
  it("es decorativo: aria-hidden por defecto", () => {
    const { container } = render(<Skeleton />)
    const el = container.querySelector('[data-slot="skeleton"]')
    expect(el?.getAttribute("aria-hidden")).toBe("true")
  })

  it("respeta prefers-reduced-motion (desactiva el pulse)", () => {
    const { container } = render(<Skeleton />)
    const el = container.querySelector('[data-slot="skeleton"]')!
    expect(el.className).toContain("animate-pulse")
    expect(el.className).toContain("motion-reduce:animate-none")
  })

  it("permite forzar contenido visible quitando aria-hidden", () => {
    const { container } = render(<Skeleton aria-hidden={false} />)
    const el = container.querySelector('[data-slot="skeleton"]')
    expect(el?.getAttribute("aria-hidden")).toBe("false")
  })
})

describe("PageHeaderSkeleton", () => {
  it("arma la estructura del header (título + acción) y es decorativo", () => {
    const { container } = render(
      <PageHeaderSkeleton description action back />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.getAttribute("aria-hidden")).toBe("true")
    // Bloques: Volver + título + descripción + acción.
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBe(4)
  })
})

describe("loading.tsx de las rutas", () => {
  const cases: Array<[string, () => React.JSX.Element]> = [
    ["(app)/dashboard", AppLoading],
    ["(app)/personas", PersonasLoading],
    ["(app)/personas/[id]", PersonaLoading],
    ["(app)/juntadas", JuntadasLoading],
    ["(app)/juntadas/[id]", JuntadaLoading],
    ["(app)/perfil", PerfilLoading],
  ]

  for (const [name, Loading] of cases) {
    it(`${name} marca el contenedor como aria-busy y usa skeletons decorativos`, () => {
      const { container } = render(<Loading />)

      // El estado de carga se anuncia una sola vez, en el contenedor.
      const busy = container.querySelector('[aria-busy="true"]')
      expect(busy).not.toBeNull()

      const skeletons = container.querySelectorAll('[data-slot="skeleton"]')
      expect(skeletons.length).toBeGreaterThan(0)
      // Ningún skeleton se anuncia (todos aria-hidden).
      for (const el of skeletons) {
        expect(el.getAttribute("aria-hidden")).toBe("true")
      }
    })

    it(`${name} no anuncia contenido falso (sin texto)`, () => {
      const { container } = render(<Loading />)
      expect(container.textContent?.trim()).toBe("")
    })
  }
})
