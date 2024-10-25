import { DateTime } from 'luxon'
import React, { useMemo } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { WorkoutSet, WorkoutStep } from 'app/db/models'
import { Text, Divider, useColors, spacing } from 'designSystem'
import StepSetsList from 'app/components/WorkoutStep/StepSetsList'

type Props = {
  date: string
  step: WorkoutStep
  sets: WorkoutSet[]
  onPress?(): void
}
const ExerciseHistoryListItem: React.FC<Props> = ({
  date,
  step,
  sets,
  onPress,
}) => {
  const colors = useColors()

  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <TouchableOpacity
      style={styles.item}
      key={date}
      onPress={onPress}
    >
      <>
        <Text style={styles.itemDate}>
          {DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)}
        </Text>
        <Divider
          orientation="horizontal"
          variant="neutral"
        />
        <View style={{ padding: spacing.xxs }}>
          <StepSetsList
            step={step}
            sets={sets}
            hideSupersetLetters
          />
        </View>
      </>
    </TouchableOpacity>
  )
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    item: {
      gap: spacing.xs,
      marginBottom: spacing.sm,
      borderRadius: spacing.xs,
      borderColor: colors.onSurfaceVariant,
      borderWidth: 1,
    },
    itemDate: {
      textAlign: 'center',
      paddingTop: spacing.xxs,
    },
  })

export default ExerciseHistoryListItem
