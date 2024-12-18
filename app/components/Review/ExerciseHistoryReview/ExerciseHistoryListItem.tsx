import { DateTime } from 'luxon'
import React from 'react'
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import StepSetsList from 'app/components/WorkoutStep/StepSetsList'
import { WorkoutSet, WorkoutStep } from 'app/db/models'
import { Divider, Text, ThemedStyle } from 'designSystem'

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
  const {
    theme: { spacing },
    themed,
  } = useAppTheme()

  return (
    <TouchableOpacity
      style={themed($item)}
      key={date}
      onPress={onPress}
    >
      <>
        <Text style={themed($itemDate)}>
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

const $item: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderColor: colors.onSurfaceVariant,
  borderRadius: spacing.xs,
  borderWidth: 1,
  gap: spacing.xs,
  marginBottom: spacing.sm,
})

const $itemDate: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  paddingTop: spacing.xxs,
  textAlign: 'center',
})

export default ExerciseHistoryListItem
