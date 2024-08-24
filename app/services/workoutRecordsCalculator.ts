import { destroy, getSnapshot } from "mobx-state-tree"

import { 
  ExerciseRecord, 
  ExerciseRecordSnapshotIn, 
  Workout, 
  WorkoutSet, 
  WorkoutSetSnapshotIn
} from "app/db/models"

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
        updateSnapshotRecordIfNecessary(record, set)
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

export const updateSnapshotRecordIfNecessary = (
  record: ExerciseRecordSnapshotIn, 
  set: WorkoutSet
) => {
  const newRecord = getSnapshot(set);
  const grouping = getDataFieldForKey(set.exercise.groupRecordsBy);
  const currentRecordIndex = record.recordSets!.findIndex(s => s[grouping] === set.groupingValue);

  if (currentRecordIndex !== -1) {
    const currentRecord = record.recordSets![currentRecordIndex];
    if (isNewSetBetterThanCurrent(set, currentRecord)) {
      record.recordSets = [
        ...record.recordSets!.slice(0, currentRecordIndex),
        newRecord,
        ...record.recordSets!.slice(currentRecordIndex + 1)
      ];
    }
  } else {
    record.recordSets = [...record.recordSets!, newRecord];
  }
};

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