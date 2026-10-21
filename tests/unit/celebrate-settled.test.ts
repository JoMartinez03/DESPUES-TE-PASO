// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest"
import { celebrateSettledFromResult } from "@/components/shared/celebrate-settled"
import { celebrateSettled } from "@/components/ui/toast"

const { celebrate } = vi.hoisted(() => ({ celebrate: vi.fn() }))
vi.mock("@/components/ui/toast", () => ({ celebrateSettled: celebrate }))

afterEach(() => vi.clearAllMocks())

describe("celebrateSettledFromResult", () => {
  it("celebra sólo con ok + settled", () => {
    celebrateSettledFromResult({
      ok: true,
      settled: { peerId: "p1", peerName: "Lauti" },
    })
    expect(celebrateSettled).toHaveBeenCalledWith({ peerName: "Lauti" })
  })

  it("sin settled no celebra", () => {
    celebrateSettledFromResult({ ok: true })
    expect(celebrateSettled).not.toHaveBeenCalled()
  })

  it("con ok:false no celebra aunque venga settled", () => {
    celebrateSettledFromResult({
      ok: false,
      settled: { peerId: "p1", peerName: "Lauti" },
    })
    expect(celebrateSettled).not.toHaveBeenCalled()
  })
})
