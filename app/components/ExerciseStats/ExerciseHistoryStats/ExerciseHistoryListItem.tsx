import { DateTime } from 'luxon'
import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { Exercise, WorkoutStep } from 'app/db/models'
import { Divider, fontSize, useColors, PressableHighlight } from 'designSystem'
import StepSetsList from 'app/components/WorkoutStep/StepSetsList'

type Props = {
  date: string
  step: WorkoutStep
  exercise: Exercise
  onPress?(): void
}
const ExerciseHistoryListItem: React.FC<Props> = ({
  date,
  step,
  exercise,
  onPress,
}) => {
  const colors = useColors()

  const styles = useMemo(() => makeStyles(colors), [colors])

  const sets = step.exerciseSetsMap[exercise.guid] || []

  return (
    <PressableHighlight
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
        <View style={{ padding: 4 }}>
          <StepSetsList
            step={step}
            sets={sets}
            hideSupersetLetters
          />
        </View>
      </>
    </PressableHighlight>
  )
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    item: {
      gap: 8,
      marginBottom: 12,
      borderRadius: 8,
      borderColor: colors.neutralDark,
      borderWidth: 1,
    },
    itemDate: {
      fontSize: fontSize.md,
      textAlign: 'center',
      paddingTop: 4,
      color: colors.neutralText,
    },
  })

export default ExerciseHistoryListItem
