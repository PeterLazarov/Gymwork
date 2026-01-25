type Identifiable = { id?: number }

export function addRecord<T extends Identifiable>(oldData: T[] | undefined, inserted: T): T[] {
  if (oldData) {
    return [inserted, ...oldData]
  }
  return [inserted]
}

export function removeRecord<T extends Identifiable>(
  oldData: T[] | undefined,
  removedId: number,
): T[] {
  if (oldData) {
    return oldData.filter((item) => item.id !== removedId)
  }
  return []
}

export function updateRecord<T extends Identifiable>(
  oldData: T[] | undefined,
  updatedId: number,
  updates: Partial<T>,
): T[] {
  if (oldData) {
    return oldData.map((item) => (item.id === updatedId ? { ...item, ...updates } : item))
  }
  return []
}
