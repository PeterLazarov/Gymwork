import React from 'react'

import { WorkoutSet } from 'app/db/models'
import SetDataLabel from 'app/components/WorkoutStep/SetDataLabel'
import { TouchableOpacity } from 'react-native'

type Props = {
  set: WorkoutSet
  onPress: () => void
}

const RecordsListItem: React.FC<Props> = ({ set, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 40,
        flex: 1,
        opacity: set.isWeakAssRecord ? 0.5 : 1,
      }}
    >
      <>
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
      </>
    </TouchableOpacity>
  )
}

export default RecordsListItem
