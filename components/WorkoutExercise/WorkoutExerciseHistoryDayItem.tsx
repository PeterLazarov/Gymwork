import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import WorkoutExerciseSetListItem from './WorkoutExerciseSetListItem'
import { WorkoutSet } from '../../db/models'
import { Divider } from '../../designSystem'
import { SectionLabel } from '../../designSystem/Label'

type Props = {
  date: string
  sets: WorkoutSet[]
}
const WorkoutExerciseHistoryDayItem: React.FC<Props> = ({ date, sets }) => {
  return (
    <View
      style={{ gap: 8 }}
      key={date}
    >
      <SectionLabel>
        {DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)}
      </SectionLabel>
      <Divider />
      {sets.map((set, i) => (
        <WorkoutExerciseSetListItem
          key={i}
          set={set}
        />
      ))}
    </View>
  )
}

export default observer(WorkoutExerciseHistoryDayItem)
