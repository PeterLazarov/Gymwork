import { getDrizzle } from "@/components/Providers/DrizzleProvider"
import {
  exercise_metrics,
  exercises,
  metrics,
  SelectSet,
  SelectSetGroup,
  SelectWorkout,
  set_groups,
  sets,
} from "@/db/sqlite/schema"
import { createQueryKeyStore } from "@lukemorales/query-key-factory"
import { eq, sql } from "drizzle-orm"

const detailQ = getDrizzle().query.set_groups.findFirst({
  where(fields, operators) {
    return operators.eq(fields.id, 123)
  },
  with: {
    sets: {
      with: {
        exercise: {
          columns: {
            name: true,
          },
          with: {
            exerciseMetrics: {
              with: {
                metric: true,
              },
            },
          },
        },
      },
    },
  },
})

const detailQ2 = getDrizzle()
  .select({
    id: set_groups.id,
    name: set_groups.name,
    sets: {
      id: sets.id,
      completed_at: sets.completed_at,
      exercise: {
        name: exercises.name,
        exerciseMetrics: {
          metric: true,
        },
      },
    },
  })
  .from(set_groups)
  .where(eq(set_groups.id, 123))
  .leftJoin(sets, eq(sets.set_group_id, set_groups.id))
  .leftJoin(exercises, eq(exercises.id, sets.exercise_id))
  .leftJoin(exercise_metrics, eq(exercise_metrics.exercise_id, exercises.id))
  .leftJoin(metrics, eq(metrics.id, exercise_metrics.metric_id))

type idk = NonNullable<Awaited<typeof detailQ>>

const detail3 = getDrizzle()
  .select({
    id: set_groups.id,
    // Add other set_groups columns as needed
    sets: sql`json_agg(
      json_build_object(
        'id', ${sets.id},  // Add other sets columns as needed
        'exercise', json_build_object(
          'name', ${exercises.name},
          'exerciseMetrics', json_agg(
            json_build_object(
              'id', ${exercise_metrics.exercise_id},  // Add other exerciseMetrics columns as needed
              'metric', json_build_object(
                'id', ${metrics.id}  // Add metric columns as needed, e.g., 'name', ${metrics.id}
              )
            )
          )
        )
      )
    )`.as("sets"),
  })
  .from(set_groups)
  .leftJoin(sets, eq(set_groups.id, sets.set_group_id)) // Assuming 'setGroupId' is the FK in sets
  .leftJoin(exercises, eq(sets.exercise_id, exercises.id)) // Assuming 'exercise_id' is the FK in sets
  .leftJoin(exercise_metrics, eq(exercises.id, exercise_metrics.exercise_id)) // Assuming 'exerciseId' is the FK in exercise_metrics

  .leftJoin(metrics, eq(exercise_metrics.metric_id, metrics.id)) // Assuming 'metricId' is the FK in exerciseMetrics
  .where(eq(set_groups.id, 1))
  .groupBy(set_groups.id)
  .limit(1) // To mimic findFirst, though it returns an array; use [0] to get the first result

// A workaround for the fact that SQLite is provided async because of web compat setup
export const queries = createQueryKeyStore({
  setGroups: {
    // all: null,
    forWorkout(workoutId: SelectWorkout["id"]) {
      return {
        queryFn: getDrizzle().query.set_groups.findMany({
          where(fields, operators) {
            return operators.eq(fields.workout_id, workoutId)
          },
        }),
        queryKey: [workoutId],
      }
    },
    detail: (setGroupId: SelectSetGroup["id"]) => ({
      queryKey: [setGroupId],
      queryFn: () => detail3,
    }),
  },
})
