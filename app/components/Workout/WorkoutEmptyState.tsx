import React from 'react'
import { Text, View } from 'react-native'

import { translate } from 'app/i18n'
import { Card, Icon, fontSize } from 'designSystem'
import { navigate } from 'app/navigators'
import { useStores } from 'app/db/helpers/useStores'
import EmptyState from '../EmptyState'

const WorkoutEmptyState: React.FC = () => {
  const { workoutStore } = useStores()
  const hasWorkouts = workoutStore.workouts.length > 0

  function copyWorkout() {
    navigate('Calendar', {
      copyWorkoutMode: true,
    })
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {hasWorkouts && (
        <Card
          containerStyle={{ paddingHorizontal: 8 }}
          onPress={copyWorkout}
          content={
            <View style={{ alignItems: 'center' }}>
              <Icon
                icon="copy-outline"
                style={{ paddingBottom: 10 }}
              />
              <Text style={{ fontSize: fontSize.md }}>
                {translate('copyWorkout')}
              </Text>
            </View>
          }
        />
      )}
      {!hasWorkouts && <EmptyState text={translate('noWorkoutsEntered')} />}
    </View>
  )
}

export default WorkoutEmptyState
