import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Text } from 'react-native'

import SetDataLabel from '../SetDataLabel'
import { Exercise, WorkoutSet } from 'app/db/models'
import { getFormatedDuration } from 'app/utils/time'
import { translate } from 'app/i18n'

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
      {set.isWeakAss && <Text>W</Text>}
      {exercise.hasRepMeasument && (
        <SetDataLabel
          value={set.reps}
          unit={translate('reps')}
          fontSize="md"
        />
      )}
      {exercise.hasWeightMeasument && (
        <SetDataLabel
          value={set.weight}
          unit={exercise.measurements.weight?.unit}
          fontSize="md"
        />
      )}
      {exercise.hasDistanceMeasument && (
        <SetDataLabel
          value={set.distance}
          unit={exercise.measurements.distance?.unit}
          fontSize="md"
        />
      )}
      {exercise.hasTimeMeasument && (
        <SetDataLabel
          value={getFormatedDuration(set.duration)}
          fontSize="md"
        />
      )}
    </View>
  )
}

export default observer(RecordsListItem)
