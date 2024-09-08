import { DateTime } from 'luxon'
import React from 'react'
import { View, Text } from 'react-native'

import { Exercise, ExerciseRecord, WorkoutStep } from 'app/db/models'
import { Divider, fontSize, colors } from 'designSystem'
import StepSetsList from 'app/components/WorkoutStep/StepSetsList'

type Props = {
  date: string
  step: WorkoutStep
  records: ExerciseRecord
  exercise: Exercise
}
const ExerciseHistoryListItem: React.FC<Props> = ({ date, step, records }) => {
  return (
    <View
      style={{
        gap: 8,
        marginBottom: 12,
        borderRadius: 8,
        borderColor: colors.neutral,
        borderWidth: 1,
        padding: 4,
      }}
      key={date}
    >
      <Text style={{ fontSize: fontSize.md, textAlign: 'center' }}>
        {DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)}
      </Text>
      <Divider
        orientation="horizontal"
        variant="neutral"
      />
      <StepSetsList
        step={step}
        records={records}
        splitSupersets
      />
    </View>
  )
}

export default ExerciseHistoryListItem
