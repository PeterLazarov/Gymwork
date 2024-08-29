import { destroy, getSnapshot } from 'mobx-state-tree'

import { ExerciseRecord, WorkoutSet, WorkoutSetSnapshotIn } from 'app/db/models'

export const removeWeakAssRecords = (
  exerciseAllRecords: ExerciseRecord
): void => {
  const groupingsDescending = Object.keys(exerciseAllRecords.groupingRecordMap)
    .map(Number)
    .sort((a, b) => b - a)

  let lastRecord = exerciseAllRecords.groupingRecordMap[groupingsDescending[0]]

  for (const grouping of groupingsDescending) {
    const record = exerciseAllRecords.groupingRecordMap[grouping]

    if (lastRecord.guid !== record.guid && lastRecord.isBetterThan(record)) {
      const weakAssRecord = exerciseAllRecords.recordSets.find(
        set => set.guid === record.guid
      )
      weakAssRecord?.setProp('isWeakAssRecord', true)
    } else {
      const strongAssRecord = exerciseAllRecords.recordSets.find(
        set => set.guid === lastRecord.guid
      )
      strongAssRecord?.setProp('isWeakAssRecord', false)

      lastRecord = record
    }
  }
}

export const isNewRecord = (records: ExerciseRecord, set: WorkoutSet) => {
  const currentRecord = records.groupingRecordMap[set.groupingValue]
  return !currentRecord || set.isBetterThan(currentRecord)
}

export const updateRecordsWithLatestBest = (
  records: ExerciseRecord,
  newRecord: WorkoutSet
): WorkoutSetSnapshotIn[] => {
  const currentRecord = records.groupingRecordMap[newRecord.groupingValue]

  const recordSets = records.recordSets.map(record => getSnapshot(record))
  const newRecordSnapshot = getSnapshot(newRecord)

  if (currentRecord) {
    const index = records.recordSets.indexOf(currentRecord)
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
  const grouping = getDataFieldForKey(setToCompare.exercise.groupRecordsBy)
  const currentRecordIndex = recordSets!.findIndex(
    s => s[grouping] === setToCompare.groupingValue
  )

  const updatedRecords = recordSets
  if (currentRecordIndex !== -1) {
    const currentRecord = updatedRecords[currentRecordIndex]
    if (setToCompare.isBetterThan(currentRecord)) {
      updatedRecords.splice(currentRecordIndex, 1, setToCompare)
    }
  } else {
    updatedRecords.push(setToCompare)
  }

  return updatedRecords
}

export const getDataFieldForKey = (key: string): keyof WorkoutSetSnapshotIn => {
  const dataFieldsMap = {
    weight: 'weightMcg',
    duration: 'durationMs',
    reps: 'reps',
    distance: 'distanceMm',
  }
  return dataFieldsMap[
    key as keyof typeof dataFieldsMap
  ] as keyof WorkoutSetSnapshotIn
}
