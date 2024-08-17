import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import SetDataLabel from '../SetDataLabel'
import { Exercise, WorkoutSet } from 'app/db/models'
import { getFormatedDuration } from 'app/utils/time'

type Props = {
  set: WorkoutSet
  exercise: Exercise
}

const RecordsListItem: React.FC<Props> = ({ set, exercise }) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 24,
      }}
    >
      {exercise.hasRepMeasument && (
        <SetDataLabel
          value={set.reps}
          unit="RM"
          fontSize="md"
        />
      )}
      {exercise.hasWeightMeasument && (
        <SetDataLabel
          value={set.weight}
          unit="kg"
          fontSize="md"
        />
      )}
      {exercise.hasDistanceMeasument && (
        <SetDataLabel
          value={set.distance}
          unit={set.distanceUnit}
          fontSize="md"
        />
      )}
      {exercise.hasTimeMeasument && (
        <SetDataLabel
          value={getFormatedDuration(set.durationSecs)}
          fontSize="md"
        />
      )}
    </View>
  )
}

export default observer(RecordsListItem)
