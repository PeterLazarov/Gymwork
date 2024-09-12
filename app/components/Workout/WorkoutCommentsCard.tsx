import React from 'react'
import { View, Text } from 'react-native'

import { navigate } from 'app/navigators'
import { Card, FeedbackPickerOption, fontSize } from 'designSystem'
import { painOptions, feelingOptions, Workout } from 'app/db/models'

export type WorkoutCommentsCardProps = {
  workout: Workout
  onPress?(): void
}

const WorkoutCommentsCard: React.FC<WorkoutCommentsCardProps> = ({
  workout,
  onPress,
}) => {
  const hasNotes = workout.notes !== ''

  return (
    <Card
      onPress={onPress}
      content={
        <View style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            {hasNotes && (
              <Text style={{ fontSize: fontSize.sm }}>{workout.notes}</Text>
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
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

export default WorkoutCommentsCard
