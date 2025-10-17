import { clearAll, deleteValue, getAllKeys, getValue, setValue } from "."

const VALUE_OBJECT = { x: 1 }
const VALUE_STRING = JSON.stringify(VALUE_OBJECT)

describe("SQLite Storage", () => {
  beforeEach(() => {
    clearAll()
    setValue("string", "string")
    setValue("object", JSON.stringify(VALUE_OBJECT))
  })

  afterAll(() => {
    clearAll()
  })

  it("should get and set string values", () => {
    expect(getValue("string")).toEqual("string")
    setValue("string", "new string")
    expect(getValue("string")).toEqual("new string")
  })

  it("should get and set JSON values", () => {
    const stored = getValue("object")
    expect(JSON.parse(stored!)).toEqual(VALUE_OBJECT)

    setValue("object", JSON.stringify({ y: 2 }))
    expect(JSON.parse(getValue("object")!)).toEqual({ y: 2 })
  })

  it("should return null for non-existent keys", () => {
    expect(getValue("non-existent")).toBeNull()
  })

  it("should list all keys", () => {
    const keys = getAllKeys()
    expect(keys).toContain("string")
    expect(keys).toContain("object")
    expect(keys.length).toBe(2)
  })

  it("should delete values", () => {
    deleteValue("object")
    expect(getValue("object")).toBeNull()

    const keysAfterRemove = getAllKeys()
    expect(keysAfterRemove).toContain("string")
    expect(keysAfterRemove).not.toContain("object")
    expect(keysAfterRemove.length).toBe(1)
  })

  it("should clear all data", () => {
    expect(getAllKeys().length).toBeGreaterThan(0)
    clearAll()
    expect(getAllKeys()).toEqual([])
  })

  it("should update existing values", () => {
    setValue("string", "first value")
    expect(getValue("string")).toEqual("first value")

    setValue("string", "second value")
    expect(getValue("string")).toEqual("second value")

    // Should only have one entry, not two
    expect(getAllKeys().filter(k => k === "string").length).toBe(1)
  })
})
