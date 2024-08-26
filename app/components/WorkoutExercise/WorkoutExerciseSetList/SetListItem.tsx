import React from 'react'
import { View, Text } from 'react-native'

import SetDataLabel from '../SetDataLabel'
import { Exercise, WorkoutSet } from 'app/db/models'
import { getFormatedDuration } from 'app/utils/time'
import { translate } from 'app/i18n'
import { Icon, colors, fontSize } from 'designSystem'

type Props = {
  set: WorkoutSet
  exercise: Exercise
  number?: number
  isFocused?: boolean
  isRecord?: boolean
  hideRecords?: boolean
}

const SetListItem: React.FC<Props> = ({
  set,
  exercise,
  isFocused,
  isRecord,
  number,
  hideRecords = false,
}) => {
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
          unit={set.exercise.measurements.weight!.unit}
        />
      )}
      {exercise.hasDistanceMeasument && (
        <SetDataLabel
          value={set.distance}
          unit={set.exercise.measurements.distance!.unit}
        />
      )}
      {exercise.hasTimeMeasument && (
        <SetDataLabel value={getFormatedDuration(set.duration)} />
      )}
      {exercise.measurements.rest && (
        <SetDataLabel value={getFormatedDuration(set.rest)} />
      )}
    </View>
  )
}

export default SetListItem
