import {
  ExerciseRecord,
  WorkoutSetSnapshotIn,
  measurementName,
} from '../db/models/index.ts'

export const markWeakAssRecords = (
  exerciseAllRecords: ExerciseRecord
): void => {
  const groupingsDescending = Object.keys(exerciseAllRecords.groupingRecordMap)
    .map(Number)
    .sort((a, b) => b - a)

  if (groupingsDescending.length === 0) return

  let lastRecord =
    exerciseAllRecords.groupingRecordMap[groupingsDescending[0]!]!

  for (const grouping of groupingsDescending) {
    const record = exerciseAllRecords.groupingRecordMap[grouping]!

    if (lastRecord.guid !== record.guid && lastRecord.isBetterThan(record)) {
      const weakAssRecord = exerciseAllRecords.recordSetsMap[record.guid]
      weakAssRecord?.setProp('isWeakAssRecord', true)
    } else {
      const strongAssRecord = exerciseAllRecords.recordSetsMap[lastRecord.guid]
      strongAssRecord?.setProp('isWeakAssRecord', false)
      lastRecord = record
    }
  }
}

export const getDataFieldForKey = (
  key: measurementName
): keyof WorkoutSetSnapshotIn => {
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
