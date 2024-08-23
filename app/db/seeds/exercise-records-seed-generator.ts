import { 
  Exercise, 
  ExerciseRecordSnapshotIn, 
  Workout, 
  WorkoutSet, 
  WorkoutSetSnapshotIn 
} from "app/db/models"
import { getSnapshot } from "mobx-state-tree"

export const getRecords = (workouts: Workout[]): ExerciseRecordSnapshotIn[] => {
  const records: ExerciseRecordSnapshotIn[] = []

  const sortedWorkouts = workouts.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // TODO: fix weak sets being chosen for records on seeding
  sortedWorkouts.forEach(workout => {
    workout.sets.forEach(set => {
      let record = records.find(r => r.exercise === set.exercise.guid)

      if (!record) {
        record = { exercise: set.exercise.guid, recordSets: [] }
        records.push(record)
      }

      checkSetAndAddRecord(record, set)
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
        checkSetAndAddRecord(record, set)
      }
    })
  })

  return record
}

export const checkSetAndAddRecord = (
  record: ExerciseRecordSnapshotIn, 
  set: WorkoutSet, 
) => {
  const grouping = getDataFieldForKey(set.exercise.groupRecordsBy)
  const currentRecord = record.recordSets!.find(s => s[grouping] === set.groupingValue)
  const isRecord = !currentRecord || isNewSetBetterThanCurrent(set, currentRecord)

  if (isRecord) {
    const newRecord = getSnapshot(set)

    if (currentRecord) {
      const newRecords = record.recordSets!.slice()
      newRecords[newRecords.indexOf(currentRecord)] = newRecord

      record.recordSets = newRecords
    } else {
      const newRecords = record.recordSets!.slice()

      newRecords.push(newRecord)

      record.recordSets = newRecords
    }
  }
}

const getDataFieldForKey = (key: string): keyof WorkoutSetSnapshotIn => {
  const dataFieldsMap = {
    weight: 'weightMcg',
    time: 'durationMs',
    reps: 'reps',
    distance: 'distanceMm',
  }
  return dataFieldsMap[key as keyof typeof dataFieldsMap] as keyof WorkoutSetSnapshotIn
}

const isNewSetBetterThanCurrent = (newSet: WorkoutSet, currentSet: WorkoutSetSnapshotIn) => {
  const isMoreBetter = newSet.exercise.measurements[newSet.exercise.measuredBy]!.moreIsBetter
  const groupingIsMoreBetter = newSet.exercise.measurements[newSet.exercise.groupRecordsBy]!.moreIsBetter

  const measurement = getDataFieldForKey(newSet.exercise.measuredBy)
  const grouping = getDataFieldForKey(newSet.exercise.groupRecordsBy)

  const isTied = currentSet[measurement] === newSet.measurementValue

  const measurementDiff = newSet.measurementValue - currentSet[measurement]
  const groupingDiff = newSet.groupingValue - currentSet[grouping]

  const tieBreak = groupingIsMoreBetter ? groupingDiff > 0 : groupingDiff < 0
  const isMeasurementMore = isMoreBetter ? measurementDiff > 0 : measurementDiff < 0

  console.log({ measurementDiff, current: currentSet[measurement], newGrouping: newSet.groupingValue, oldGrouping: currentSet[grouping], new:  newSet.measurementValue, isMoreBetter, isMeasurementMore})
  return isMeasurementMore || (isTied && tieBreak)
}