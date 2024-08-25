import { destroy, getSnapshot } from "mobx-state-tree"

import { 
  ExerciseRecord, 
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

export const updateRecordsWithLatestBest = (
  records: WorkoutSet[], 
  newRecord: WorkoutSet, 
): WorkoutSetSnapshotIn[] => {
  const currentRecord = records.find(record => record.groupingValue === newRecord.groupingValue)

  const recordSets = records.map(record => getSnapshot(record))
  const newRecordSnapshot = getSnapshot(newRecord)
  
  if (currentRecord) {
    const index = records.indexOf(currentRecord)
    recordSets[index] = newRecordSnapshot
    destroy(currentRecord)
  } else {
    recordSets.push(newRecordSnapshot)
  }

  return recordSets
}

export const updateRecordsIfNecessary = (
  recordSets: WorkoutSet[], 
  setToCompare: WorkoutSet
): WorkoutSet[] => {
  const grouping = getDataFieldForKey(setToCompare.exercise.groupRecordsBy);
  const currentRecordIndex = recordSets!.findIndex(s => s[grouping] === setToCompare.groupingValue);

  let updatedRecords = recordSets
  if (currentRecordIndex !== -1) {
    const currentRecord = updatedRecords[currentRecordIndex];
    if (setToCompare.isBetterThan(currentRecord)) {
      updatedRecords.splice(currentRecordIndex, 1, setToCompare);
    }
  } else {
    updatedRecords.push(setToCompare);

  }

  return updatedRecords
};

export const getDataFieldForKey = (key: string): keyof WorkoutSetSnapshotIn => {
  const dataFieldsMap = {
    weight: 'weightMcg',
    time: 'durationMs',
    reps: 'reps',
    distance: 'distanceMm',
  }
  return dataFieldsMap[key as keyof typeof dataFieldsMap] as keyof WorkoutSetSnapshotIn
}
