import { destroy, getSnapshot } from "mobx-state-tree"

import { 
  ExerciseRecord, 
  ExerciseRecordSnapshotIn, 
  Workout, 
  WorkoutSet, 
  WorkoutSetSnapshotIn
} from "app/db/models"
import { checkSetAndAddRecord } from "app/db/seeds/exercise-records-seed-generator"

export const removeWeakAssRecords = (exerciseAllRecords: ExerciseRecord): void => {
  const groupingRecordSetMap = exerciseAllRecords.recordSets.reduce((acc, set) => { 
    acc[set.groupingValue] = set 
    return acc
  }, {} as Record<number, WorkoutSet>)

  const groupingsDescending = Object.keys(groupingRecordSetMap)
    .map(Number) 
    .sort((a, b) => b - a);
  
  let lastRecord = groupingRecordSetMap[groupingsDescending[0]]

  for (const grouping of groupingsDescending) {
    const record = groupingRecordSetMap[grouping]
    
    if (
      lastRecord.guid !== record.guid &&
      lastRecord.isBetterThan(record)
    ) {
      const weakAssRecord = exerciseAllRecords.recordSets.find(set => set.guid === record.guid)
      weakAssRecord?.setProp('isWeakAss', true)
    } else {
      const strongAssRecord = exerciseAllRecords.recordSets.find(set => set.guid === lastRecord.guid)
      strongAssRecord?.setProp('isWeakAss', false)

      lastRecord = record
    }
  }

}


export const getGroupingRecordsForExercise = (
  groupingToRefresh: number,
  oldExerciseRecords: ExerciseRecord, 
  sortedWorkouts: Workout[]
): ExerciseRecordSnapshotIn => {
  const record: ExerciseRecordSnapshotIn = { exercise: oldExerciseRecords.exercise.guid, recordSets: [] }

  let untouchedRecords: WorkoutSetSnapshotIn[] = []
  oldExerciseRecords.recordSets.forEach(recordSet => {
    if (recordSet.groupingValue !== groupingToRefresh) {
      untouchedRecords.push(getSnapshot(recordSet))
    }
  })
  record.recordSets = untouchedRecords

  sortedWorkouts.forEach(workout => {
    workout.sets.forEach(set => {
      if (set.exercise.guid === oldExerciseRecords.exercise.guid && set.groupingValue === groupingToRefresh) {
        checkSetAndAddRecord(record, set)
      }
    })
  })

  return record
}

export const isCurrentRecord = (
  record: ExerciseRecord, 
  set: WorkoutSet, 
) => {
  const currentRecord = record.recordSets.find(record => record.groupingValue === set.groupingValue)

  return currentRecord?.guid === set.guid
}

export const isNewRecord = (
  recordSets: WorkoutSet[], 
  set: WorkoutSet, 
) => {
  const currentRecord = recordSets.find(record => record.groupingValue === set.groupingValue)
console.log(set.measurementValue - (currentRecord?.measurementValue || 0))
  return !currentRecord || set.isBetterThan(currentRecord)
}


export const addToRecords = (
  records: WorkoutSet[], 
  newRecord: WorkoutSet, 
): WorkoutSet[] => {
  const currentRecord = records!.find(record => record.groupingValue === newRecord.groupingValue)

  const recordSets = records!.slice()
  if (currentRecord) {
    const index = recordSets.indexOf(currentRecord)
    recordSets[index] = newRecord
    destroy(currentRecord)
  } else {
    recordSets.push(newRecord)
  }

  return recordSets
}
