import { and, eq } from "drizzle-orm"
import { workouts } from "../schema"
import { useDB } from "../useDB"

export const useRemoveTemplateQuery = () => {
  const { drizzleDB } = useDB()
  return (templateId: number) =>
    drizzleDB
      .delete(workouts)
      .where(and(eq(workouts.id, templateId), eq(workouts.is_template, true)))
}
