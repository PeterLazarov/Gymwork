import React from 'react'
import { View, Text } from 'react-native'

import SetDataLabel from '../SetDataLabel'
import { Exercise, WorkoutSet } from 'app/db/models'
import { getFormatedDuration } from 'app/utils/time'
import { translate } from 'app/i18n'
import { Icon, colors, fontSize } from 'designSystem'
import { observer } from 'mobx-react-lite'

type Props = {
  set: WorkoutSet
  exercise: Exercise
  number?: number
  letter?: string
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
  letter,
  hideRecords = false,
}) => {
  const color = isFocused ? colors.accent : colors.neutralDarkest

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
                marginRight: 4,
              }}
            >
              {number}.
            </Text>
          )}
          {set.isWarmup && (
            <Icon
              icon="yoga"
              color={color}
            />
          )}
          {letter && (
            <Text
              style={{
                fontSize: fontSize.sm,
                color,
                fontWeight: 'bold',
                marginLeft: 4,
              }}
            >
              {letter}
            </Text>
          )}
          {isRecord && (
            <Icon
              icon="trophy"
              color={colors.accent}
              style={{
                marginLeft: 4,
              }}
            />
          )}
        </View>
      )}
      {exercise.hasRepMeasument && (
        <SetDataLabel
          value={set.reps}
          unit={translate('reps')}
          isFocused={isFocused}
        />
      )}
      {exercise.hasWeightMeasument && (
        <SetDataLabel
          value={set.weight}
          unit={exercise.measurements.weight!.unit}
          isFocused={isFocused}
        />
      )}
      {exercise.hasDistanceMeasument && (
        <SetDataLabel
          value={set.distance}
          unit={exercise.measurements.distance!.unit}
          isFocused={isFocused}
        />
      )}
      {exercise.hasTimeMeasument && (
        <SetDataLabel
          value={getFormatedDuration(set.duration)}
          isFocused={isFocused}
        />
      )}
      {exercise.measurements.rest && (
        <SetDataLabel
          value={getFormatedDuration(set.rest)}
          isFocused={isFocused}
        />
      )}
    </View>
  )
}

export default observer(SetListItem)
