import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import { useStores } from '../../../db/helpers/useStores'
import { Exercise, WorkoutSet } from '../../../db/models'
import { Icon } from '../../../../designSystem'
import { BodyMediumLabel } from '../../../../designSystem/Label'
import colors from '../../../../designSystem/colors'
import texts from '../../../../texts'
import { getFormatedDuration } from '../../../utils/time'
import SetDataLabel from '../SetDataLabel'

type Props = {
  set: WorkoutSet
  exercise: Exercise
  number?: number
  isFocused?: boolean
  hideRecords?: boolean
}

const ReadOnlyListItem: React.FC<Props> = ({
  set,
  exercise,
  isFocused,
  number,
  hideRecords = false,
}) => {
  const { workoutStore } = useStores()

  const exerciseActualRecords = exercise
    ? workoutStore.getExerciseRecords(exercise.guid)
    : {}

  const isRecord = Object.values(exerciseActualRecords).some(
    record => record.guid === set.guid
  )
  const color = isFocused ? colors.primary : colors.secondaryText
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
      {!hideRecords && (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {!set.isWarmup && (
            <BodyMediumLabel
              style={{ color, fontWeight: 'bold', marginLeft: 8 }}
            >
              {number}.{' '}
            </BodyMediumLabel>
          )}
          {set.isWarmup && <Icon icon="yoga" />}
          {isRecord && (
            <Icon
              icon="trophy"
              color={colors.primary}
            />
          )}
        </View>
      )}
      {exercise.hasRepMeasument && (
        <SetDataLabel
          value={set.reps}
          unit={texts.reps}
        />
      )}
      {exercise.hasWeightMeasument && (
        <SetDataLabel
          value={set.weight}
          unit="kg"
        />
      )}
      {exercise.hasDistanceMeasument && (
        <SetDataLabel
          value={set.distance}
          unit={set.distanceUnit}
        />
      )}
      {exercise.hasTimeMeasument && (
        <SetDataLabel value={getFormatedDuration(set.durationSecs)} />
      )}
    </View>
  )
}

export default observer(ReadOnlyListItem)
