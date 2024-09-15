import { DateTime } from 'luxon'
import React from 'react'
import { View, Text } from 'react-native'

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

  return (
    <PressableHighlight
      style={{
        gap: 8,
        marginBottom: 12,
        borderRadius: 8,
        borderColor: colors.neutralDark,
        borderWidth: 1,
      }}
      key={date}
      onPress={onPress}
    >
      <>
        <Text
          style={{
            fontSize: fontSize.md,
            textAlign: 'center',
            paddingTop: 4,
            color: colors.neutralText,
          }}
        >
          {DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)}
        </Text>
        <Divider
          orientation="horizontal"
          variant="neutral"
        />
        <View style={{ padding: 4 }}>
          <StepSetsList
            step={step}
            splitSupersets
            focusedExerciseGuid={exercise.guid}
          />
        </View>
      </>
    </PressableHighlight>
  )
}

export default ExerciseHistoryListItem
