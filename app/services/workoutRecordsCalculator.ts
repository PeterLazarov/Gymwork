import { Exercise, Workout, WorkoutSet } from "app/db/models"

export type ExerciseRecord = Record<WorkoutSet['groupingValue'], WorkoutSet>

export const calculateRecords = (workouts: Workout[]): 
  Record<Exercise['guid'], ExerciseRecord> =>  {

  const records = getRecords(workouts)

  removeWeakAssRecords(records)

  return records
}

export const removeWeakAssRecords = (records: Record<Exercise['guid'], ExerciseRecord>): void => {
  for (const exerciseID in records) {
    const exerciseRecords = records[exerciseID]
    const groupingsDescending = Object.keys(exerciseRecords)
      .map(Number) 
      .sort((a, b) => b - a);
    
    let lastRecord = exerciseRecords[groupingsDescending[0]]

    for (const grouping of groupingsDescending) {
      const record = exerciseRecords[grouping]
      
      if (
        lastRecord.isBetterThan(record) &&
        lastRecord.guid !== record.guid
      ) {
        delete exerciseRecords[grouping]
      } else {
        lastRecord = record
      }
    }
  }
}

const getRecords = (workouts: Workout[]) => {
  const records: Record<Exercise['guid'], ExerciseRecord> = {}

  const sortedWorkouts = workouts.slice().sort((w1,w2) =>  { 
    var dateA = new Date(w1.date).getTime();
    var dateB = new Date(w2.date).getTime();
    return dateA - dateB;
  })

  for (let i = 0; i < sortedWorkouts.length; i++) {
    const workout = sortedWorkouts[i]
    for (let j = 0; j < workout.sets.length; j++) {
      const set = workout.sets[j]

      if (!records[set.exercise.guid]) {
        records[set.exercise.guid] = {}
      }

      const exerciseRecords = records[set.exercise.guid]
      const currentRecord = exerciseRecords[set.groupingValue]

      const isRecord = !currentRecord || currentRecord.measurementValue < set.measurementValue
      if (isRecord) {
        exerciseRecords[set.groupingValue] = set
      }
    }
  }


  return records
}
