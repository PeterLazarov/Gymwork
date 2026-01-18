// TODO: fix unknown type
export function addRecord<T>(oldData: unknown, inserted: T): T[] {
  if (Array.isArray(oldData)) {
    return [inserted, ...oldData];
  }
  return oldData as T[];
}

export function removeRecord<T>(oldData: unknown, removedId: number): T[] {
  if (Array.isArray(oldData)) {
    return oldData.filter((item) => item.id !== removedId);
  }
  return oldData as T[];
}
