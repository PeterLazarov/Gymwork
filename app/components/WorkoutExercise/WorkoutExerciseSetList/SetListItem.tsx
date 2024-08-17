import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Text } from 'react-native'

import SetDataLabel from '../SetDataLabel'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, WorkoutSet } from 'app/db/models'
import { getFormatedDuration } from 'app/utils/time'
import { translate } from 'app/i18n'
import { Icon, colors, fontSize } from 'designSystem'

type Props = {
  set: WorkoutSet
  exercise: Exercise
  number?: number
  isFocused?: boolean
  hideRecords?: boolean
}

const SetListItem: React.FC<Props> = ({
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
            <Text
              style={{
                fontSize: fontSize.sm,
                color,
                fontWeight: 'bold',
                marginLeft: 8,
              }}
            >
              {/* TODO: remove space */}
              {number}.{' '}
            </Text>
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
          unit={translate('reps')}
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

export default observer(SetListItem)