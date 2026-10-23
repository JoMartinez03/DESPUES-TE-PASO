// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest"
import { celebrateSettledFromResult } from "@/components/shared/celebrate-settled"
import { celebrateSettled } from "@/components/ui/toast"

const { celebrate, hapticCelebrate } = vi.hoisted(() => ({
  celebrate: vi.fn(),
  hapticCelebrate: vi.fn(),
}))
vi.mock("@/components/ui/toast", () => ({ celebrateSettled: celebrate }))
vi.mock("@/lib/haptics", () => ({ hapticCelebrate }))

afterEach(() => vi.clearAllMocks())

describe("celebrateSettledFromResult", () => {
  it("celebra sólo con ok + settled", () => {
    const didCelebrate = celebrateSettledFromResult({
      ok: true,
      settled: { peerId: "p1", peerName: "Lauti" },
    })
    expect(didCelebrate).toBe(true)
    expect(celebrateSettled).toHaveBeenCalledWith({ peerName: "Lauti" })
    expect(hapticCelebrate).toHaveBeenCalledTimes(1)
  })

  it("sin settled no celebra ni vibra", () => {
    expect(celebrateSettledFromResult({ ok: true })).toBe(false)
    expect(celebrateSettled).not.toHaveBeenCalled()
    expect(hapticCelebrate).not.toHaveBeenCalled()
  })

  it("con ok:false no celebra aunque venga settled", () => {
    expect(
      celebrateSettledFromResult({
        ok: false,
        settled: { peerId: "p1", peerName: "Lauti" },
      }),
    ).toBe(false)
    expect(celebrateSettled).not.toHaveBeenCalled()
    expect(hapticCelebrate).not.toHaveBeenCalled()
  })
})
