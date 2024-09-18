import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'

import SetDataLabel from '../SetDataLabel'
import { ExerciseMeasurement, WorkoutSet } from 'app/db/models'
import { getFormatedDuration } from 'app/utils/time'
import { translate } from 'app/i18n'
import { Text, Icon, useColors, fontSize } from 'designSystem'
import { observer } from 'mobx-react-lite'

type Props = {
  set: WorkoutSet
  measurements: ExerciseMeasurement
  letter?: string
  number?: number
  isFocused?: boolean
  isRecord?: boolean
}

const SetListItem: React.FC<Props> = ({
  set,
  measurements,
  isFocused,
  isRecord,
  letter,
  number,
}) => {
  const colors = useColors()

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
            color={colors.tertiary}
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

const makeStyles = (textColor: string) =>
  StyleSheet.create({
    item: {
      display: 'flex',
      flexDirection: 'row',
      gap: 16,
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 24,
    },
    indexColumn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    setNumber: {
      fontSize: fontSize.sm,
      color: textColor,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    setLetter: {
      fontSize: fontSize.sm,
      color: textColor,
      fontWeight: 'bold',
    },
  })

export default observer(SetListItem)
