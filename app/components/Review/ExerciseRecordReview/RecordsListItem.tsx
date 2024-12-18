import React, { useMemo } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import SetDataLabel from 'app/components/WorkoutStep/SetDataLabel'
import { WorkoutSet } from 'app/db/models'
import { spacing } from 'designSystem'

type Props = {
  set: WorkoutSet
  onPress: () => void
}

const RecordsListItem: React.FC<Props> = ({ set, onPress }) => {
  const styles = useMemo(
    () => makeStyles(set.isWeakAssRecord),
    [set.isWeakAssRecord]
  )

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.item}
    >
      <>
        <SetDataLabel
          value={set[set.exercise.groupRecordsBy!]}
          unit={set.exercise.groupMeasurement.unit}
          fontSize="md"
        />

        <SetDataLabel
          value={set[set.exercise.measuredBy!]}
          unit={set.exercise.valueMeasurement.unit}
          fontSize="md"
        />
      </>
    </TouchableOpacity>
  )
}

const makeStyles = (isWeakAss: boolean) =>
  StyleSheet.create({
    item: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      gap: spacing.md,
      height: 40,
      justifyContent: 'space-around',
      opacity: isWeakAss ? 0.5 : 1,
    },
  })

export default RecordsListItem
