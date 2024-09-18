import { DateTime } from 'luxon'
import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'

import { WorkoutSet, WorkoutStep } from 'app/db/models'
import { Text, Divider, useColors, PressableHighlight } from 'designSystem'
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
      borderColor: colors.mat.onSurfaceVariant,
      borderWidth: 1,
    },
    itemDate: {
      textAlign: 'center',
      paddingTop: 4,
    },
  })

export default ExerciseHistoryListItem
