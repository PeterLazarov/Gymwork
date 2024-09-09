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

const SetEditItem: React.FC<Props> = ({
  set,
  isRecord,
  isFocused,
  calcWorkSetNumber,
  toggleSetWarmup,
}) => {
  const color = colors.neutralText

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
        backgroundColor: isFocused ? colors.accentLightest : undefined,
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
            color={colors.accent}
          />
        )}
      </View>
      {set.exercise.hasRepMeasument && (
        <SetDataLabel
          value={set.reps}
          unit={translate('reps')}
        />
      )}
      {set.exercise.hasWeightMeasument && (
        <SetDataLabel
          value={set.weight}
          unit={set.exercise.measurements.weight!.unit}
        />
      )}
      {set.exercise.hasDistanceMeasument && (
        <SetDataLabel
          value={set.distance}
          unit={set.exercise.measurements.distance!.unit}
        />
      )}
      {set.exercise.hasTimeMeasument && (
        <SetDataLabel value={getFormatedDuration(set.duration)} />
      )}
      {set.exercise.measurements.rest && (
        <SetDataLabel
          value={`${translate('rest')} ${getFormatedDuration(
            set.rest ?? 0,
            true
          )}`}
        />
      )}
    </View>
  )
}

export default SetEditItem
