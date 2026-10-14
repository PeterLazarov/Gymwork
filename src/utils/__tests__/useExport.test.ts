import { insertInBatches } from "../useExport"

describe("insertInBatches", () => {
  it("splits large restores into SQLite-safe statements", () => {
    const rows = Array.from({ length: 1_001 }, (_, index) => index)
    const batches: number[][] = []

    insertInBatches(rows, 15, (batch) => {
      batches.push(batch)
    })

    expect(batches).toHaveLength(17)
    expect(batches.every((batch) => batch.length * 15 <= 900)).toBe(true)
    expect(batches.flat()).toEqual(rows)
  })
})
