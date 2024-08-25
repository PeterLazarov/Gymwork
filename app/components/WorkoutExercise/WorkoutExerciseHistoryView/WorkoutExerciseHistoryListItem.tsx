import { DateTime } from 'luxon'
import React from 'react'
import { View, Text } from 'react-native'

import WorkoutExerciseSetList from '../WorkoutExerciseSetList'
import { WorkoutSet } from 'app/db/models'
import { Divider, fontSize } from 'designSystem'

type Props = {
  date: string
  sets: WorkoutSet[]
}
const WorkoutExerciseHistoryListItem: React.FC<Props> = ({ date, sets }) => {
  return (
    <View
      style={{ gap: 8, marginBottom: 12 }}
      key={date}
    >
      <Text style={{ fontSize: fontSize.md, textAlign: 'center' }}>
        {DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)}
      </Text>
      <Divider orientation="horizontal" />
      <WorkoutExerciseSetList sets={sets} />
    </View>
  )
}

export default WorkoutExerciseHistoryListItem
