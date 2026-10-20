// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it } from "vitest"
import {
  EXIT_MS,
  usePendingExit,
} from "@/components/shared/use-pending-exit"

afterEach(cleanup)

type Row = { id: string; name: string }

/** Harness mínimo para observar el hook sin depender de un componente real. */
function Harness({ items }: { items: Row[] }) {
  const { rows, isLeaving, resolve } = usePendingExit(items)
  return (
    <ul>
      {rows.map((row) => (
        <li key={row.id} data-leaving={row.leaving ? "true" : undefined}>
          {row.name}
          <button type="button" onClick={() => resolve(row.id)}>
            resolver {row.name}
          </button>
          <span data-testid={`leaving-${row.id}`}>
            {isLeaving(row.id) ? "sí" : "no"}
          </span>
        </li>
      ))}
    </ul>
  )
}

describe("usePendingExit", () => {
  it("no marca nada como saliente hasta que se resuelve", () => {
    const { container } = render(<Harness items={[{ id: "a", name: "Ana" }]} />)

    expect(container.querySelector('[data-leaving="true"]')).toBeNull()
    expect(screen.getByTestId("leaving-a").textContent).toBe("no")
  })

  it("al resolver, marca la fila como saliente", async () => {
    const { container } = render(<Harness items={[{ id: "a", name: "Ana" }]} />)

    await userEvent.click(screen.getByRole("button", { name: "resolver Ana" }))

    expect(container.querySelector('[data-leaving="true"]')).not.toBeNull()
    expect(screen.getByTestId("leaving-a").textContent).toBe("sí")
  })

  it("conserva la fila al desaparecer de props y la suelta tras la animación", async () => {
    const { container, rerender } = render(
      <Harness items={[{ id: "a", name: "Ana" }]} />,
    )

    await userEvent.click(screen.getByRole("button", { name: "resolver Ana" }))
    rerender(<Harness items={[]} />)

    // Sigue montada (snapshot) durante la salida.
    expect(screen.getByText("Ana")).toBeDefined()

    await new Promise((resolve) => setTimeout(resolve, EXIT_MS + 60))
    expect(container.querySelector('[data-leaving="true"]')).toBeNull()
    expect(screen.queryByText("Ana")).toBeNull()
  })

  it("mantiene el orden de las filas que siguen en props", async () => {
    const items: Row[] = [
      { id: "a", name: "Ana" },
      { id: "b", name: "Beto" },
      { id: "c", name: "Caro" },
    ]
    render(<Harness items={items} />)

    await userEvent.click(screen.getByRole("button", { name: "resolver Beto" }))

    const names = screen
      .getAllByRole("listitem")
      .map((li) => li.firstChild?.textContent)
    expect(names).toEqual(["Ana", "Beto", "Caro"])
  })
})
