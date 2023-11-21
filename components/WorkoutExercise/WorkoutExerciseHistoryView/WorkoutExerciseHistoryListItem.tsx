import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import { WorkoutSet } from '../../../db/models'
import { Divider } from '../../../designSystem'
import { SectionLabel } from '../../../designSystem/Label'
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
      <SectionLabel>
        {DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)}
      </SectionLabel>
      <Divider />
      <WorkoutExerciseSetReadOnlyList sets={sets} />
    </View>
  )
}

export default observer(WorkoutExerciseHistoryListItem)
