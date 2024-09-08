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
        borderColor: colors.neutralDark,
        borderWidth: 1,
      }}
      key={date}
    >
      <Text
        style={{ fontSize: fontSize.md, textAlign: 'center', paddingTop: 4 }}
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
          records={records}
          splitSupersets
        />
      </View>
    </View>
  )
}

export default ExerciseHistoryListItem
