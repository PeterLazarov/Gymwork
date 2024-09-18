import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'

import {
  Text,
  Card,
  FeedbackPickerOption,
  fontSize,
  useColors,
} from 'designSystem'
import { discomfortOptions, feelingOptions, Workout } from 'app/db/models'
import { translate } from 'app/i18n'

export type WorkoutCommentsCardProps = {
  workout: Workout
  onPress?(): void
}

const WorkoutCommentsCard: React.FC<WorkoutCommentsCardProps> = ({
  workout,
  onPress,
}) => {
  const colors = useColors()
  const hasNotes = workout.notes !== ''

  return (
    <Card
      style={{ padding: 0 }}
      onPress={onPress}
      content={
        <View
          style={{
            alignItems: 'center',
            gap: 12,
            padding: 12,
          }}
        >
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {hasNotes && (
              <Text
                style={{
                  fontSize: fontSize.sm,
                  color: colors.onSurface,
                }}
              >
                {workout.notes}
              </Text>
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {workout.rpe !== undefined && (
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                {translate('diffValue', { rpe: workout.rpe })}
              </Text>
            )}
            {workout.pain && (
              <FeedbackPickerOption
                option={discomfortOptions[workout.pain]}
                isSelected
                style={{ backgroundColor: 'transparent', flex: 1 }}
              />
            )}
            {workout.feeling && (
              <FeedbackPickerOption
                option={feelingOptions[workout.feeling]}
                isSelected
                style={{ backgroundColor: 'transparent', flex: 1 }}
              />
            )}
          </View>
        </View>
      }
    />
  )
}

export default observer(WorkoutCommentsCard)
