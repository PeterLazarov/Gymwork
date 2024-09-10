import React from 'react'
import { observer } from 'mobx-react-lite'
import { View, Text } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { Card, FeedbackPickerOption, fontSize } from 'designSystem'
import { painOptions, feelingOptions } from 'app/db/models'

const WorkoutCommentsCard: React.FC = () => {
  const { stateStore } = useStores()
  const workout = stateStore.openedWorkout!

  const hasNotes = workout.notes !== ''

  function onPress() {
    navigate('WorkoutFeedback')
  }

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

export default observer(WorkoutCommentsCard)
