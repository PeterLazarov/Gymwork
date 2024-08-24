import { 
  Exercise, 
  ExerciseRecordSnapshotIn, 
  Workout, 
} from "app/db/models"
import { updateSnapshotRecordIfNecessary } from "app/services/workoutRecordsCalculator"

export const getRecords = (workouts: Workout[]): ExerciseRecordSnapshotIn[] => {
  const records: ExerciseRecordSnapshotIn[] = []

  const sortedWorkouts = workouts.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  sortedWorkouts.forEach(workout => {
    workout.sets.forEach(set => {
      let record = records.find(r => r.exercise === set.exercise.guid)

      if (!record) {
        record = { exercise: set.exercise.guid, recordSets: [] }
        records.push(record)
      }

      updateSnapshotRecordIfNecessary(record, set)
    })
  })

  return records
}

export const getRecordsForExercise = (
  exercise: Exercise, 
  workouts: Workout[]
): ExerciseRecordSnapshotIn => {
  const record: ExerciseRecordSnapshotIn = { exercise: exercise.guid, recordSets: [] }

  const sortedWorkouts = workouts.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  sortedWorkouts.forEach(workout => {
    workout.sets.forEach(set => {
      if (set.exercise.guid === exercise.guid) {
        updateSnapshotRecordIfNecessary(record, set)
      }
    })
  })

  return record
}
