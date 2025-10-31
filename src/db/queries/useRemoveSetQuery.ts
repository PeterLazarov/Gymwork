import { eq } from "drizzle-orm"
import { sets } from "../schema"
import { useDB } from "../useDB"

export const useRemoveSetQuery = () => {
  const { drizzleDB } = useDB()
  return async (setId: number) => {
    await drizzleDB.delete(sets).where(eq(sets.id, setId))
  }
}
