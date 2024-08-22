import { Exercise, ExerciseRecord, ExerciseRecordSnapshotIn, Workout, WorkoutSet } from "app/db/models"
import { ExerciseRecordSet, ExerciseRecordSetModel, ExerciseRecordSetSnapshotIn } from "app/db/models/ExerciseRecordSet"
import { checkSetAndAddRecord } from "app/db/seeds/exercise-records-seed-generator"

// export const removeWeakAssRecords = (records: Record<Exercise['guid'], ExerciseRecord>): void => {
//   for (const exerciseID in records) {
//     const exerciseRecords = records[exerciseID]
//     const groupingsDescending = Object.keys(exerciseRecords)
//       .map(Number) 
//       .sort((a, b) => b - a);
    
//     let lastRecord = exerciseRecords[groupingsDescending[0]]

//     for (const grouping of groupingsDescending) {
//       const record = exerciseRecords[grouping]
      
//       if (
//         lastRecord.isBetterThan(record) &&
//         lastRecord.guid !== record.guid
//       ) {
//         delete exerciseRecords[grouping]
//       } else {
//         lastRecord = record
//       }
//     }
//   }
// }


export const getRecordsForExercise = (
  exercise: Exercise, 
  workouts: Workout[]
): ExerciseRecordSnapshotIn => {
  const record: ExerciseRecordSnapshotIn = { exercise: exercise.guid, recordSets: [] }

  const sortedWorkouts = workouts.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  sortedWorkouts.forEach(workout => {
    workout.sets.forEach(set => {
      if (set.exercise.guid === exercise.guid) {
        checkSetAndAddRecord(record, set, workout.date)
      }
    })
  })

  return record
}

export const isCurrentRecord = (
  record: ExerciseRecord, 
  set: WorkoutSet, 
) => {
  const grouping = getDataFieldForKey(record.exercise.groupRecordsBy)
  const measurement = getDataFieldForKey(record.exercise.measuredBy)
  const currentRecord = record.recordSets.find(s => s[grouping] === set.groupingValue)

  return currentRecord && set.groupingValue === currentRecord[grouping] && set.measurementValue === currentRecord[measurement]
}

export const isNewRecord = (
  recordSets: ExerciseRecordSet[], 
  set: WorkoutSet, 
) => {
  const grouping = getDataFieldForKey(set.exercise.groupRecordsBy)
  const currentRecord = recordSets.find(s => s[grouping] === set.groupingValue)

  return !currentRecord || isNewSetBetterThanCurrent(set, currentRecord)
}


export const addToRecords = (
  records: ExerciseRecordSet[], 
  set: WorkoutSet, 
  date: string
): ExerciseRecordSet[] => {
  const grouping = getDataFieldForKey(set.exercise.groupRecordsBy)
  const currentRecord = records!.find(s => s[grouping] === set.groupingValue)
  const updatedSet = ExerciseRecordSetModel.create({ 
    date, 
    weightMcg: set.weightMcg, 
    distanceMm: set.distanceMm,
    durationMs: set.durationMs,
    reps: set.reps
  })

  const recordSets = records!.slice()
  if (currentRecord) {
    const index = recordSets.indexOf(currentRecord)
    recordSets[index] = updatedSet
  } else {
    recordSets.push(updatedSet)
  }

  return recordSets
}

const getDataFieldForKey = (key: string): keyof ExerciseRecordSetSnapshotIn => {
  const dataFieldsMap = {
    weight: 'weightMcg',
    time: 'durationMs',
    reps: 'reps',
    distance: 'distanceMm',
  }
  return dataFieldsMap[key as keyof typeof dataFieldsMap] as keyof ExerciseRecordSetSnapshotIn
}

const isNewSetBetterThanCurrent = (newSet: WorkoutSet, currentSet: ExerciseRecordSetSnapshotIn) => {
  const isMoreBetter = newSet.exercise.measurements[newSet.exercise.measuredBy]!.moreIsBetter
  const groupingIsMoreBetter = newSet.exercise.measurements[newSet.exercise.groupRecordsBy]!.moreIsBetter

  const measurement = getDataFieldForKey(newSet.exercise.measuredBy)
  const grouping = getDataFieldForKey(newSet.exercise.groupRecordsBy)

  const isTied = currentSet[measurement] === newSet.measurementValue

  const measurementDiff = newSet.measurementValue - currentSet[measurement]
  const groupingDiff = newSet.groupingValue - currentSet[grouping]

  const tieBreak = groupingIsMoreBetter ? groupingDiff > 0 : groupingDiff < 0
  const isMeasurementMore = isMoreBetter ? measurementDiff > 0 : measurementDiff < 0
  
  return isMeasurementMore || (isTied && tieBreak)
}