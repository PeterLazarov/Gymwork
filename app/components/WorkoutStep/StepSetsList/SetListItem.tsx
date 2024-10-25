import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'

import SetDataLabel from '../SetDataLabel'
import { ExerciseMeasurement, WorkoutSet } from 'app/db/models'
import { getFormatedDuration } from 'app/utils/time'
import { translate } from 'app/i18n'
import {
  Text,
  Icon,
  useColors,
  fontSize,
  palettes,
  spacing,
} from 'designSystem'
import { observer } from 'mobx-react-lite'
import { useStores } from 'app/db/helpers/useStores'

type Props = {
  set: WorkoutSet
  measurements: ExerciseMeasurement
  letter?: string
  number?: number
  isFocused?: boolean
  isRecord?: boolean
  showSetCompletion?: boolean
}

const SetListItem: React.FC<Props> = ({
  set,
  measurements,
  isFocused,
  isRecord,
  letter,
  number,
  showSetCompletion,
}) => {
  const colors = useColors()
  const { settingsStore } = useStores()
  const color = isFocused ? colors.tertiary : colors.onSurface
  const styles = useMemo(() => makeStyles(color), [color])

  return (
    <View style={styles.item}>
      <View style={styles.indexColumn}>
        {!set.isWarmup && <Text style={styles.setNumber}>{number}.</Text>}
        {set.isWarmup && (
          <Icon
            icon="yoga"
            color={color}
          />
        )}
        {letter && <Text style={styles.setLetter}>{letter}</Text>}
        {isRecord && (
          <Icon
            icon="trophy"
            color={palettes.gold['80']}
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
      {measurements.duration && set.duration !== undefined && (
        <SetDataLabel
          value={getFormatedDuration(set.duration)}
          isFocused={isFocused}
        />
      )}
      {settingsStore.measureRest && set.rest !== undefined && (
        <SetDataLabel
          value={getFormatedDuration(set.rest)}
          isFocused={isFocused}
        />
      )}

      {showSetCompletion && (
        <Icon
          size="small"
          icon={'check'}
          color={set.completed ? color : colors.outlineVariant}
        />
      )}
    </View>
  )
}

const makeStyles = (textColor: string) =>
  StyleSheet.create({
    item: {
      display: 'flex',
      flexDirection: 'row',
      gap: spacing.md,
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 24,
    },
    indexColumn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxs,
    },
    setNumber: {
      fontSize: fontSize.sm,
      color: textColor,
      fontWeight: 'bold',
      marginLeft: spacing.xs,
    },
    setLetter: {
      fontSize: fontSize.sm,
      color: textColor,
      fontWeight: 'bold',
    },
  })

export default observer(SetListItem)
