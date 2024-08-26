import React from 'react'
import { View } from 'react-native'

import { WorkoutSet } from 'app/db/models'
import { translate } from 'app/i18n'
import { getFormatedDuration } from 'app/utils/time'
import { colors, Icon } from 'designSystem'
import SetWarmupButton from './SetWarmupButton'
import SetDataLabel from '../SetDataLabel'

type Props = {
  set: WorkoutSet
  isRecord?: boolean
  isFocused?: boolean
  calcWorkSetNumber: (set: WorkoutSet) => number
  toggleSetWarmup: (set: WorkoutSet) => void
}

const WorkoutExerciseSetEditItem: React.FC<Props> = ({
  set,
  isRecord,
  isFocused,
  calcWorkSetNumber,
  toggleSetWarmup,
}) => {
  const color = isFocused ? colors.primary : colors.secondaryText

  const number = set.isWarmup ? undefined : calcWorkSetNumber(set)

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        paddingVertical: 1,
        backgroundColor: isFocused ? colors.primaryLighter : undefined,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          flexDirection: 'row',
          paddingVertical: 4,
          gap: 4,
        }}
      >
        <SetWarmupButton
          isWarmup={set.isWarmup}
          toggleSetWarmup={() => toggleSetWarmup(set)}
          number={number}
          color={color}
        />
        {isRecord && (
          <Icon
            icon="trophy"
            color={colors.primary}
          />
        )}
      </View>
      {set.exercise.hasRepMeasument && (
        <SetDataLabel
          value={set.reps}
          unit={translate('reps')}
          isFocused={isFocused}
        />
      )}
      {set.exercise.hasWeightMeasument && (
        <SetDataLabel
          value={set.weight}
          unit={set.exercise.measurements.weight!.unit}
          isFocused={isFocused}
        />
      )}
      {set.exercise.hasDistanceMeasument && (
        <SetDataLabel
          value={set.distance}
          unit={set.exercise.measurements.distance!.unit}
          isFocused={isFocused}
        />
      )}
      {set.exercise.hasTimeMeasument && (
        <SetDataLabel
          value={getFormatedDuration(set.duration)}
          isFocused={isFocused}
        />
      )}
      {set.exercise.measurements.rest && (
        <SetDataLabel
          value={`${translate('rest')} ${getFormatedDuration(
            set.rest ?? 0,
            true
          )}`}
          isFocused={isFocused}
        />
      )}
    </View>
  )
}

export default WorkoutExerciseSetEditItem
