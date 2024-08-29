import {
  ExerciseRecordSnapshotIn,
  Workout,
  WorkoutSet,
  WorkoutSetSnapshotIn,
} from 'app/db/models'
import { getSnapshot } from 'mobx-state-tree'

export const getRecords = (workouts: Workout[]): ExerciseRecordSnapshotIn[] => {
  const records: ExerciseRecordSnapshotIn[] = []

  // Group sets by exercise and grouping value
  const groupedSets: { [key: string]: WorkoutSet[] } = {}

  workouts.forEach(workout => {
    workout.allSets.forEach(set => {
      const key = `${set.exercise.guid}-${set.groupingValue}`
      if (!groupedSets[key]) {
        groupedSets[key] = []
      }
      groupedSets[key].push(set)
    })
  })

  // Process each group to find the best set
  Object.keys(groupedSets).forEach(key => {
    const sets = groupedSets[key]
    const bestSet = sets.reduce((best, current) => {
      return current.isBetterThan(best) ? current : best
    })

    // Update or add the best set to the records
    let record = records.find(r => r.exercise === bestSet.exercise.guid)
    if (!record) {
      record = { exercise: bestSet.exercise.guid, recordSets: [] }
      records.push(record)
    }

    const newRecord: WorkoutSetSnapshotIn = getSnapshot(bestSet)
    record.recordSets! = [...record.recordSets!, newRecord]
  })

  return records
}
