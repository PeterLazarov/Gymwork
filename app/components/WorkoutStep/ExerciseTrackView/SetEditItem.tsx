import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'

import { WorkoutSet } from 'app/db/models'
import { translate } from 'app/i18n'
import { getFormatedDuration } from 'app/utils/time'
import { useColors, Icon, palettes, iconSizes } from 'designSystem'
import SetEditItemButton from './SetEditItemButton'
import SetDataLabel from '../SetDataLabel'
import { useStores } from 'app/db/helpers/useStores'
import { spacing } from 'designSystem/tokens/spacing'

type Props = {
  set: WorkoutSet
  isRecord?: boolean
  number?: number
  toggleSetWarmup: (set: WorkoutSet) => void
  draft?: boolean
  showSetCompletion?: boolean
} & View['props']

const hideZeroRest = false

const SetEditItem: React.FC<Props> = ({
  set,
  isRecord,
  number,
  toggleSetWarmup,
  style,
  draft,
  showSetCompletion,
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
          paddingHorizontal: spacing.xs,
          paddingVertical: spacing.xxs,
        },
        style,
      ]}
      {...rest}
    >
      <View
        style={{
          paddingVertical: spacing.xxs,
          gap: spacing.xs,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <SetEditItemButton
          icon={set.isWarmup ? 'yoga' : undefined}
          onPress={() => toggleSetWarmup(set)}
          symbol={symbol}
          color={color}
        />
        <Icon
          icon="trophy"
          color={isRecord ? palettes.gold['80'] : 'transparent'}
        />
      </View>

      {set.exercise.measurements.reps && (
        <SetDataLabel
          value={set.reps}
          unit={translate('reps')}
        />
      )}
      {set.exercise.measurements.weight && (
        <SetDataLabel
          value={set.weight}
          unit={set.exercise.measurements.weight!.unit}
        />
      )}
      {set.exercise.measurements.distance && (
        <SetDataLabel
          value={set.distance ?? set.inferredDistance?.toFixed(2)}
          unit={set.exercise.measurements.distance!.unit}
        />
      )}
      {set.exercise.measurements.duration && (
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

      {showSetCompletion && (
        <SetEditItemButton
          icon={'check'}
          disabled={draft}
          onPress={() => {
            set.setProp('completedAt', set.completed ? null : new Date())
          }}
          color={set.completed ? color : colors.outlineVariant}
        />
      )}
    </View>
  )
}

export default observer(SetEditItem)
