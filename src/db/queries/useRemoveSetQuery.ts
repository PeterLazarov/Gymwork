import { eq } from "drizzle-orm"
import { sets } from "../schema"
import { useDB } from "../useDB"

export const useRemoveSetQuery = () => {
  const { drizzleDB } = useDB()
  return (setId: number) => drizzleDB.delete(sets).where(eq(sets.id, setId))
}
