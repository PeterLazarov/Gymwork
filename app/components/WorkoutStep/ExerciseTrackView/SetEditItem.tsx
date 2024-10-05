import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'

import { WorkoutSet } from 'app/db/models'
import { translate } from 'app/i18n'
import { getFormatedDuration } from 'app/utils/time'
import { useColors, Icon, palettes } from 'designSystem'
import SetWarmupButton from './SetWarmupButton'
import SetDataLabel from '../SetDataLabel'
import { useStores } from 'app/db/helpers/useStores'

type Props = {
  set: WorkoutSet
  isRecord?: boolean
  number?: number
  toggleSetWarmup: (set: WorkoutSet) => void
  draft?: boolean
} & View['props']

const hideZeroRest = true

const SetEditItem: React.FC<Props> = ({
  set,
  isRecord,
  number,
  toggleSetWarmup,
  style,
  draft,
  ...rest
}) => {
  const colors = useColors()
  const { settingsStore } = useStores()

  const color = colors.onSurface

  const symbol = set.isWarmup ? undefined : draft ? '+' : String(number)

  return (
    <View
      style={[
        {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingHorizontal: 10,
          paddingVertical: 1,
          backgroundColor: draft ? colors.surfaceContainer : undefined,
        },
        style,
      ]}
      {...rest}
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
          symbol={symbol}
          color={color}
        />
        {isRecord && (
          <Icon
            icon="trophy"
            color={palettes.gold['80']}
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
          value={set.distance ?? set.inferredDistance?.toFixed(2)}
          unit={set.exercise.measurements.distance!.unit}
        />
      )}
      {set.exercise.hasTimeMeasument && (
        <SetDataLabel
          value={getFormatedDuration(
            set.duration ??
              (set.inferredDuration ? +set.inferredDuration.toFixed(2) : 0)
          )}
        />
      )}
      {set.exercise.measurements.speed && (
        <SetDataLabel
          value={set.speed ?? set.inferredSpeed}
          unit={set.exercise.measurements.speed!.unit}
          fixDecimals
        />
      )}
      {settingsStore.measureRest && (
        <SetDataLabel
          value={
            set.rest || !hideZeroRest
              ? `${translate('rest')} ${getFormatedDuration(
                  set.rest ?? 0,
                  true
                )}`
              : ''
          }
        />
      )}
    </View>
  )
}

export default observer(SetEditItem)
