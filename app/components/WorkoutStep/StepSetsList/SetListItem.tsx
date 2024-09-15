import React from 'react'
import { View, Text } from 'react-native'

import SetDataLabel from '../SetDataLabel'
import { ExerciseMeasurement, WorkoutSet } from 'app/db/models'
import { getFormatedDuration } from 'app/utils/time'
import { translate } from 'app/i18n'
import { Icon, useColors, fontSize } from 'designSystem'
import { observer } from 'mobx-react-lite'

type Props = {
  set: WorkoutSet
  measurements: ExerciseMeasurement
  number?: number
  letter?: string
  isFocused?: boolean
  isRecord?: boolean
}

const SetListItem: React.FC<Props> = ({
  set,
  measurements,
  isFocused,
  isRecord,
  number,
  letter,
}) => {
  const colors = useColors()

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
      {measurements.reps && (
        <SetDataLabel
          value={set.reps}
          unit={translate('reps')}
          isFocused={isFocused}
        />
      )}
      {measurements.weight && (
        <SetDataLabel
          value={set.weight}
          unit={measurements.weight!.unit}
          isFocused={isFocused}
        />
      )}
      {measurements.distance && (
        <SetDataLabel
          value={set.distance}
          unit={measurements.distance.unit}
          isFocused={isFocused}
        />
      )}
      {measurements.duration && (
        <SetDataLabel
          value={getFormatedDuration(set.duration)}
          isFocused={isFocused}
        />
      )}
      {measurements.rest && (
        <SetDataLabel
          value={getFormatedDuration(set.rest)}
          isFocused={isFocused}
        />
      )}
    </View>
  )
}

export default observer(SetListItem)
