import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import WorkoutExerciseSetReadOnlyList from '../WorkoutExerciseSetReadOnlyList/WorkoutExerciseSetReadOnlyList'
import { WorkoutSet } from 'app/db/models'
import { Divider, BodyLargeLabel } from 'designSystem'

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
      <BodyLargeLabel style={{ textAlign: 'center' }}>
        {DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)}
      </BodyLargeLabel>
      <Divider orientation="horizontal" />
      <WorkoutExerciseSetReadOnlyList sets={sets} />
    </View>
  )
}

export default observer(WorkoutExerciseHistoryListItem)
