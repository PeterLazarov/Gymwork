import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import { WorkoutSet } from '../../../db/models'
import { Divider } from '../../../../designSystem'
import { BodyLargeLabel } from '../../../../designSystem/Label'
import WorkoutExerciseSetReadOnlyList from '../WorkoutExerciseSetReadOnlyList/WorkoutExerciseSetReadOnlyList'

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
