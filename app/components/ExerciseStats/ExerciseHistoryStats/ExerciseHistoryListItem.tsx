import { DateTime } from 'luxon'
import React from 'react'
import { View, Text } from 'react-native'

import { Exercise, ExerciseRecord, WorkoutSet } from 'app/db/models'
import { Divider, fontSize } from 'designSystem'
import WorkoutExerciseSetList from 'app/components/WorkoutExercise/WorkoutExerciseSetList'

type Props = {
  date: string
  sets: WorkoutSet[]
  records: ExerciseRecord
  exercise: Exercise
}
const WorkoutExerciseHistoryListItem: React.FC<Props> = ({
  date,
  sets,
  records,
  exercise,
}) => {
  return (
    <View
      style={{ gap: 8, marginBottom: 12 }}
      key={date}
    >
      <Text style={{ fontSize: fontSize.md, textAlign: 'center' }}>
        {DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)}
      </Text>
      <Divider orientation="horizontal" />
      <WorkoutExerciseSetList
        sets={sets}
        records={records}
        exercise={exercise}
      />
    </View>
  )
}

export default WorkoutExerciseHistoryListItem
