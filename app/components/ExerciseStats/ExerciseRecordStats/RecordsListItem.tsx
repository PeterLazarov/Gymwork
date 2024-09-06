import React from 'react'
import { View } from 'react-native'

import { WorkoutSet } from 'app/db/models'
import SetDataLabel from 'app/components/WorkoutStep/SetDataLabel'

type Props = {
  set: WorkoutSet
}

const RecordsListItem: React.FC<Props> = ({ set }) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 32,
        flex: 1,
        opacity: set.isWeakAssRecord ? 0.5 : 1,
      }}
    >
      <SetDataLabel
        value={set[set.exercise.groupRecordsBy]}
        unit={set.exercise.groupMeasurement.unit}
        fontSize="md"
      />

      <SetDataLabel
        value={set[set.exercise.measuredBy]}
        unit={set.exercise.valueMeasurement.unit}
        fontSize="md"
      />
    </View>
  )
}

export default RecordsListItem
