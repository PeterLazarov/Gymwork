import { Exercise, Workout, WorkoutSet } from "app/db/models"

export type ExerciseRecord = Record<WorkoutSet['groupingValue'], WorkoutSet>

export const calculateRecords = (workouts: Workout[]): 
  Record<Exercise['guid'], ExerciseRecord> =>  {

  const records = getRepRecords(workouts)

  removeWeakAssRecords(records)

  return records
}

const removeWeakAssRecords = (records: Record<Exercise['guid'], ExerciseRecord>) => {
  for (const exerciseID in records) {
    const exerciseRecords = records[exerciseID]
    const groupingsDescending = Object.keys(exerciseRecords).reverse()
    let lastRecord =
      exerciseRecords[groupingsDescending[0] as any as number]
    for (const grouping of groupingsDescending) {
      const record = exerciseRecords[grouping as any as number]
      if (
        // not sure if higher value is always better
        lastRecord.measurementValue >= record.measurementValue &&
        lastRecord.guid !== record.guid
      ) {
        delete exerciseRecords[grouping as any as number]
      } else {
        lastRecord = record
      }
    }
  }
}

const getRepRecords = (workouts: Workout[]) => {
  const records: Record<Exercise['guid'], ExerciseRecord> = {}

  for (let i = 0; i < workouts.length; i++) {
    const workout = workouts[i]
    for (let j = 0; j < workout.sets.length; j++) {
      const set = workout.sets[j]

      if (!records[set.exercise.guid]) {
        records[set.exercise.guid] = {}
      }

      const exerciseRecords = records[set.exercise.guid]
      const currentRecord = exerciseRecords[set.groupingValue]
      if (!currentRecord ||
        currentRecord.measurementValue < set.measurementValue) {
        exerciseRecords[set.groupingValue] = set
      }
    }
  }

  return records
}
