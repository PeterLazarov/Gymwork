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
import { painOptions, feelingOptions, Workout } from 'app/db/models'
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
      onPress={onPress}
      content={
        <View style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            {hasNotes && (
              <Text
                style={{ fontSize: fontSize.sm, color: colors.tertiaryText }}
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
              <Text>{translate('diffValue', { rpe: workout.rpe })}</Text>
            )}
            {workout.pain && (
              <FeedbackPickerOption
                option={painOptions[workout.pain]}
                isSelected
                noPadding
              />
            )}
            {workout.feeling && (
              <FeedbackPickerOption
                option={feelingOptions[workout.feeling]}
                isSelected
                noPadding
              />
            )}
          </View>
        </View>
      }
    />
  )
}

export default observer(WorkoutCommentsCard)
