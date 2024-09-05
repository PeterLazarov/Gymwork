import React from 'react'
import { observer } from 'mobx-react-lite'
import { View, Text } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { translate } from 'app/i18n'
import { Card, Icon, colorSchemas, colors, fontSize } from 'designSystem'

const WorkoutCommentsCard: React.FC = () => {
  const { stateStore } = useStores()
  const workout = stateStore.openedWorkout!

  const hasNotes = workout.notes !== ''
  const hasExhaustion = workout.exhaustion !== 1
  const hasPain = workout.experiencedPain
  const hasComments = hasNotes || hasExhaustion || hasPain

  function onPress() {
    navigate('WorkoutFeedback')
  }

  const feelingIcon = {
    sad: 'emoji-sad',
    neutral: 'emoji-neutral',
    happy: 'emoji-happy',
  } as const

  const feelingColor = {
    sad: colorSchemas.coral.hue600,
    neutral: colorSchemas.amber.hue600,
    happy: colorSchemas.green.hue600,
  } as const
  return (
    <Card
      onPress={onPress}
      content={
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {hasComments && (
            <>
              <View style={{ flex: 1 }}>
                {hasNotes && (
                  <Text style={{ fontSize: fontSize.sm }}>{workout.notes}</Text>
                )}
                {hasExhaustion && (
                  <Text style={{ fontSize: fontSize.sm }}>
                    {translate('exhaustionOutOf10', {
                      level: workout.exhaustion,
                    })}
                  </Text>
                )}
                {hasPain && (
                  <Text style={{ fontSize: fontSize.sm }}>
                    {translate('experiencedPain')}
                  </Text>
                )}
              </View>

              <Icon
                icon={feelingIcon[workout.feeling]}
                size="large"
                color={feelingColor[workout.feeling]}
              />
            </>
          )}
          {!hasComments && (
            <Text style={{ fontSize: fontSize.sm, color: colors.neutralDark }}>
              {translate('addComments')}
            </Text>
          )}
        </View>
      }
    />
  )
}

export default observer(WorkoutCommentsCard)
