import { ExerciseRecord, WorkoutSetSnapshotIn } from 'app/db/models'

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
