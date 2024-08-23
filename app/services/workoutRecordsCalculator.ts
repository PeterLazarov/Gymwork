import { destroy, getSnapshot } from "mobx-state-tree"

import { ExerciseRecord, ExerciseRecordSnapshotIn, Workout, WorkoutSet } from "app/db/models"
import { ExerciseRecordSet, ExerciseRecordSetModel, ExerciseRecordSetSnapshotIn } from "app/db/models/ExerciseRecordSet"
import { checkSetAndAddRecord } from "app/db/seeds/exercise-records-seed-generator"

export const removeWeakAssRecords = (exerciseAllRecords: ExerciseRecord): void => {
  const groupingRecordSetMap = exerciseAllRecords.recordSets.reduce((acc, set) => { 
    acc[set.groupingValue] = set 
    return acc
  }, {} as Record<number, ExerciseRecordSet>)

  const groupingsDescending = Object.keys(groupingRecordSetMap)
    .map(Number) 
    .sort((a, b) => b - a);
  
  let lastRecord = groupingRecordSetMap[groupingsDescending[0]]

  for (const grouping of groupingsDescending) {
    const record = groupingRecordSetMap[grouping]
    
    if (
      lastRecord.guid !== record.guid &&
      isFirstRecordBetterThanSecond(lastRecord ,record)
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
  workouts: Workout[]
): ExerciseRecordSnapshotIn => {
  const record: ExerciseRecordSnapshotIn = { exercise: oldExerciseRecords.exercise.guid, recordSets: [] }

  const sortedWorkouts = workouts.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  let untouchedRecords: ExerciseRecordSetSnapshotIn[] = []
  oldExerciseRecords.recordSets.forEach(recordSet => {
    if (recordSet.groupingValue !== groupingToRefresh) {
      untouchedRecords.push(getSnapshot(recordSet))
    }
    else {
      destroy(recordSet)
    }
  })
  record.recordSets = untouchedRecords

  sortedWorkouts.forEach(workout => {
    workout.sets.forEach(set => {
      if (set.exercise.guid === oldExerciseRecords.exercise.guid) {
        if (set.groupingValue === groupingToRefresh) {
          checkSetAndAddRecord(record, set, workout.date)
        }
      }
    })
  })

  return record
}

export const isCurrentRecord = (
  record: ExerciseRecord, 
  set: WorkoutSet, 
) => {
  const currentRecord = record.recordSets.find(set => set.groupingValue === set.groupingValue)

  return currentRecord && set.groupingValue === currentRecord.groupingValue && set.measurementValue === currentRecord.measurementValue
}

export const isNewRecord = (
  recordSets: ExerciseRecordSet[], 
  set: WorkoutSet, 
) => {
  const currentRecord = recordSets.find(set => set.groupingValue === set.groupingValue)

  return !currentRecord || isNewSetBetterThanCurrent(set, currentRecord)
}


export const addToRecords = (
  records: ExerciseRecordSet[], 
  set: WorkoutSet, 
  date: string
): ExerciseRecordSet[] => {
  const currentRecord = records!.find(record => record.groupingValue === set.groupingValue)
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
    destroy(currentRecord)
  } else {
    recordSets.push(updatedSet)
  }

  return recordSets
}

const isFirstRecordBetterThanSecond = (firstRecord: ExerciseRecordSet, secondRecord: ExerciseRecordSet) => {
  const { exercise } = firstRecord.exerciseRecord
  const isMoreBetter = exercise.measurements[exercise.measuredBy]!.moreIsBetter
  const groupingIsMoreBetter = exercise.measurements[exercise.groupRecordsBy]!.moreIsBetter

  const isTied = secondRecord.measurementValue === firstRecord.measurementValue

  const measurementDiff = firstRecord.measurementValue - secondRecord.measurementValue
  const groupingDiff = firstRecord.groupingValue - secondRecord.groupingValue

  const tieBreak = groupingIsMoreBetter ? groupingDiff > 0 : groupingDiff < 0
  const isMeasurementMore = isMoreBetter ? measurementDiff > 0 : measurementDiff < 0
  
  return isMeasurementMore || (isTied && tieBreak)
}

const isNewSetBetterThanCurrent = (newSet: WorkoutSet, currentSet: ExerciseRecordSet) => {
  const isMoreBetter = newSet.exercise.measurements[newSet.exercise.measuredBy]!.moreIsBetter
  const groupingIsMoreBetter = newSet.exercise.measurements[newSet.exercise.groupRecordsBy]!.moreIsBetter

  const isTied = currentSet.measurementValue === newSet.measurementValue

  const measurementDiff = newSet.measurementValue - currentSet.measurementValue
  const groupingDiff = newSet.groupingValue - currentSet.groupingValue

  const tieBreak = groupingIsMoreBetter ? groupingDiff > 0 : groupingDiff < 0
  const isMeasurementMore = isMoreBetter ? measurementDiff > 0 : measurementDiff < 0
  
  return isMeasurementMore || (isTied && tieBreak)
}