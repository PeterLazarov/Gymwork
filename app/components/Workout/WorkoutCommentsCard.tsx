import React from 'react'
import { observer } from 'mobx-react-lite'
import { View, Text } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { Card, Icon, colorSchemas, fontSize } from 'designSystem'

const WorkoutCommentsCard: React.FC = () => {
  const { stateStore } = useStores()
  const workout = stateStore.openedWorkout!

  const hasNotes = workout.notes !== ''

  function onPress() {
    navigate('WorkoutFeedback')
  }

  const feelingIcon = {
    sad: 'emoji-sad',
    neutral: 'emoji-happy',
    happy: 'grin-stars',
  } as const

  const painIcon = {
    pain: 'alert-decagram-outline',
    discomfort: 'warning-outline',
    noPain: 'check',
  } as const

  const feelingColor = {
    sad: colorSchemas.coral.hue600,
    neutral: colorSchemas.amber.hue600,
    happy: colorSchemas.green.hue600,
  } as const
  const painColor = {
    pain: colorSchemas.coral.hue600,
    discomfort: colorSchemas.amber.hue600,
    noPain: colorSchemas.green.hue600,
  } as const

  return (
    <Card
      onPress={onPress}
      content={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1 }}>
            {hasNotes && (
              <Text style={{ fontSize: fontSize.sm }}>{workout.notes}</Text>
            )}
          </View>

          <Icon
            icon={painIcon[workout.pain]}
            size="large"
            color={painColor[workout.pain]}
          />
          <Icon
            icon={feelingIcon[workout.feeling]}
            size="large"
            color={feelingColor[workout.feeling]}
          />
        </View>
      }
    />
  )
}

export default observer(WorkoutCommentsCard)
