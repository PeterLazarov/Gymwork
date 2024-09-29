import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
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
  calcWorkSetNumber: (set: WorkoutSet) => number
  toggleSetWarmup: (set: WorkoutSet) => void
  draft?: boolean
} & View['props']

const hideZeroRest = true

const SetEditItem: React.FC<Props> = ({
  set,
  isRecord,
  calcWorkSetNumber,
  toggleSetWarmup,
  style,
  draft,
  ...rest
}) => {
  const colors = useColors()
  const { settingsStore } = useStores()

  const color = colors.onSurface

  const number = set.isWarmup ? undefined : calcWorkSetNumber(set)

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
          number={draft ? '+' : number} // TODO
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
